const sequelize = require('../config/database');
const Airport = require('./airport');
const Aircraft = require('./aircraft');
const Flight = require('./flight');
const FlightPricing = require('./flight_pricing');
const Schedule = require('./schedule');
const Booking = require('./booking');

const Person = require('./person');
const Passenger = require('./passenger');
const Employee = require('./employee');
const Guest = require('./guest');
const MealPlan = require('./meal_plan');
const FrequentFlyer = require('./frequent_flyer');
const LoyaltyAccount = require('./loyalty_account');
const MilesTransaction = require('./miles_transaction');
const RefreshToken = require('./refresh_token');
const EmailVerificationToken = require('./email_verification_token');
const PasswordResetToken = require('./password_reset_token');

const Payment = require('./payment');
const Refund = require('./refund');
const Ticket = require('./ticket');
const Baggage = require('./baggage');
const BaggageEvent = require('./baggage_event');
const LostBaggage = require('./lost_baggage');

const Crew = require('./crew');
const Pilot = require('./pilot');
const CabinCrew = require('./cabin_crew');
const GroundStaff = require('./ground_staff');
const Maintenance = require('./maintenance');
const AdminUser = require('./admin_users');
const FlightCrewAssignment = require('./flight_crew');
const Cargo = require('./cargo');
const CargoEvent = require('./cargo_event');
const NotificationLog = require('./notification_log');

// ── Associations ──

// Flight belongs to Aircraft
Flight.belongsTo(Aircraft, { foreignKey: 'AircraftID', as: 'aircraft' });
Aircraft.hasMany(Flight, { foreignKey: 'AircraftID', as: 'flights' });

// Flight belongs to departure Airport
Flight.belongsTo(Airport, { foreignKey: 'DepAirportID', as: 'depAirport' });
Airport.hasMany(Flight, { foreignKey: 'DepAirportID', as: 'departingFlights' });

// Flight belongs to arrival Airport
Flight.belongsTo(Airport, { foreignKey: 'ArrAirportID', as: 'arrAirport' });
Airport.hasMany(Flight, { foreignKey: 'ArrAirportID', as: 'arrivingFlights' });

// Flight has many pricing rows
Flight.hasMany(FlightPricing, { foreignKey: 'FlightID', as: 'pricing' });
FlightPricing.belongsTo(Flight, { foreignKey: 'FlightID', as: 'flight' });

// Schedule belongs to Flight
Schedule.belongsTo(Flight, { foreignKey: 'FlightID', as: 'flight' });
Flight.hasMany(Schedule, { foreignKey: 'FlightID', as: 'schedules' });

// Booking belongs to Flight
Booking.belongsTo(Flight, { foreignKey: 'FlightID', as: 'flight' });
Flight.hasMany(Booking, { foreignKey: 'FlightID', as: 'bookings' });

// Phase 2 Associations
Person.hasOne(Passenger, { foreignKey: 'PassengerID', as: 'passengerProfile' });
Passenger.belongsTo(Person, { foreignKey: 'PassengerID', as: 'person' });

Person.hasOne(Employee, { foreignKey: 'EmployeeID', as: 'employeeProfile' });
Employee.belongsTo(Person, { foreignKey: 'EmployeeID', as: 'person' });

Person.hasMany(RefreshToken, { foreignKey: 'PersonID', as: 'refreshTokens' });
RefreshToken.belongsTo(Person, { foreignKey: 'PersonID', as: 'person' });

Passenger.hasMany(EmailVerificationToken, { foreignKey: 'PassengerID', as: 'emailTokens' });
EmailVerificationToken.belongsTo(Passenger, { foreignKey: 'PassengerID', as: 'passenger' });

Passenger.hasMany(PasswordResetToken, { foreignKey: 'PassengerID', as: 'resetTokens' });
PasswordResetToken.belongsTo(Passenger, { foreignKey: 'PassengerID', as: 'passenger' });

Passenger.belongsTo(MealPlan, { foreignKey: 'MealPlanID', as: 'mealPlan' });
MealPlan.hasMany(Passenger, { foreignKey: 'MealPlanID', as: 'passengers' });

Passenger.hasOne(FrequentFlyer, { foreignKey: 'PassengerID', as: 'frequentFlyer' });
FrequentFlyer.belongsTo(Passenger, { foreignKey: 'PassengerID', as: 'passenger' });

FrequentFlyer.hasOne(LoyaltyAccount, { foreignKey: 'FFID', as: 'loyaltyAccount' });
LoyaltyAccount.belongsTo(FrequentFlyer, { foreignKey: 'FFID', as: 'frequentFlyer' });

// Miles transactions
FrequentFlyer.hasMany(MilesTransaction, { foreignKey: 'FFID', as: 'milesTransactions' });
MilesTransaction.belongsTo(FrequentFlyer, { foreignKey: 'FFID', as: 'frequentFlyer' });

Passenger.hasMany(Booking, { foreignKey: 'PassengerID', as: 'bookings' });
Booking.belongsTo(Passenger, { foreignKey: 'PassengerID', as: 'passenger' });

Guest.belongsTo(Booking, { foreignKey: 'BookingID', as: 'booking' });
Booking.hasOne(Guest, { foreignKey: 'BookingID', as: 'guest' });

// Phase 3 Associations
Booking.hasMany(Payment, { foreignKey: 'BookingID', as: 'payments' });
Payment.belongsTo(Booking, { foreignKey: 'BookingID', as: 'booking' });

Payment.hasMany(Refund, { foreignKey: 'PaymentID', as: 'refunds' });
Refund.belongsTo(Payment, { foreignKey: 'PaymentID', as: 'payment' });

Booking.hasMany(Ticket, { foreignKey: 'BookingID', as: 'tickets' });
Ticket.belongsTo(Booking, { foreignKey: 'BookingID', as: 'booking' });

Passenger.hasMany(Ticket, { foreignKey: 'PassengerID', as: 'tickets' });
Ticket.belongsTo(Passenger, { foreignKey: 'PassengerID', as: 'passenger' });

Ticket.hasMany(Baggage, { foreignKey: 'TicketNo', sourceKey: 'TicketNo', as: 'baggages' });
Baggage.belongsTo(Ticket, { foreignKey: 'TicketNo', targetKey: 'TicketNo', as: 'ticket' });

// Baggage events timeline
Baggage.hasMany(BaggageEvent, { foreignKey: 'BaggageID', as: 'events' });
BaggageEvent.belongsTo(Baggage, { foreignKey: 'BaggageID', as: 'baggage' });

Baggage.hasOne(LostBaggage, { foreignKey: 'BaggageID', as: 'lostReport' });
LostBaggage.belongsTo(Baggage, { foreignKey: 'BaggageID', as: 'baggage' });

// Phase 4 Associations
Employee.hasOne(Crew, { foreignKey: 'CrewID', as: 'crewDetails' });
Crew.belongsTo(Employee, { foreignKey: 'CrewID', as: 'employee' });

Crew.hasOne(Pilot, { foreignKey: 'CrewID', as: 'pilotDetails' });
Pilot.belongsTo(Crew, { foreignKey: 'CrewID', as: 'crew' });

Crew.hasOne(CabinCrew, { foreignKey: 'CrewID', as: 'cabinCrewDetails' });
CabinCrew.belongsTo(Crew, { foreignKey: 'CrewID', as: 'crew' });

Employee.hasOne(GroundStaff, { foreignKey: 'EmployeeID', as: 'groundStaffDetails' });
GroundStaff.belongsTo(Employee, { foreignKey: 'EmployeeID', as: 'employee' });

Aircraft.hasMany(Maintenance, { foreignKey: 'AircraftID', as: 'maintenanceRecords' });
Maintenance.belongsTo(Aircraft, { foreignKey: 'AircraftID', as: 'aircraft' });

Employee.hasOne(AdminUser, { foreignKey: 'EmployeeID', as: 'adminDetails' });
AdminUser.belongsTo(Employee, { foreignKey: 'EmployeeID', as: 'employee' });

Flight.belongsToMany(Crew, { through: FlightCrewAssignment, foreignKey: 'FlightID', as: 'assignedCrew' });
Crew.belongsToMany(Flight, { through: FlightCrewAssignment, foreignKey: 'CrewID', as: 'assignedFlights' });

// Phase 5 Associations
Flight.hasMany(Cargo, { foreignKey: 'FlightID', as: 'cargo' });
Cargo.belongsTo(Flight, { foreignKey: 'FlightID', as: 'flight' });

// Cargo events timeline
Cargo.hasMany(CargoEvent, { foreignKey: 'CargoID', as: 'events' });
CargoEvent.belongsTo(Cargo, { foreignKey: 'CargoID', as: 'cargo' });

// Notification logs
Passenger.hasMany(NotificationLog, { foreignKey: 'PassengerID', as: 'notifications' });
NotificationLog.belongsTo(Passenger, { foreignKey: 'PassengerID', as: 'passenger' });

// Ticket → Flight association (for seat map queries)
Ticket.belongsTo(Flight, { foreignKey: 'FlightID', as: 'flight' });
Flight.hasMany(Ticket, { foreignKey: 'FlightID', as: 'tickets' });

module.exports = {
  sequelize,
  Airport,
  Aircraft,
  Flight,
  FlightPricing,
  Schedule,
  Booking,
  Person,
  Passenger,
  Employee,
  Guest,
  MealPlan,
  FrequentFlyer,
  LoyaltyAccount,
  MilesTransaction,
  RefreshToken,
  EmailVerificationToken,
  PasswordResetToken,
  Payment,
  Refund,
  Ticket,
  Baggage,
  BaggageEvent,
  LostBaggage,
  Crew,
  Pilot,
  CabinCrew,
  GroundStaff,
  Maintenance,
  AdminUser,
  FlightCrewAssignment,
  Cargo,
  CargoEvent,
  NotificationLog,
};
