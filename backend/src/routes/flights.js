const express = require('express');
const router = express.Router();
const FlightService = require('../services/flight_service');
const { FlightSearchQuery } = require('../schemas/flight');

// GET /api/v1/flights/search
router.get('/search', async (req, res) => {
  try {
    const parsed = FlightSearchQuery.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const results = await FlightService.searchFlights(parsed.data);
    res.json(results);
  } catch (err) {
    console.error('Flight search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/flights/:id
router.get('/:id', async (req, res) => {
  try {
    const flightId = parseInt(req.params.id);
    if (isNaN(flightId)) {
      return res.status(400).json({ error: 'Invalid flight ID' });
    }

    const flight = await FlightService.getFlightById(flightId);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    res.json({ flight });
  } catch (err) {
    console.error('Flight detail error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/flights/:id/seats
router.get('/:id/seats', async (req, res) => {
  try {
    const flightId = parseInt(req.params.id);
    if (isNaN(flightId)) {
      return res.status(400).json({ error: 'Invalid flight ID' });
    }

    const seatMap = await FlightService.getFlightSeats(flightId);
    if (!seatMap) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    res.json(seatMap);
  } catch (err) {
    console.error('Seat map error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
