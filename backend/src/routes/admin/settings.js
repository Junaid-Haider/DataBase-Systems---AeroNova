const express = require('express');
const { requireAdmin } = require('../../middleware/admin');
const { AdminUser, Employee, Person } = require('../../models');

const router = express.Router();

// GET all system administrators
router.get('/admins', requireAdmin, async (req, res) => {
  try {
    const admins = await AdminUser.findAll({
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [
            {
              model: Person,
              as: 'person',
              attributes: ['FirstName', 'LastName', 'Email']
            }
          ]
        }
      ]
    });

    const formatted = admins.map(a => {
      const p = a.employee?.person;
      return {
        id: a.AdminID,
        name: p ? `${p.FirstName} ${p.LastName}` : 'Unknown',
        email: p?.Email || 'N/A',
        scope: a.AdminScope,
        lastLogin: a.LastLogin || 'Never',
        createdAt: a.createdAt
      };
    });

    res.json({ data: formatted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
