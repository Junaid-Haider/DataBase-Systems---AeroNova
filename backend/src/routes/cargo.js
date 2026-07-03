const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Cargo, CargoEvent, Flight, Aircraft, Airport } = require('../models');

const router = express.Router();

// POST /api/v1/cargo/book
router.post('/book', async (req, res) => {
  try {
    const { FlightID, CargoType, WeightKg, VolumeM3, TempReq_C, HazClass, SenderName, ReceiverName } = req.body;

    const flight = await Flight.findByPk(FlightID, {
      include: [{ model: Aircraft, as: 'aircraft' }]
    });

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    // Pricing logic
    let basePrice = WeightKg * 15;
    if (CargoType === 'HAZMAT') basePrice += 500;
    if (CargoType === 'PERISHABLE') basePrice += 200;

    const TrackingNo = `CRG-AX-${new Date().getFullYear()}-${uuidv4().split('-')[0].toUpperCase()}`;

    const cargo = await Cargo.create({
      TrackingNo,
      FlightID,
      CargoType,
      WeightKg,
      VolumeM3,
      TempReq_C,
      HazClass,
      Price: basePrice,
      SenderName,
      ReceiverName,
      Status: 'BOOKED'
    });

    // Create initial event
    await CargoEvent.create({
      CargoID: cargo.CargoID,
      Status: 'BOOKED',
      Location: 'Origin Cargo Terminal',
      Timestamp: new Date(),
      Note: 'Booking confirmed, awaiting check-in'
    });

    res.status(201).json({ message: 'Cargo shipment booked successfully', cargo });
  } catch (error) {
    console.error('Cargo booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/cargo/:tracking_no/track — includes event timeline
router.get('/:tracking_no/track', async (req, res) => {
  try {
    const cargo = await Cargo.findOne({
      where: { TrackingNo: req.params.tracking_no },
      include: [
        { 
          model: Flight, 
          as: 'flight',
          attributes: ['FlightNo', 'DepDate', 'Status'],
          include: [
            { model: Airport, as: 'depAirport', attributes: ['IATACode', 'City'] },
            { model: Airport, as: 'arrAirport', attributes: ['IATACode', 'City'] }
          ]
        },
        {
          model: CargoEvent,
          as: 'events'
        }
      ]
    });

    if (!cargo) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // Sort events by timestamp
    const events = cargo.events ?
      [...cargo.events].sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp)) : [];

    res.json({ cargo: { ...cargo.toJSON(), events } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
