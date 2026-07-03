const { v4: uuidv4 } = require('uuid');

/**
 * Generate a PNR (Passenger Name Record) in format: AX-YYYYMMDD-XXXXX
 * where XXXXX is a 5-character alphanumeric code
 */
function generatePNR() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // removed confusing chars I,O,0,1
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `AX-${dateStr}-${code}`;
}

module.exports = { generatePNR };
