/**
 * Loyalty Miles Accrual Worker
 * Automatically awards miles to frequent flyers after a flight is marked ARRIVED.
 * 
 * Can be triggered via:
 * - POST /api/v1/loyalty/accrue (manual)
 * - Cron job scanning for ARRIVED flights with un-accrued miles
 */

const { FrequentFlyer, LoyaltyAccount, Ticket, Booking, Flight } = require('../models');

const MILES_PER_HOUR = 500; // Base miles per flight hour

const TIER_MULTIPLIERS = {
  BRONZE: 1.0,
  SILVER: 1.25,
  GOLD: 1.5,
  PLATINUM: 2.0
};

const TIER_THRESHOLDS = {
  SILVER: 25000,
  GOLD: 50000,
  PLATINUM: 100000
};

/**
 * Accrue miles for a specific ticket after flight completion
 */
const accrueForTicket = async (ticketNo) => {
  try {
    const ticket = await Ticket.findOne({
      where: { TicketNo: ticketNo },
      include: [
        {
          model: Booking, as: 'booking',
          include: [{ model: Flight, as: 'flight' }]
        }
      ]
    });

    if (!ticket || !ticket.PassengerID) return null;

    const ff = await FrequentFlyer.findOne({ where: { PassengerID: ticket.PassengerID } });
    if (!ff) return null; // Not enrolled in loyalty program

    const account = await LoyaltyAccount.findOne({ where: { FFID: ff.FFID } });
    if (!account) return null;

    const flight = ticket.booking?.flight;
    if (!flight) return null;

    const flightHours = (flight.Duration_Hours || 0) + (flight.Duration_Minutes || 0) / 60;
    const baseMiles = Math.round(flightHours * MILES_PER_HOUR);

    // Apply cabin class bonus
    let classMultiplier = 1.0;
    if (ticket.CabinClass === 'BUSINESS') classMultiplier = 1.5;
    if (ticket.CabinClass === 'FIRST') classMultiplier = 2.0;

    // Apply tier multiplier
    const tierMult = TIER_MULTIPLIERS[account.TierStatus] || 1.0;

    const earnedMiles = Math.round(baseMiles * classMultiplier * tierMult);

    // Update balances
    account.TotalMiles = parseFloat(account.TotalMiles || 0) + earnedMiles;
    ff.MilesBalance = parseFloat(ff.MilesBalance || 0) + earnedMiles;

    // Evaluate tier upgrade
    const totalMiles = parseFloat(account.TotalMiles);
    if (totalMiles >= TIER_THRESHOLDS.PLATINUM) {
      account.TierStatus = 'PLATINUM';
      ff.TierLevel = 'PLATINUM';
      account.LoungePass = true;
      account.ConciergeAccess = true;
      account.GlobalLoungeAccess = true;
      account.BonusMult = 2.0;
    } else if (totalMiles >= TIER_THRESHOLDS.GOLD) {
      account.TierStatus = 'GOLD';
      ff.TierLevel = 'GOLD';
      account.LoungePass = true;
      account.BonusMult = 1.5;
    } else if (totalMiles >= TIER_THRESHOLDS.SILVER) {
      account.TierStatus = 'SILVER';
      ff.TierLevel = 'SILVER';
      account.BonusMult = 1.25;
    }

    await account.save();
    await ff.save();

    console.log(`🎯 [LOYALTY WORKER] Accrued ${earnedMiles} miles for passenger ${ticket.PassengerID} (ticket ${ticketNo})`);

    return { earnedMiles, newBalance: ff.MilesBalance, tier: account.TierStatus };
  } catch (error) {
    console.error('Loyalty accrual error:', error.message);
    return null;
  }
};

module.exports = { accrueForTicket };
