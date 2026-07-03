const { Op } = require('sequelize');
const { Airport, Aircraft, Flight, FlightPricing, Schedule, Booking, Ticket, Crew, Employee, Person } = require('../models');

class FlightService {
  /**
   * Search airports by IATA code or name
   */
  static async searchAirports(query) {
    const q = query.trim();
    const airports = await Airport.findAll({
      where: {
        Status: 'ACTIVE',
        [Op.or]: [
          { IATACode: { [Op.like]: `${q}%` } },
          { AirportName: { [Op.like]: `%${q}%` } },
          { City: { [Op.like]: `%${q}%` } },
          { Country: { [Op.like]: `%${q}%` } },
        ],
      },
      limit: 10,
      order: [
        [require('sequelize').literal(`CASE WHEN IATACode = '${q.toUpperCase()}' THEN 0 WHEN IATACode LIKE '${q}%' THEN 1 ELSE 2 END`), 'ASC'],
        ['City', 'ASC'],
      ],
    });
    return airports;
  }

  /**
   * Search flights with full JOIN: flight + schedule + airport + aircraft
   */
  static async searchFlights(params) {
    const {
      origin, destination, dep_date, cabin_class,
      adults = 1, children = 0, infants = 0,
      page = 1, limit = 10, sort_by = 'price', sort_order = 'asc',
      min_price, max_price
    } = params;

    const where = {
      Status: { [Op.in]: ['SCHEDULED', 'DELAYED'] },
    };

    // Filter by departure date (from this date onward)
    if (dep_date) {
      where.DepDate = { [Op.gte]: dep_date };
    } else {
      where.DepDate = { [Op.gte]: new Date().toISOString().split('T')[0] };
    }

    // Build airport filters
    const depAirportWhere = {};
    const arrAirportWhere = {};
    if (origin) depAirportWhere.IATACode = origin.toUpperCase();
    if (destination) arrAirportWhere.IATACode = destination.toUpperCase();

    // Determine sort order
    let order = [];
    switch (sort_by) {
      case 'duration':
        order = [['Duration_Hours', sort_order], ['Duration_Minutes', sort_order]];
        break;
      case 'departure':
        order = [['DepDate', sort_order]];
        break;
      default:
        order = [['FlightID', sort_order]]; // price sort done after fetch
    }

    const offset = (page - 1) * limit;

    const { count, rows: flights } = await Flight.findAndCountAll({
      where,
      include: [
        {
          model: Airport,
          as: 'depAirport',
          where: Object.keys(depAirportWhere).length > 0 ? depAirportWhere : undefined,
          attributes: ['AirportID', 'IATACode', 'AirportName', 'City', 'Country', 'Timezone', 'Terminal'],
        },
        {
          model: Airport,
          as: 'arrAirport',
          where: Object.keys(arrAirportWhere).length > 0 ? arrAirportWhere : undefined,
          attributes: ['AirportID', 'IATACode', 'AirportName', 'City', 'Country', 'Timezone', 'Terminal'],
        },
        {
          model: Aircraft,
          as: 'aircraft',
          attributes: ['AircraftID', 'Model', 'AircraftType', 'Capacity', 'RegNumber', 'SeatConfig'],
        },
        {
          model: Schedule,
          as: 'schedules',
          limit: 1,
        },
        {
          model: FlightPricing,
          as: 'pricing',
          required: false,
        },
      ],
      order,
      limit,
      offset,
      distinct: true,
    });

    // Calculate total passengers and available seats
    const totalPassengers = adults + children;

    // Format results
    const formattedFlights = flights.map((flight) => {
      // Try FlightPricing table first, then fall back to BaseFare JSON
      let fares = {};
      if (flight.pricing && flight.pricing.length > 0) {
        flight.pricing.forEach(p => {
          fares[p.CabinClass] = parseFloat(p.BasePrice);
        });
      }
      
      // Fallback to BaseFare JSON if no pricing rows
      if (!fares.ECONOMY && !fares.BUSINESS && !fares.FIRST) {
        let baseFare = flight.BaseFare || { ECONOMY: 250, BUSINESS: 850, FIRST: 2200 };
        while (typeof baseFare === 'string') {
          try { baseFare = JSON.parse(baseFare); } catch(e) { break; }
        }
        if (typeof baseFare !== 'object' || baseFare === null) {
          baseFare = { ECONOMY: Number(baseFare) || 250 };
        }
        fares = { ...baseFare, ...fares };
      }
      
      // Ensure all classes have a fare
      const baseEco = fares.ECONOMY || 250;
      if (!fares.BUSINESS) fares.BUSINESS = Math.round(baseEco * 3.4);
      if (!fares.FIRST) fares.FIRST = Math.round(baseEco * 8.8);
      
      const schedule = flight.schedules && flight.schedules[0];

      // Available seats from aircraft spec
      const seatConfig = flight.aircraft?.SeatConfig || {};
      const totalByClass = {
        ECONOMY: seatConfig.ECONOMY ? seatConfig.ECONOMY.rows * seatConfig.ECONOMY.seatsPerRow : Math.floor(flight.aircraft?.Capacity * 0.7) || 150,
        BUSINESS: seatConfig.BUSINESS ? seatConfig.BUSINESS.rows * seatConfig.BUSINESS.seatsPerRow : Math.floor(flight.aircraft?.Capacity * 0.2) || 40,
        FIRST: seatConfig.FIRST ? seatConfig.FIRST.rows * seatConfig.FIRST.seatsPerRow : Math.floor(flight.aircraft?.Capacity * 0.1) || 10,
      };

      return {
        flight_id: flight.FlightID,
        flight_no: flight.FlightNo,
        status: flight.Status,
        dep_date: flight.DepDate,
        duration: {
          hours: flight.Duration_Hours,
          minutes: flight.Duration_Minutes,
        },
        flight_type: flight.FlightType,
        dep_airport: flight.depAirport ? {
          airport_id: flight.depAirport.AirportID,
          iata_code: flight.depAirport.IATACode,
          airport_name: flight.depAirport.AirportName,
          city: flight.depAirport.City,
          country: flight.depAirport.Country,
          timezone: flight.depAirport.Timezone,
          terminal: flight.depAirport.Terminal,
        } : null,
        arr_airport: flight.arrAirport ? {
          airport_id: flight.arrAirport.AirportID,
          iata_code: flight.arrAirport.IATACode,
          airport_name: flight.arrAirport.AirportName,
          city: flight.arrAirport.City,
          country: flight.arrAirport.Country,
          timezone: flight.arrAirport.Timezone,
          terminal: flight.arrAirport.Terminal,
        } : null,
        schedule: schedule ? {
          dep_time: schedule.DepTime_Time,
          dep_timezone: schedule.DepTime_TimeZone,
          arr_time: schedule.ArrTime_Time,
          arr_timezone: schedule.ArrTime_TimeZone,
          frequency: schedule.Frequency,
        } : null,
        aircraft: flight.aircraft ? {
          aircraft_id: flight.aircraft.AircraftID,
          model: flight.aircraft.Model,
          type: flight.aircraft.AircraftType,
          reg_number: flight.aircraft.RegNumber,
        } : null,
        available_seats: totalByClass,
        fares,
        currency: 'USD',
      };
    });

    // Price filter (post-query since fares are in JSON)
    let filtered = formattedFlights;
    if (min_price !== undefined) {
      filtered = filtered.filter(f => f.fares[cabin_class || 'ECONOMY'] >= min_price);
    }
    if (max_price !== undefined) {
      filtered = filtered.filter(f => f.fares[cabin_class || 'ECONOMY'] <= max_price);
    }

    // Sort by price if requested
    if (sort_by === 'price') {
      const cls = cabin_class || 'ECONOMY';
      filtered.sort((a, b) => sort_order === 'asc'
        ? (a.fares[cls] || 0) - (b.fares[cls] || 0)
        : (b.fares[cls] || 0) - (a.fares[cls] || 0)
      );
    }

    // Compute price range for filter metadata
    const allPrices = formattedFlights.map(f => f.fares[cabin_class || 'ECONOMY'] || 0);

    return {
      total: count,
      page,
      per_page: limit,
      flights: filtered,
      filters_meta: {
        min_price: allPrices.length > 0 ? Math.min(...allPrices) : 0,
        max_price: allPrices.length > 0 ? Math.max(...allPrices) : 0,
        departure_windows: ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'],
      },
    };
  }

  /**
   * Get detailed flight info by ID
   */
  static async getFlightById(flightId) {
    const flight = await Flight.findByPk(flightId, {
      include: [
        { model: Airport, as: 'depAirport' },
        { model: Airport, as: 'arrAirport' },
        { model: Aircraft, as: 'aircraft' },
        { model: Schedule, as: 'schedules' },
        { model: FlightPricing, as: 'pricing', required: false },
        { 
          model: Crew, 
          as: 'assignedCrew',
          include: [
            {
              model: Employee,
              as: 'employee',
              include: [{ model: Person, as: 'person', attributes: ['FirstName', 'LastName'] }]
            }
          ]
        },
      ],
    });

    if (!flight) return null;

    const schedule = flight.schedules && flight.schedules[0];
    
    // Try FlightPricing table first
    let fares = {};
    if (flight.pricing && flight.pricing.length > 0) {
      flight.pricing.forEach(p => {
        fares[p.CabinClass] = parseFloat(p.BasePrice);
      });
    }
    
    // Fallback to BaseFare JSON
    if (!fares.ECONOMY && !fares.BUSINESS && !fares.FIRST) {
      let baseFare = flight.BaseFare || { ECONOMY: 250, BUSINESS: 850, FIRST: 2200 };
      while (typeof baseFare === 'string') {
        try { baseFare = JSON.parse(baseFare); } catch(e) { break; }
      }
      if (typeof baseFare !== 'object' || baseFare === null) {
        baseFare = { ECONOMY: Number(baseFare) || 250 };
      }
      fares = { ...baseFare, ...fares };
    }
    
    const baseEco = fares.ECONOMY || 250;
    if (!fares.BUSINESS) fares.BUSINESS = Math.round(baseEco * 3.4);
    if (!fares.FIRST) fares.FIRST = Math.round(baseEco * 8.8);

    return {
      flight_id: flight.FlightID,
      flight_no: flight.FlightNo,
      status: flight.Status,
      dep_date: flight.DepDate,
      duration: { hours: flight.Duration_Hours, minutes: flight.Duration_Minutes },
      flight_type: flight.FlightType,
      dep_airport: flight.depAirport,
      arr_airport: flight.arrAirport,
      aircraft: flight.aircraft,
      assigned_crew: flight.assignedCrew?.map(c => ({
        crew_id: c.CrewID,
        role: c.Role,
        base: c.BaseLocation,
        name: c.employee?.person ? `${c.employee.person.FirstName} ${c.employee.person.LastName}` : 'Unknown'
      })) || [],
      schedule: schedule ? {
        dep_time: schedule.DepTime_Time,
        dep_timezone: schedule.DepTime_TimeZone,
        arr_time: schedule.ArrTime_Time,
        arr_timezone: schedule.ArrTime_TimeZone,
        frequency: schedule.Frequency,
      } : null,
      fares,
      currency: 'USD',
    };
  }

  /**
   * Get seat availability for a flight
   */
  static async getFlightSeats(flightId) {
    const flight = await Flight.findByPk(flightId, {
      include: [{ model: Aircraft, as: 'aircraft' }],
    });

    if (!flight || !flight.aircraft) return null;

    const aircraft = flight.aircraft;
    const seatConfig = aircraft.SeatConfig || {
      FIRST: { rows: 2, seatsPerRow: 4, startRow: 1, labels: ['A', 'B', 'C', 'D'] },
      BUSINESS: { rows: 5, seatsPerRow: 6, startRow: 3, labels: ['A', 'B', 'C', 'D', 'E', 'F'] },
      ECONOMY: { rows: 25, seatsPerRow: 6, startRow: 8, labels: ['A', 'B', 'C', 'D', 'E', 'F'] },
    };

    // Get booked seats from bookings
    const bookings = await Booking.findAll({
      where: {
        FlightID: flightId,
        Status: { [Op.in]: ['PENDING', 'CONFIRMED'] },
      },
      attributes: ['Seats'],
    });

    const bookedSeats = new Set();
    bookings.forEach((b) => {
      let seats = b.Seats;
      if (typeof seats === 'string') {
        try { seats = JSON.parse(seats); } catch(e) { seats = []; }
      }
      if (seats && Array.isArray(seats)) {
        seats.forEach((s) => bookedSeats.add(s));
      }
    });

    // Also get occupied seats from ticket table (spec: SELECT SeatNo FROM ticket WHERE FlightID=?)
    try {
      const issuedTickets = await Ticket.findAll({
        where: { FlightID: flightId },
        attributes: ['SeatNo'],
      });
      issuedTickets.forEach(t => {
        if (t.SeatNo) bookedSeats.add(t.SeatNo);
      });
    } catch(e) { /* FlightID column may not exist yet */ }

    // Get locked seats
    const SeatLockService = require('./seat_lock_service');
    const lockedSeats = await SeatLockService.getLockedSeats(flightId);
    lockedSeats.forEach((s) => bookedSeats.add(s));

    // Build seat map
    const cabinMap = {};
    for (const [cabinClass, config] of Object.entries(seatConfig)) {
      const seats = [];
      const startRow = config.startRow || 1;
      for (let r = 0; r < config.rows; r++) {
        const rowNum = startRow + r;
        for (let s = 0; s < config.seatsPerRow; s++) {
          const label = config.labels ? config.labels[s] : String.fromCharCode(65 + s);
          const seatNo = `${rowNum}${label}`;
          const isOccupied = bookedSeats.has(seatNo);

          // Determine if premium (window/aisle seats, extra legroom rows)
          const isWindow = s === 0 || s === config.seatsPerRow - 1;
          const isExitRow = r === 0 || r === Math.floor(config.rows / 2);
          const isPremium = cabinClass === 'ECONOMY' && (isExitRow && isWindow);

          seats.push({
            seat_no: seatNo,
            row: rowNum,
            col: label,
            status: isOccupied ? 'occupied' : (isPremium ? 'premium' : 'available'),
            cabin_class: cabinClass,
            is_window: isWindow,
            is_aisle: s === Math.floor(config.seatsPerRow / 2) - 1 || s === Math.floor(config.seatsPerRow / 2),
          });
        }
      }
      cabinMap[cabinClass] = {
        seats,
        config: {
          rows: config.rows,
          seats_per_row: config.seatsPerRow,
          labels: config.labels,
          start_row: config.startRow,
        },
      };
    }

    return {
      flight_id: flightId,
      aircraft: {
        model: aircraft.Model,
        type: aircraft.AircraftType,
        capacity: aircraft.Capacity,
      },
      cabin_map: cabinMap,
      booked_count: bookedSeats.size,
    };
  }
}

module.exports = FlightService;
