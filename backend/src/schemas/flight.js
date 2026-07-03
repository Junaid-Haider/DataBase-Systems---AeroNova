const { z } = require('zod');

const FlightSearchQuery = z.object({
  origin: z.string().length(3, 'Origin must be a 3-letter IATA code').toUpperCase().optional(),
  destination: z.string().length(3, 'Destination must be a 3-letter IATA code').toUpperCase().optional(),
  dep_date: z.string().optional(),
  cabin_class: z.enum(['ECONOMY', 'BUSINESS', 'FIRST']).optional().default('ECONOMY'),
  adults: z.coerce.number().int().min(1).max(9).optional().default(1),
  children: z.coerce.number().int().min(0).max(9).optional().default(0),
  infants: z.coerce.number().int().min(0).max(4).optional().default(0),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  sort_by: z.enum(['price', 'duration', 'departure']).optional().default('price'),
  sort_order: z.enum(['asc', 'desc']).optional().default('asc'),
  max_stops: z.coerce.number().int().min(0).max(3).optional(),
  min_price: z.coerce.number().min(0).optional(),
  max_price: z.coerce.number().min(0).optional(),
});

const AirportSearchQuery = z.object({
  q: z.string().min(1, 'Search query is required').max(100),
});

const BookingCreate = z.object({
  flight_id: z.number().int().positive(),
  cabin_class: z.enum(['ECONOMY', 'BUSINESS', 'FIRST']),
  passengers: z.array(z.object({
    first_name: z.string().min(1).max(80),
    last_name: z.string().min(1).max(80),
    passport_no: z.string().max(20).optional(),
    date_of_birth: z.string().optional(),
    nationality: z.string().max(80).optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT']).optional(),
    meal_plan_id: z.number().int().optional().nullable(),
  })).min(1).max(9),
  seats: z.array(z.string().max(5)).min(1).max(9),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().max(20).optional(),
});

module.exports = { FlightSearchQuery, AirportSearchQuery, BookingCreate };
