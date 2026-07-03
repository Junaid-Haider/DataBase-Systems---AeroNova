const { Op } = require('sequelize');
const { Booking, Flight, Aircraft } = require('../models');
const { generatePNR } = require('../utils/pnr_generator');
const SeatLockService = require('./seat_lock_service');
const { v4: uuidv4 } = require('uuid');

class BookingService {
  /**
   * Create a new booking with seat locking
   */
  static async createBooking(data, passengerId) {
    const { flight_id, cabin_class, passengers, seats, contact_email, contact_phone } = data;

    // 1. Verify flight exists and is bookable
    const flight = await Flight.findByPk(flight_id, {
      include: [{ model: Aircraft, as: 'aircraft' }],
    });

    if (!flight) {
      throw new Error('Flight not found');
    }

    if (!['SCHEDULED', 'DELAYED'].includes(flight.Status)) {
      throw new Error('Flight is not available for booking');
    }

    // 2. Validate seat count matches passenger count
    if (seats.length !== passengers.length) {
      throw new Error('Number of seats must match number of passengers');
    }

    // 3. Check and lock seats
    const sessionId = uuidv4();
    const lockedSeats = [];

    for (const seatNo of seats) {
      const locked = await SeatLockService.lockSeat(flight_id, seatNo, sessionId);
      if (!locked) {
        // Release any seats we already locked
        for (const locked_seat of lockedSeats) {
          await SeatLockService.releaseSeat(flight_id, locked_seat);
        }
        throw new Error(`Seat ${seatNo} is already reserved or booked`);
      }
      lockedSeats.push(seatNo);
    }

    // 4. Calculate fare
    let fares = flight.BaseFare || { ECONOMY: 250, BUSINESS: 850, FIRST: 2200 };
    while (typeof fares === 'string') {
      try { fares = JSON.parse(fares); } catch(e) { break; }
    }
    if (typeof fares !== 'object' || fares === null) {
      fares = { ECONOMY: Number(fares) || 250 };
    }
    
    const baseEco = fares.ECONOMY || 250;
    if (!fares.BUSINESS) fares.BUSINESS = Math.round(baseEco * 3.4);
    if (!fares.FIRST) fares.FIRST = Math.round(baseEco * 8.8);
    
    const farePerPerson = fares[cabin_class] || fares.ECONOMY || 250;
    const totalAmount = farePerPerson * passengers.length;

    // 5. Generate unique PNR
    let pnr;
    let attempts = 0;
    do {
      pnr = generatePNR();
      const existing = await Booking.findOne({ where: { PNR: pnr } });
      if (!existing) break;
      attempts++;
    } while (attempts < 10);

    if (attempts >= 10) {
      throw new Error('Failed to generate unique PNR');
    }

    // 6. Create booking record
    const booking = await Booking.create({
      PNR: pnr,
      FlightID: flight_id,
      PassengerID: passengerId,
      CabinClass: cabin_class,
      Status: 'PENDING',
      TotalAmount: totalAmount,
      Channel: 'WEB',
      Passengers: passengers,
      Seats: seats,
      ContactEmail: contact_email,
      ContactPhone: contact_phone,
    });

    // 7. Return booking details
    return {
      booking_id: booking.BookingID,
      pnr: booking.PNR,
      status: booking.Status,
      flight: {
        flight_no: flight.FlightNo,
        dep_date: flight.DepDate,
      },
      passengers: passengers.map((p, i) => ({
        name: `${p.first_name} ${p.last_name}`,
        seat: seats[i],
      })),
      cabin_class,
      total_amount: parseFloat(totalAmount),
      currency: 'USD',
      seat_lock_expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      next_step: '/payment',
    };
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(bookingId) {
    const booking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: Flight,
          as: 'flight',
          include: [
            { model: require('../models/airport'), as: 'depAirport' },
            { model: require('../models/airport'), as: 'arrAirport' },
            { model: require('../models/aircraft'), as: 'aircraft' },
            { model: require('../models/schedule'), as: 'schedules', limit: 1 },
          ],
        },
      ],
    });

    if (!booking) return null;

    const schedule = booking.flight?.schedules?.[0];

    return {
      booking_id: booking.BookingID,
      pnr: booking.PNR,
      status: booking.Status,
      booking_date: booking.BookingDate,
      total_amount: parseFloat(booking.TotalAmount),
      cabin_class: booking.CabinClass,
      channel: booking.Channel,
      contact_email: booking.ContactEmail,
      contact_phone: booking.ContactPhone,
      flight: booking.flight ? {
        flight_id: booking.flight.FlightID,
        flight_no: booking.flight.FlightNo,
        dep_date: booking.flight.DepDate,
        status: booking.flight.Status,
        duration: {
          hours: booking.flight.Duration_Hours,
          minutes: booking.flight.Duration_Minutes,
        },
        dep_airport: booking.flight.depAirport ? {
          iata_code: booking.flight.depAirport.IATACode,
          city: booking.flight.depAirport.City,
          airport_name: booking.flight.depAirport.AirportName,
          terminal: booking.flight.depAirport.Terminal,
        } : null,
        arr_airport: booking.flight.arrAirport ? {
          iata_code: booking.flight.arrAirport.IATACode,
          city: booking.flight.arrAirport.City,
          airport_name: booking.flight.arrAirport.AirportName,
          terminal: booking.flight.arrAirport.Terminal,
        } : null,
        aircraft: booking.flight.aircraft ? {
          model: booking.flight.aircraft.Model,
          type: booking.flight.aircraft.AircraftType,
        } : null,
        schedule: schedule ? {
          dep_time: schedule.DepTime_Time,
          arr_time: schedule.ArrTime_Time,
        } : null,
      } : null,
      passengers: booking.Passengers || [],
      seats: booking.Seats || [],
    };
  }
}

module.exports = BookingService;
