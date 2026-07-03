const express = require('express');
const { requireAdmin } = require('../../middleware/admin');
const { Aircraft, Maintenance } = require('../../models');

const router = express.Router();

// GET all aircraft in fleet
router.get('/aircraft', requireAdmin, async (req, res) => {
  try {
    const fleet = await Aircraft.findAll({
      order: [['AircraftID', 'ASC']],
      include: [{ model: Maintenance, as: 'maintenanceRecords', limit: 1, order: [['StartDate', 'DESC']] }]
    });
    res.json({ data: fleet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add new aircraft
router.post('/aircraft', requireAdmin, async (req, res) => {
  try {
    const { RegNumber, Model, Capacity, Status, MfgYear, AircraftType, NumAisles, MaxSeats, CargoVol_m3, MaxPayload_kg } = req.body;

    const aircraft = await Aircraft.create({
      RegNumber, Model, Capacity, MfgYear,
      Status: Status || 'ACTIVE',
      AircraftType: AircraftType || 'NARROW-BODY',
      NumAisles, MaxSeats, CargoVol_m3, MaxPayload_kg
    });

    res.status(201).json({ message: 'Aircraft added', aircraft });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update aircraft
router.put('/aircraft/:id', requireAdmin, async (req, res) => {
  try {
    const aircraft = await Aircraft.findByPk(req.params.id);
    if (!aircraft) return res.status(404).json({ error: 'Aircraft not found' });

    const { Status, Model, Capacity, MfgYear } = req.body;
    if (Status) aircraft.Status = Status;
    if (Model) aircraft.Model = Model;
    if (Capacity) aircraft.Capacity = Capacity;
    if (MfgYear) aircraft.MfgYear = MfgYear;
    await aircraft.save();

    res.json({ message: 'Aircraft updated', aircraft });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET maintenance logs
router.get('/maintenance', requireAdmin, async (req, res) => {
  try {
    const logs = await Maintenance.findAll({
      include: [
        {
          model: Aircraft,
          as: 'aircraft',
          attributes: ['RegNumber', 'Model']
        }
      ],
      order: [['StartDate', 'DESC']],
      limit: 50
    });
    res.json({ data: logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST schedule maintenance
router.post('/aircraft/:id/maintenance', requireAdmin, async (req, res) => {
  try {
    const aircraft = await Aircraft.findByPk(req.params.id);
    if (!aircraft) return res.status(404).json({ error: 'Aircraft not found' });

    const { Type, StartDate, EndDate } = req.body;

    const maintenance = await Maintenance.create({
      AircraftID: aircraft.AircraftID,
      Type: Type || 'A-Check',
      StartDate: StartDate || new Date(),
      EndDate: EndDate || null,
      Status: 'SCHEDULED'
    });

    // Optionally set aircraft status to MAINTENANCE
    aircraft.Status = 'MAINTENANCE';
    await aircraft.save();

    res.status(201).json({ message: 'Maintenance scheduled', maintenance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
