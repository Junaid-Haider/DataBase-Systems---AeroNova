const { verifyToken } = require('../utils/auth');
const { Person, Passenger, Employee } = require('../models');

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authentication token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    const person = await Person.findByPk(payload.sub, {
      include: [
        { model: Passenger, as: 'passengerProfile' },
        { model: Employee, as: 'employeeProfile' }
      ]
    });

    if (!person) {
      return res.status(401).json({ error: 'User account not found' });
    }

    req.user = person;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token expired or invalid', details: err.message });
  }
};
