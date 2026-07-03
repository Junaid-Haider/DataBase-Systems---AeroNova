const Redis = require('ioredis');
require('dotenv').config();

let redis = null;

try {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) {
        console.warn('Redis connection failed, seat locking will use in-memory fallback');
        return null;
      }
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  redis.on('error', (err) => {
    console.warn('Redis connection error:', err.message);
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected');
  });
} catch (err) {
  console.warn('Redis not available, using in-memory fallback');
}

module.exports = redis;
