const express = require('express');
const { requireAdmin } = require('../../middleware/admin');
const { Flight, Schedule, Airport, Aircraft, Crew, FlightCrewAssignment } = require('../../models');

const router = express.Router();

// GET all flights (Admin view)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const flights = await Flight.findAll({
      include: [
        { model: Airport, as: 'depAirport' },
        { model: Airport, as: 'arrAirport' },
        { model: Aircraft, as: 'aircraft' },
        { model: Schedule, as: 'schedules', limit: 1 }
      ],
      order: [['DepDate', 'DESC']]
    });
    res.json({ flights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create flight
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { FlightNo, DepAirportID, ArrAirportID, AircraftID, DepDate, FlightType, Status, Duration_Hours, Duration_Minutes, schedule } = req.body;

    const flight = await Flight.create({
      FlightNo, DepAirportID, ArrAirportID, AircraftID, DepDate, FlightType,
      Status: Status || 'SCHEDULED',
      Duration_Hours: Duration_Hours || 0,
      Duration_Minutes: Duration_Minutes || 0
    });

    if (schedule) {
      await Schedule.create({
        FlightID: flight.FlightID,
        DepTime_Time: schedule.DepTime,
        DepTime_TimeZone: schedule.DepTimezone || 'UTC',
        ArrTime_Time: schedule.ArrTime,
        ArrTime_TimeZone: schedule.ArrTimezone || 'UTC',
        Frequency: schedule.Frequency || 'DAILY',
        EffDate: DepDate,
        DayOfWeek: new Date(DepDate).getDay() || 7,
        SchedType: 'SCHEDULED'
      });
    }

    res.status(201).json({ message: 'Flight created', flight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update flight
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });

    const { FlightNo, DepAirportID, ArrAirportID, AircraftID, DepDate, FlightType, Status, Duration_Hours, Duration_Minutes } = req.body;

    await flight.update({
      ...(FlightNo && { FlightNo }),
      ...(DepAirportID && { DepAirportID }),
      ...(ArrAirportID && { ArrAirportID }),
      ...(AircraftID && { AircraftID }),
      ...(DepDate && { DepDate }),
      ...(FlightType && { FlightType }),
      ...(Status && { Status }),
      ...(Duration_Hours !== undefined && { Duration_Hours }),
      ...(Duration_Minutes !== undefined && { Duration_Minutes })
    });

    res.json({ message: 'Flight updated', flight });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE flight
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });

    await flight.destroy();
    res.json({ message: 'Flight deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST assign crew to flight
router.post('/:id/crew', requireAdmin, async (req, res) => {
  try {
    const { CrewID, Role } = req.body;
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });

    const crew = await Crew.findByPk(CrewID);
    if (!crew) return res.status(404).json({ error: 'Crew member not found' });

    await FlightCrewAssignment.create({
      FlightID: flight.FlightID,
      CrewID: CrewID,
      Role: Role || crew.Role
    });

    res.status(201).json({ message: 'Crew assigned to flight' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE remove crew from flight
router.delete('/:id/crew/:crewId', requireAdmin, async (req, res) => {
  try {
    const deleted = await FlightCrewAssignment.destroy({
      where: { FlightID: req.params.id, CrewID: req.params.crewId }
    });
    if (!deleted) return res.status(404).json({ error: 'Assignment not found' });

    res.json({ message: 'Crew removed from flight' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
