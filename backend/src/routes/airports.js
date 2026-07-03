const express = require('express');
const router = express.Router();
const FlightService = require('../services/flight_service');
const { AirportSearchQuery } = require('../schemas/flight');

// GET /api/v1/airports/search?q=
router.get('/search', async (req, res) => {
  try {
    const parsed = AirportSearchQuery.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const airports = await FlightService.searchAirports(parsed.data.q);
    res.json({ airports });
  } catch (err) {
    console.error('Airport search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
