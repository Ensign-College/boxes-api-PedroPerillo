const {createClient} = require('redis');

const REDIS_HOST = "127.0.0.1";
const REDIS_PORT = 6379;
// Create Redis Client & Handle Connection Errors
const redisClient = createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`
})

redisClient.connect().then(r => {
    console.log("Redis client connected");
});

redisClient.on('error', function(err) {
    console.error('Error connecting to Redis', err);
})

module.exports = redisClient