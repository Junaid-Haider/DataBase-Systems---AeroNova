/**
 * PDF Generation Worker
 * Generates boarding pass PDFs for ticket delivery.
 * 
 * In production, use Puppeteer or PDFKit.
 * For now, generates an HTML-based boarding pass that can be printed to PDF.
 */

const generateBoardingPassHTML = ({ passengerName, pnr, flightNo, depAirport, arrAirport, depDate, depTime, seatNo, cabinClass, ticketNo, baggageAllowance }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Boarding Pass - ${pnr}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; padding: 40px; display: flex; justify-content: center; }
      .pass { width: 700px; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
      .header { background: linear-gradient(135deg, #0ea5e9, #6366f1); padding: 20px 28px; display: flex; justify-content: space-between; align-items: center; }
      .header h1 { color: white; font-size: 20px; }
      .header .pnr { background: rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 8px; color: white; font-weight: bold; font-size: 16px; letter-spacing: 2px; }
      .route { display: flex; align-items: center; justify-content: center; gap: 32px; padding: 28px; border-bottom: 2px dashed #e2e8f0; }
      .code { font-size: 42px; font-weight: 800; color: #0ea5e9; }
      .arrow { color: #94a3b8; font-size: 28px; }
      .details { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; padding: 24px 28px; }
      .field label { color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
      .field .val { color: #1e293b; font-size: 16px; font-weight: 600; margin-top: 4px; }
      .footer { padding: 16px 28px; background: #f1f5f9; text-align: center; color: #94a3b8; font-size: 11px; }
      @media print { body { padding: 0; background: white; } .pass { box-shadow: none; border: 1px solid #e2e8f0; } }
    </style>
  </head>
  <body>
    <div class="pass">
      <div class="header">
        <h1>✈ AeroNova Airlines</h1>
        <div class="pnr">${pnr}</div>
      </div>
      <div class="route">
        <div class="code">${depAirport}</div>
        <div class="arrow">→</div>
        <div class="code">${arrAirport}</div>
      </div>
      <div class="details">
        <div class="field"><label>Passenger</label><div class="val">${passengerName}</div></div>
        <div class="field"><label>Flight</label><div class="val">${flightNo}</div></div>
        <div class="field"><label>Date</label><div class="val">${depDate}</div></div>
        <div class="field"><label>Departure</label><div class="val">${depTime}</div></div>
        <div class="field"><label>Seat</label><div class="val">${seatNo}</div></div>
        <div class="field"><label>Cabin</label><div class="val">${cabinClass}</div></div>
        <div class="field"><label>Ticket</label><div class="val">${ticketNo}</div></div>
        <div class="field"><label>Baggage</label><div class="val">${baggageAllowance} kg</div></div>
        <div class="field"><label>Gate</label><div class="val">See display</div></div>
      </div>
      <div class="footer">This is your boarding pass. Please present this at the gate. AeroNova Airlines.</div>
    </div>
  </body>
  </html>`;
};

module.exports = { generateBoardingPassHTML };
