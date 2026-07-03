const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Payment, Booking, Refund, Ticket, Baggage, Flight, FlightPricing, sequelize } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Helper to generate a ticket number
const generateTicketNo = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `AX-${year}-${randomNum}`;
};

// Process Payment (Mock implementation)
router.post('/process', authenticate, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { bookingId, amount, paymentMethod, idempotencyKey, cardType, last4Digits } = req.body;

    // 1. Idempotency Check
    const existingPayment = await Payment.findOne({ where: { IdempotencyKey: idempotencyKey }, transaction: t });
    if (existingPayment) {
      await t.rollback();
      return res.status(200).json({ message: 'Payment already processed', payment: existingPayment });
    }

    // 2. Fetch Booking
    const booking = await Booking.findByPk(bookingId, { transaction: t });
    if (!booking) {
      await t.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.Status !== 'PENDING') {
      if (booking.Status === 'CONFIRMED') {
        const existingTickets = await Ticket.findAll({ where: { BookingID: bookingId }, transaction: t });
        await t.commit();
        return res.json({ message: 'Booking already confirmed', tickets: existingTickets });
      }
      await t.rollback();
      return res.status(400).json({ error: 'Booking is already confirmed or cancelled' });
    }

    // 3. Mock Payment Gateway Delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // 4. Create Payment Record
    const payment = await Payment.create({
      BookingID: bookingId,
      Amount: amount,
      Status: 'COMPLETED',
      PaymentMethod: paymentMethod || 'CARD',
      CardType: cardType,
      Last4Digits: last4Digits,
      IdempotencyKey: idempotencyKey
    }, { transaction: t });

    // 5. Update Booking Status
    booking.Status = 'CONFIRMED';
    await booking.save({ transaction: t });

    // 6. Parse passengers & seats from booking JSON
    let passengers = booking.Passengers || [];
    if (typeof passengers === 'string') {
      try { passengers = JSON.parse(passengers); } catch(e) { passengers = []; }
    }
    while (typeof passengers === 'string') {
      try { passengers = JSON.parse(passengers); } catch(e) { break; }
    }
    
    let seats = booking.Seats || [];
    if (typeof seats === 'string') {
      try { seats = JSON.parse(seats); } catch(e) { seats = []; }
    }
    while (typeof seats === 'string') {
      try { seats = JSON.parse(seats); } catch(e) { break; }
    }

    // 7. Look up pricing from flight_pricing table (fallback to calculated)
    let baseFarePerPerson = 0;
    const cabinClass = booking.CabinClass || 'ECONOMY';
    
    try {
      const pricingRow = await FlightPricing.findOne({
        where: { FlightID: booking.FlightID, CabinClass: cabinClass },
        transaction: t
      });
      if (pricingRow) {
        baseFarePerPerson = parseFloat(pricingRow.BasePrice);
      }
    } catch(e) { /* table may not exist yet, fall through */ }
    
    const passengerCount = Array.isArray(passengers) ? Math.max(passengers.length, 1) : 1;
    
    if (!baseFarePerPerson || baseFarePerPerson <= 0) {
      baseFarePerPerson = amount / passengerCount;
    }
    
    const taxRate = 0.10;
    const feeRate = 0.04;
    const baseFare = Math.round(baseFarePerPerson / (1 + taxRate + feeRate) * 100) / 100;
    const taxes = Math.round(baseFare * taxRate * 100) / 100;
    const fees = Math.round(baseFare * feeRate * 100) / 100;
    const ticketPrice = baseFare + taxes + fees;
    
    const isBusinessOrFirst = ['BUSINESS', 'FIRST'].includes(cabinClass);
    const isFirst = cabinClass === 'FIRST';
    
    // 8. Generate Ticket(s) — one per passenger
    const tickets = [];
    
    for (let i = 0; i < passengerCount; i++) {
      const ticketNo = generateTicketNo() + (passengerCount > 1 ? `-${i + 1}` : '');
      const ticket = await Ticket.create({
        TicketNo: ticketNo,
        BookingID: bookingId,
        PassengerID: booking.PassengerID || null,
        FlightID: booking.FlightID,
        SeatNo: Array.isArray(seats) && seats[i] ? seats[i] : null,
        CabinClass: cabinClass,
        BaseFare: baseFare,
        Taxes: taxes,
        Fees: fees,
        Price: ticketPrice,
        Currency: booking.Currency || 'USD',
        BaggageAllw: isFirst ? 40 : (isBusinessOrFirst ? 32 : 23),
        LoungeAccess: isBusinessOrFirst,
        FlatBed: isFirst,
        SuiteNo: isFirst && seats[i] ? `S${seats[i]}` : null,
        PrivateDining: isFirst,
        CheckedIn: false,
        CheckInTime: null,
      }, { transaction: t });
      tickets.push(ticket);

      // 9. Attach Default Baggage per ticket
      await Baggage.create({
        TicketNo: ticket.TicketNo,
        TagNumber: `TAG-${uuidv4().substring(0, 8).toUpperCase()}`,
        BaggageType: 'CHECKED',
        WeightKg: 20.0,
        MaxDimCm: 158
      }, { transaction: t });
    }

    // 10. Decrement seats available in flight_pricing
    try {
      await FlightPricing.update(
        { SeatsAvailable: sequelize.literal(`SeatsAvailable - ${passengerCount}`) },
        { where: { FlightID: booking.FlightID, CabinClass: cabinClass }, transaction: t }
      );
    } catch(e) { /* table may not exist yet */ }

    await t.commit();
    res.json({ message: 'Payment successful, ticket generated', payment, tickets });
  } catch (error) {
    try {
      if (t && !t.finished) await t.rollback();
    } catch (rollbackError) {
      console.error('Transaction rollback failed:', rollbackError);
    }
    console.error('Payment processing error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error?.message || 'Internal server error' });
    }
  }
});

// Process Refund
router.post('/:id/refund', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, { include: ['booking'] });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    if (payment.Status !== 'COMPLETED') return res.status(400).json({ error: 'Payment cannot be refunded' });

    const { amount, reason } = req.body;

    // Create refund record
    const refund = await Refund.create({
      PaymentID: payment.PaymentID,
      RefundAmt: amount || payment.Amount,
      Reason: reason || 'Customer requested refund'
    });

    // Update payment status
    payment.Status = 'REFUNDED';
    await payment.save();

    // Cancel booking
    if (payment.booking) {
      payment.booking.Status = 'CANCELLED';
      await payment.booking.save();
    }

    res.json({ message: 'Refund processed successfully', refund });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
