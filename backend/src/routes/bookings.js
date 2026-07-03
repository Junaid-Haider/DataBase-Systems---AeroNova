const express = require('express');
const router = express.Router();
const BookingService = require('../services/booking_service');
const { BookingCreate } = require('../schemas/flight');
const { authenticate } = require('../middleware/auth');

// POST /api/v1/bookings
router.post('/', authenticate, async (req, res) => {
  try {
    const parsed = BookingCreate.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    // Pass the authenticated user's PersonID so the booking is linked to them
    const booking = await BookingService.createBooking(parsed.data, req.user.PersonID);
    res.json(booking);
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// GET /api/v1/bookings/:id
router.get('/:id', async (req, res) => {
  try {
    const booking = await BookingService.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ booking });
  } catch (err) {
    console.error('Get booking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
