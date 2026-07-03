const express = require('express');
const { Ticket, Booking, Flight, Airport, Schedule, Baggage, Passenger, Person } = require('../models');

const router = express.Router();

// Get Ticket by PNR
router.get('/:pnr', async (req, res) => {
  try {
    const { pnr } = req.params;

    const booking = await Booking.findOne({ 
      where: { PNR: pnr },
      include: [
        {
          model: Ticket,
          as: 'tickets',
          include: [{ model: Baggage, as: 'baggages' }]
        },
        {
          model: Flight,
          as: 'flight',
          include: [
            { model: Airport, as: 'depAirport' },
            { model: Airport, as: 'arrAirport' },
            { model: Schedule, as: 'schedules', limit: 1 }
          ]
        },
        {
          model: Passenger,
          as: 'passenger',
          include: [{ model: Person, as: 'person' }]
        }
      ]
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.Status !== 'CONFIRMED') return res.status(400).json({ error: 'Booking is not confirmed' });
    if (!booking.tickets || booking.tickets.length === 0) return res.status(404).json({ error: 'No tickets issued for this booking yet' });

    res.json({
      booking: {
        pnr: booking.PNR,
        flight: booking.flight,
        passengerName: booking.passenger ? `${booking.passenger.person.FirstName} ${booking.passenger.person.LastName}` : (booking.Passengers ? JSON.parse(booking.Passengers)[0].name : 'Guest'),
      },
      ticket: booking.tickets[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ticket PDF (boarding pass)
router.get('/:pnr/pdf', async (req, res) => {
  try {
    const { pnr } = req.params;

    const booking = await Booking.findOne({
      where: { PNR: pnr },
      include: [
        { model: Ticket, as: 'tickets' },
        {
          model: Flight, as: 'flight',
          include: [
            { model: Airport, as: 'depAirport' },
            { model: Airport, as: 'arrAirport' },
            { model: Schedule, as: 'schedules', limit: 1 }
          ]
        },
        {
          model: Passenger, as: 'passenger',
          include: [{ model: Person, as: 'person' }]
        }
      ]
    });

    if (!booking || !booking.tickets?.length) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = booking.tickets[0];
    const flight = booking.flight;
    const passenger = booking.passenger;
    const schedule = flight?.schedules?.[0];

    // Generate a simple HTML boarding pass and return as downloadable HTML
    const passengerName = passenger
      ? `${passenger.person.FirstName} ${passenger.person.LastName}`
      : 'Guest Passenger';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Boarding Pass - ${pnr}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; padding: 40px; display: flex; justify-content: center; }
        .pass { width: 800px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
        .header { background: linear-gradient(135deg, #0ea5e9, #6366f1); padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; }
        .header h1 { color: white; font-size: 24px; }
        .header .pnr { background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 8px; color: white; font-weight: bold; font-size: 18px; letter-spacing: 2px; }
        .body { padding: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .field { margin-bottom: 16px; }
        .field label { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px; }
        .field .value { color: white; font-size: 20px; font-weight: 600; }
        .field .value.small { font-size: 16px; }
        .route { display: flex; align-items: center; gap: 16px; grid-column: 1/-1; padding: 24px 0; border-bottom: 1px dashed rgba(255,255,255,0.1); }
        .airport-code { font-size: 48px; font-weight: 800; color: #0ea5e9; }
        .arrow { color: #64748b; font-size: 24px; flex: 1; text-align: center; }
        .footer { padding: 24px 32px; border-top: 1px dashed rgba(255,255,255,0.1); display: flex; justify-content: space-between; color: #64748b; font-size: 12px; }
        @media print { body { background: white; } .pass { border: 2px solid #000; } }
      </style>
    </head>
    <body>
      <div class="pass">
        <div class="header">
          <h1>✈ AeroNova Airlines</h1>
          <div class="pnr">${pnr}</div>
        </div>
        <div class="body">
          <div class="route">
            <div class="airport-code">${flight?.depAirport?.IATACode || '---'}</div>
            <div class="arrow">✈ ─────────── ✈</div>
            <div class="airport-code">${flight?.arrAirport?.IATACode || '---'}</div>
          </div>
          <div class="field">
            <label>Passenger Name</label>
            <div class="value">${passengerName}</div>
          </div>
          <div class="field">
            <label>Flight</label>
            <div class="value">${flight?.FlightNo || 'N/A'}</div>
          </div>
          <div class="field">
            <label>Date</label>
            <div class="value small">${flight?.DepDate ? new Date(flight.DepDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</div>
          </div>
          <div class="field">
            <label>Departure Time</label>
            <div class="value small">${schedule?.DepTime_Time || 'N/A'}</div>
          </div>
          <div class="field">
            <label>Seat</label>
            <div class="value">${ticket.SeatNo || 'N/A'}</div>
          </div>
          <div class="field">
            <label>Cabin Class</label>
            <div class="value small">${ticket.CabinClass || 'ECONOMY'}</div>
          </div>
          <div class="field">
            <label>Ticket No</label>
            <div class="value small">${ticket.TicketNo}</div>
          </div>
          <div class="field">
            <label>Baggage Allowance</label>
            <div class="value small">${ticket.BaggageAllw || 23} kg</div>
          </div>
        </div>
        <div class="footer">
          <span>Boarding pass generated at ${new Date().toISOString()}</span>
          <span>AeroNova Airlines Management System</span>
        </div>
      </div>
    </body>
    </html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="boarding-pass-${pnr}.html"`);
    res.send(html);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
