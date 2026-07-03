const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate RS256 key pair if not provided in env
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || privateKey;
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY || publicKey;

exports.generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user.PersonID, email: user.Email },
    JWT_PRIVATE_KEY,
    { algorithm: 'RS256', expiresIn: '15m' }
  );
};

exports.generateRefreshToken = (user, jti) => {
  return jwt.sign(
    { sub: user.PersonID, jti },
    JWT_PRIVATE_KEY,
    { algorithm: 'RS256', expiresIn: '7d' }
  );
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_PUBLIC_KEY, { algorithms: ['RS256'] });
};

