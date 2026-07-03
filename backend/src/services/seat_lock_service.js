const redis = require('../config/redis');

// In-memory fallback when Redis is not available
const memoryLocks = new Map();

class SeatLockService {
  /**
   * Lock a seat for a flight with 15-minute TTL
   * @param {number} flightId
   * @param {string} seatNo
   * @param {string} sessionId
   * @returns {boolean} true if lock acquired
   */
  static async lockSeat(flightId, seatNo, sessionId) {
    const key = `seat:${flightId}:${seatNo}`;
    const ttl = 900; // 15 minutes

    try {
      if (redis && redis.status === 'ready') {
        const result = await redis.set(key, sessionId, 'EX', ttl, 'NX');
        return result === 'OK';
      }
    } catch (err) {
      console.warn('Redis lock failed, using memory fallback:', err.message);
    }

    // In-memory fallback
    const existing = memoryLocks.get(key);
    if (existing && existing.expires > Date.now()) {
      return false; // Already locked
    }
    memoryLocks.set(key, { sessionId, expires: Date.now() + ttl * 1000 });
    return true;
  }

  /**
   * Check if a seat is locked
   * @param {number} flightId
   * @param {string} seatNo
   * @returns {string|null} sessionId if locked, null if available
   */
  static async getSeatLock(flightId, seatNo) {
    const key = `seat:${flightId}:${seatNo}`;

    try {
      if (redis && redis.status === 'ready') {
        return await redis.get(key);
      }
    } catch (err) {
      console.warn('Redis get failed:', err.message);
    }

    const existing = memoryLocks.get(key);
    if (existing && existing.expires > Date.now()) {
      return existing.sessionId;
    }
    memoryLocks.delete(key);
    return null;
  }

  /**
   * Release a seat lock
   * @param {number} flightId
   * @param {string} seatNo
   */
  static async releaseSeat(flightId, seatNo) {
    const key = `seat:${flightId}:${seatNo}`;

    try {
      if (redis && redis.status === 'ready') {
        await redis.del(key);
      }
    } catch (err) {
      console.warn('Redis delete failed:', err.message);
    }

    memoryLocks.delete(key);
  }

  /**
   * Get all locked seats for a flight
   * @param {number} flightId
   * @returns {string[]} array of locked seat numbers
   */
  static async getLockedSeats(flightId) {
    const lockedSeats = [];

    try {
      if (redis && redis.status === 'ready') {
        const pattern = `seat:${flightId}:*`;
        const keys = await redis.keys(pattern);
        for (const key of keys) {
          const seatNo = key.split(':')[2];
          lockedSeats.push(seatNo);
        }
        return lockedSeats;
      }
    } catch (err) {
      console.warn('Redis keys failed:', err.message);
    }

    // In-memory fallback
    const prefix = `seat:${flightId}:`;
    for (const [key, value] of memoryLocks.entries()) {
      if (key.startsWith(prefix) && value.expires > Date.now()) {
        lockedSeats.push(key.replace(prefix, ''));
      }
    }
    return lockedSeats;
  }
}

module.exports = SeatLockService;
