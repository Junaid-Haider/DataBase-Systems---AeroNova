/**
 * Email Worker
 * Handles sending transactional emails via SendGrid (or console log in dev)
 * 
 * Triggers:
 * - Registration verification
 * - Booking confirmation
 * - Ticket/boarding pass delivery
 * - Refund notification
 */

const sendEmail = async ({ to, subject, template, data }) => {
  // In production, integrate with SendGrid:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const templates = {
    booking_confirmation: (d) => `
      Dear ${d.passengerName},
      Your booking ${d.pnr} has been confirmed for flight ${d.flightNo}.
      Departure: ${d.depDate} from ${d.depAirport} to ${d.arrAirport}.
      Total: $${d.totalAmount}
    `,
    refund_notification: (d) => `
      Dear ${d.passengerName},
      Your refund of $${d.refundAmount} for booking ${d.pnr} has been processed.
      It will reflect in your account within 5-10 business days.
    `,
    ticket_delivery: (d) => `
      Dear ${d.passengerName},
      Your boarding pass for flight ${d.flightNo} is attached.
      Ticket No: ${d.ticketNo} | Seat: ${d.seatNo}
    `
  };

  const body = templates[template] ? templates[template](data) : `Notification: ${subject}`;

  // Dev mode: log to console
  console.log(`📧 [EMAIL WORKER] To: ${to} | Subject: ${subject}`);
  console.log(`   Body: ${body.trim()}`);

  return { success: true, to, subject };
};

module.exports = { sendEmail };
