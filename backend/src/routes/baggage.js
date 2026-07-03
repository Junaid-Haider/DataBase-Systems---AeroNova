const express = require('express');
const { Baggage, BaggageEvent, LostBaggage, Ticket, Booking, Flight, Airport } = require('../models');

const router = express.Router();

// Track Baggage by Tag Number — includes event timeline
router.get('/:tag/track', async (req, res) => {
  try {
    const baggage = await Baggage.findOne({ 
      where: { TagNumber: req.params.tag },
      include: [
        {
          model: BaggageEvent,
          as: 'events',
          order: [['Timestamp', 'ASC']]
        },
        {
          model: LostBaggage,
          as: 'lostReport',
          required: false
        },
        {
          model: Ticket,
          as: 'ticket',
          include: [
            {
              model: Booking,
              as: 'booking',
              include: [
                {
                  model: Flight,
                  as: 'flight',
                  include: [
                    { model: Airport, as: 'depAirport' },
                    { model: Airport, as: 'arrAirport' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!baggage) return res.status(404).json({ error: 'Baggage tag not found' });

    // Sort events by timestamp
    const events = baggage.events ? 
      [...baggage.events].sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp)) : [];

    res.json({ 
      baggage: {
        ...baggage.toJSON(),
        events
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// File Lost Baggage Report
router.post('/lost-report', async (req, res) => {
  try {
    const { tagNumber } = req.body;
    
    const baggage = await Baggage.findOne({ where: { TagNumber: tagNumber } });
    if (!baggage) return res.status(404).json({ error: 'Baggage tag not found' });

    // Update baggage status
    baggage.Status = 'LOST';
    await baggage.save();

    // Create lost baggage report
    const report = await LostBaggage.create({
      BaggageID: baggage.BaggageID,
      ReportDate: new Date(),
    });

    // Log the event
    await BaggageEvent.create({
      BaggageID: baggage.BaggageID,
      Status: 'LOST',
      Location: 'Reported by passenger',
      Timestamp: new Date(),
      Note: 'Lost baggage report filed'
    });

    res.json({ message: 'Lost baggage report filed successfully', report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
