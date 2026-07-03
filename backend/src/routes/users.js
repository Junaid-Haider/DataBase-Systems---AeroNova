const express = require('express');
const { Person, Passenger, Booking, Flight, Aircraft, Airport, Schedule, MealPlan, Payment } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate); // Protect all routes below

// Get available meal plans
router.get('/meal-plans', async (req, res) => {
  try {
    const mealPlans = await MealPlan.findAll();
    res.json({ mealPlans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    // req.user is attached by auth middleware
    res.json({
      personId: req.user.PersonID,
      firstName: req.user.FirstName,
      lastName: req.user.LastName,
      email: req.user.Email,
      passengerProfile: req.user.passengerProfile,
      employeeProfile: req.user.employeeProfile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update current user profile
router.put('/me', async (req, res) => {
  try {
    const { phone, nationality, passportNo, mealPlanId } = req.body;

    // Update Person details
    if (phone || nationality) {
      await Person.update(
        { Phone: phone || req.user.Phone, Nationality: nationality || req.user.Nationality },
        { where: { PersonID: req.user.PersonID } }
      );
    }

    // Update Passenger details if they exist
    if (req.user.passengerProfile && (passportNo || mealPlanId)) {
      await Passenger.update(
        { 
          PassportNo: passportNo || req.user.passengerProfile.PassportNo,
          MealPlanID: mealPlanId || req.user.passengerProfile.MealPlanID
        },
        { where: { PassengerID: req.user.PersonID } }
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user's booking history
router.get('/me/bookings', async (req, res) => {
  try {
    if (!req.user.passengerProfile) {
      return res.json({ bookings: [] });
    }

    const bookings = await Booking.findAll({
      where: { PassengerID: req.user.PersonID },
      order: [['BookingDate', 'DESC']],
      include: [
        {
          model: Flight,
          as: 'flight',
          include: [
            { model: Airport, as: 'depAirport', attributes: ['IATACode', 'City'] },
            { model: Airport, as: 'arrAirport', attributes: ['IATACode', 'City'] },
            { model: Schedule, as: 'schedules', limit: 1 },
            { model: Aircraft, as: 'aircraft', attributes: ['Model'] }
          ]
        },
        { model: Payment, as: 'payments' }
      ]
    });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
