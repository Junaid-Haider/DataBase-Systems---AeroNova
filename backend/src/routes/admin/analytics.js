const express = require('express');
const { requireAdmin } = require('../../middleware/admin');
const { sequelize, Payment, Booking, Flight, Aircraft } = require('../../models');

const { Op } = require('sequelize');

const router = express.Router();

// GET Dashboard Overview
router.get('/overview', requireAdmin, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Total Revenue (sum of all completed payments)
    const revenueResult = await Payment.sum('Amount', { where: { Status: 'COMPLETED' } });
    const totalRevenue = revenueResult || 0;

    // 2. Active Flights (flights scheduled or delayed today)
    const activeFlights = await Flight.count({
      where: {
        Status: { [Op.in]: ['SCHEDULED', 'DELAYED', 'BOARDING', 'IN_AIR'] }
      }
    });

    // 3. Passengers Today (bookings made today)
    const passengersToday = await Booking.count({
      where: {
        BookingDate: { [Op.gte]: today }
      }
    });

    // 4. System Alerts (pending maintenance issues + failed notifications)
    const { Maintenance, NotificationLog } = require('../../models');
    const systemAlerts = await Maintenance.count({
      where: { Status: { [Op.in]: ['SCHEDULED', 'IN_PROGRESS', 'DELAYED'] } }
    });

    // 4.5 Failed Notifications
    let failedNotifications = [];
    if (NotificationLog) {
      const failed = await NotificationLog.findAll({
        where: { Status: 'FAILED' },
        limit: 5,
        order: [['SentAt', 'DESC']]
      });
      failedNotifications = failed.map(n => ({
        id: n.LogID,
        type: n.Type,
        error: n.Error,
        time: new Date(n.SentAt).toLocaleTimeString()
      }));
    }

    // 5. Recent Bookings (last 5)
    const recentBookingsData = await Booking.findAll({
      limit: 5,
      order: [['BookingDate', 'DESC']],
      include: [
        { 
          model: require('../../models').Passenger, 
          as: 'passenger',
          include: [{ model: require('../../models').Person, as: 'personDetails', attributes: ['FirstName', 'LastName'] }]
        },
        { model: Payment, as: 'payments', attributes: ['Amount'], limit: 1 }
      ]
    });

    const recentBookings = recentBookingsData.map(b => {
      const p = b.passenger?.personDetails;
      const name = p ? `${p.FirstName} ${p.LastName}` : 'Guest';
      const amount = b.payments?.[0]?.Amount || 0;
      
      // Calculate time ago
      const diffMs = new Date() - new Date(b.BookingDate);
      const diffMins = Math.round(diffMs / 60000);
      let timeStr = `${diffMins} min ago`;
      if (diffMins > 60) timeStr = `${Math.round(diffMins / 60)} hrs ago`;
      if (diffMins > 1440) timeStr = `${Math.round(diffMins / 1440)} days ago`;

      return {
        pnr: b.PNR,
        name,
        amount,
        time: timeStr
      };
    });

    res.json({
      totalRevenue,
      activeFlights,
      passengersToday,
      systemAlerts: systemAlerts + failedNotifications.length,
      recentBookings,
      failedNotifications
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Revenue (Monthly aggregation)
router.get('/revenue', requireAdmin, async (req, res) => {
  try {
    // In SQLite/MySQL, formatting dates varies. For simplicity, we fetch completed payments.
    const payments = await Payment.findAll({
      where: { Status: 'COMPLETED' },
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('PayDate'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('Amount')), 'totalRevenue']
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('PayDate'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('PayDate'), '%Y-%m'), 'ASC']]
    });

    res.json({ data: payments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Load Factor
router.get('/load-factor', requireAdmin, async (req, res) => {
  try {
    const data = await Flight.findAll({
      include: [
        { model: Aircraft, as: 'aircraft', attributes: ['Capacity'] },
        { model: Booking, as: 'bookings', attributes: ['BookingID'] }
      ],
      limit: 10,
      order: [['DepDate', 'DESC']]
    });

    const loadFactors = data.map(f => {
      const booked = f.bookings ? f.bookings.length : 0;
      const capacity = f.aircraft ? f.aircraft.Capacity : 100;
      return {
        flightNo: f.FlightNo,
        date: f.DepDate,
        loadFactor: Math.round((booked / capacity) * 100),
        booked,
        capacity
      };
    });

    res.json({ data: loadFactors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
