const express = require('express');
const { LoyaltyAccount, FrequentFlyer, Passenger, MilesTransaction } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/loyalty/account
router.get('/account', authenticate, async (req, res) => {
  try {
    const ff = await FrequentFlyer.findOne({ where: { PassengerID: req.user.PersonID || req.user.PassengerID } });
    if (!ff) {
      return res.status(404).json({ error: 'Not enrolled in loyalty program' });
    }

    const account = await LoyaltyAccount.findOne({ where: { FFID: ff.FFID } });
    
    // Include last 5 transactions per spec
    const recentTransactions = await MilesTransaction.findAll({
      where: { FFID: ff.FFID },
      order: [['TxDate', 'DESC']],
      limit: 5
    });

    res.json({ frequentFlyer: ff, account, recentTransactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/loyalty/transactions
router.get('/transactions', authenticate, async (req, res) => {
  try {
    const ff = await FrequentFlyer.findOne({ where: { PassengerID: req.user.PersonID || req.user.PassengerID } });
    if (!ff) {
      return res.status(404).json({ error: 'Not enrolled in loyalty program' });
    }

    const transactions = await MilesTransaction.findAll({
      where: { FFID: ff.FFID },
      order: [['TxDate', 'DESC']]
    });

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/loyalty/enroll
router.post('/enroll', authenticate, async (req, res) => {
  try {
    const passengerId = req.user.PersonID || req.user.PassengerID;
    const existing = await FrequentFlyer.findOne({ where: { PassengerID: passengerId } });
    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in loyalty program' });
    }

    // Verify passenger profile exists
    const passenger = await Passenger.findByPk(passengerId);
    if (!passenger) {
      return res.status(400).json({ error: 'Passenger profile required to enroll' });
    }

    const ff = await FrequentFlyer.create({
      PassengerID: passengerId,
      EnrollDate: new Date(),
      MilesBalance: 0,
      TierLevel: 'SILVER' // SILvER is starting tier per spec
    });

    const accountNo = 'AX-FF-' + String(ff.FFID).padStart(5, '0');

    const account = await LoyaltyAccount.create({
      AccountNo: accountNo,
      FFID: ff.FFID,
      TierStatus: 'SILVER',
      TotalMiles: 0,
      EnrollDate: new Date(),
      BonusMult: 1.0,
      LoungePass: 0,
      UpgradeCred: 0,
      ConciergeAccess: false,
      GlobalLoungeAccess: false
    });

    res.status(201).json({ message: 'Enrolled successfully', frequentFlyer: ff, account });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/loyalty/accrue
router.post('/accrue', authenticate, async (req, res) => {
  try {
    const { ffid, distanceMiles, ticketNo, bookingId } = req.body;

    const account = await LoyaltyAccount.findOne({ where: { FFID: ffid } });
    if (!account) {
      return res.status(404).json({ error: 'Loyalty account not found' });
    }

    const ff = await FrequentFlyer.findByPk(ffid);

    // Tier Multipliers
    let multiplier = 1.0;
    if (account.TierStatus === 'GOLD') multiplier = 1.5;
    if (account.TierStatus === 'PLATINUM') multiplier = 2.0;

    const earnedMiles = Math.round(distanceMiles * multiplier);

    ff.MilesBalance = parseFloat(ff.MilesBalance) + earnedMiles;
    await ff.save();

    account.TotalMiles = parseFloat(account.TotalMiles) + earnedMiles;

    // Evaluate Tier Upgrades
    if (account.TotalMiles >= 100000 && account.TierStatus !== 'PLATINUM') {
      account.TierStatus = 'PLATINUM';
      ff.TierLevel = 'PLATINUM';
      account.BonusMult = 2.0;
      account.LoungePass = 1;
      account.GlobalLoungeAccess = true;
    } else if (account.TotalMiles >= 50000 && account.TierStatus === 'SILVER') {
      account.TierStatus = 'GOLD';
      ff.TierLevel = 'GOLD';
      account.BonusMult = 1.5;
      account.LoungePass = 1;
    }

    await account.save();
    await ff.save();

    // Create transaction record
    await MilesTransaction.create({
      FFID: ffid,
      Type: 'EARN',
      Miles: earnedMiles,
      TicketNo: ticketNo || null,
      BookingID: bookingId || null,
      Note: `Earned miles for flight`
    });

    res.json({ message: 'Miles accrued successfully', earnedMiles, account });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/loyalty/redeem
router.post('/redeem', authenticate, async (req, res) => {
  try {
    const { ffid, redeemMiles, ticketNo, bookingId } = req.body;

    const ff = await FrequentFlyer.findByPk(ffid);
    if (!ff) {
      return res.status(404).json({ error: 'Frequent flyer account not found' });
    }

    if (parseFloat(ff.MilesBalance) < redeemMiles) {
      return res.status(400).json({ error: 'Insufficient miles balance' });
    }

    ff.MilesBalance = parseFloat(ff.MilesBalance) - redeemMiles;
    await ff.save();

    // Create transaction record
    await MilesTransaction.create({
      FFID: ffid,
      Type: 'REDEEM',
      Miles: redeemMiles,
      TicketNo: ticketNo || null,
      BookingID: bookingId || null,
      Note: `Redeemed miles for discount`
    });

    // 100 miles = $1 discount
    const discountAmount = Math.round(redeemMiles / 100);

    res.json({ message: 'Miles redeemed successfully', discountAmount, remainingBalance: ff.MilesBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
