const { authenticate } = require('./auth');
const { AdminUser, Employee } = require('../models');

const requireAdmin = async (req, res, next) => {
  // First, authenticate as a regular user/employee
  authenticate(req, res, async () => {
    try {
      if (!req.user || !req.user.employeeId) {
        return res.status(403).json({ error: 'Access denied: Admin privileges required' });
      }

      // Check if they are an admin
      const admin = await AdminUser.findOne({ 
        where: { EmployeeID: req.user.employeeId },
        include: [{ model: Employee, as: 'employee' }]
      });

      if (!admin) {
        return res.status(403).json({ error: 'Access denied: Admin privileges required' });
      }

      req.admin = admin;
      next();
    } catch (err) {
      console.error('Admin middleware error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

module.exports = { requireAdmin };
