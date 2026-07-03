require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./models');

const airportRoutes = require('./routes/airports');
const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/bookings');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const ticketRoutes = require('./routes/tickets');
const baggageRoutes = require('./routes/baggage');
const cargoRoutes = require('./routes/cargo');
const loyaltyRoutes = require('./routes/loyalty');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'], credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/airports', airportRoutes);
app.use('/api/v1/flights', flightRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/baggage', baggageRoutes);
app.use('/api/v1/cargo', cargoRoutes);
app.use('/api/v1/loyalty', loyaltyRoutes);

const adminFlightsRoutes = require('./routes/admin/flights');
const adminAnalyticsRoutes = require('./routes/admin/analytics');
const adminCrewRoutes = require('./routes/admin/crew');
const adminFleetRoutes = require('./routes/admin/fleet');
const adminSettingsRoutes = require('./routes/admin/settings');

app.use('/api/v1/admin/flights', adminFlightsRoutes);
app.use('/api/v1/admin/analytics', adminAnalyticsRoutes);
app.use('/api/v1/admin/crew', adminCrewRoutes);
app.use('/api/v1/admin/fleet', adminFleetRoutes);
app.use('/api/v1/admin/settings', adminSettingsRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected');
    await sequelize.sync();
    console.log('✅ Tables synced');

    // Safely add new columns to existing tables (ignores if already exists)
    const safeAlter = async (sql) => {
      try { await sequelize.query(sql); } catch(e) { /* column already exists */ }
    };
    
    // Ticket table: add spec columns
    await safeAlter('ALTER TABLE `ticket` ADD COLUMN `FlightID` INT UNSIGNED NULL AFTER `PassengerID`');
    await safeAlter('ALTER TABLE `ticket` ADD COLUMN `BaseFare` DECIMAL(10,2) NULL AFTER `SeatNo`');
    await safeAlter('ALTER TABLE `ticket` ADD COLUMN `Taxes` DECIMAL(10,2) NULL DEFAULT 0 AFTER `BaseFare`');
    await safeAlter('ALTER TABLE `ticket` ADD COLUMN `Fees` DECIMAL(10,2) NULL DEFAULT 0 AFTER `Taxes`');
    await safeAlter('ALTER TABLE `ticket` ADD COLUMN `Currency` CHAR(3) NOT NULL DEFAULT \'USD\' AFTER `Price`');
    await safeAlter('ALTER TABLE `ticket` ADD COLUMN `CheckedIn` TINYINT(1) NOT NULL DEFAULT 0 AFTER `PrivateDining`');
    await safeAlter('ALTER TABLE `ticket` ADD COLUMN `CheckInTime` DATETIME NULL AFTER `CheckedIn`');
    
    // Booking table: add spec columns
    await safeAlter('ALTER TABLE `booking` ADD COLUMN `Currency` CHAR(3) NOT NULL DEFAULT \'USD\' AFTER `ContactPhone`');
    await safeAlter('ALTER TABLE `booking` ADD COLUMN `ReturnFlightID` INT UNSIGNED NULL AFTER `Currency`');
    
    console.log('✅ Schema migrations applied');

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start:', err);
    process.exit(1);
  }
}

start();
module.exports = app;
