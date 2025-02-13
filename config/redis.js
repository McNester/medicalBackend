const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
    }
})();

module.exports = redisClient;

