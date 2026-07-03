const express = require('express');
const { z } = require('zod');
const { v4: uuidv4 } = require('uuid');
const { Person, Passenger, RefreshToken, EmailVerificationToken, PasswordResetToken } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/auth');

const router = express.Router();

router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token is required' });

    if (!EmailVerificationToken) {
       return res.json({ message: 'Email verified (mock)' });
    }

    const verificationToken = await EmailVerificationToken.findOne({ where: { Token: token } });
    
    if (!verificationToken) {
      return res.status(400).json({ error: 'Invalid or expired verification token.' });
    }

    if (verificationToken.Used) {
      return res.status(400).json({ error: 'This token has already been used.' });
    }

    if (new Date() > new Date(verificationToken.ExpiresAt)) {
      return res.status(400).json({ error: 'This verification token has expired.' });
    }

    // Mark used
    verificationToken.Used = true;
    await verificationToken.save();

    // Mark user verified
    const person = await Person.findByPk(verificationToken.PassengerID); // Note: PassengerID in token points to PersonID technically
    if (person) {
      person.IsEmailVerified = true;
      await person.save();
    }

    res.json({ message: 'Email successfully verified' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const person = await Person.findOne({ where: { Email: email } });
    if (!person) {
      // Return success even if email not found to prevent email enumeration
      return res.json({ message: 'If an account exists, a reset link has been sent.' });
    }

    if (!PasswordResetToken) {
      return res.json({ message: 'Password reset link sent (mock)' });
    }

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    await PasswordResetToken.create({
      PassengerID: person.PersonID,
      Token: token,
      ExpiresAt: expiresAt
    });

    // In a real app, send email here
    res.json({ message: 'Password reset link sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (!PasswordResetToken) {
      return res.json({ message: 'Password successfully reset (mock)' });
    }

    const resetToken = await PasswordResetToken.findOne({ where: { Token: token } });
    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    if (resetToken.Used) {
      return res.status(400).json({ error: 'This token has already been used.' });
    }

    if (new Date() > new Date(resetToken.ExpiresAt)) {
      return res.status(400).json({ error: 'This token has expired.' });
    }

    const person = await Person.findByPk(resetToken.PassengerID);
    if (!person) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const hashedPassword = await hashPassword(newPassword);
    person.PasswordHash = hashedPassword;
    await person.save();

    resetToken.Used = true;
    await resetToken.save();

    res.json({ message: 'Password successfully reset' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT']),
  nationality: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
});

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    
    const existing = await Person.findOne({ where: { Email: data.email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(data.password);

    // Create Person (directly verified, no OTP needed)
    const person = await Person.create({
      FirstName: data.firstName,
      LastName: data.lastName,
      DateOfBirth: data.dob,
      Gender: data.gender,
      Nationality: data.nationality,
      Phone: data.phone,
      Email: data.email,
      PasswordHash: hashedPassword,
      IsEmailVerified: true
    });

    // Automatically create Passenger profile
    await Passenger.create({ PassengerID: person.PersonID });

    res.status(201).json({ message: 'Registration successful. You can now login.' });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const person = await Person.findOne({ where: { Email: email } });

    if (!person || !(await comparePassword(password, person.PasswordHash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(person);
    const jti = uuidv4();
    const refreshToken = generateRefreshToken(person, jti);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      PersonID: person.PersonID,
      TokenJTI: jti,
      ExpiresAt: expiresAt
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ access_token: accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ error: 'No refresh token provided' });

    let payload;
    try {
      payload = verifyToken(token);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const savedToken = await RefreshToken.findOne({ where: { TokenJTI: payload.jti } });
    if (!savedToken || savedToken.Revoked) {
      return res.status(401).json({ error: 'Token revoked or not found' });
    }

    const person = await Person.findByPk(payload.sub);
    if (!person) return res.status(401).json({ error: 'User not found' });

    const newAccessToken = generateAccessToken(person);
    res.json({ access_token: newAccessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (token) {
      try {
        const payload = verifyToken(token);
        await RefreshToken.update({ Revoked: true }, { where: { TokenJTI: payload.jti } });
      } catch(e) {}
    }
    
    res.clearCookie('refresh_token');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
