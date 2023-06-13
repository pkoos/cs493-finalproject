import redis from 'redis';

const redisHost: string = process.env.REDIS_HOST ?? 'localhost';
const redisPort: string = process.env.REDIS_PORT ?? '6379';

const rateLimitWindowMilliseconds = 60000;
const rateLimitWindowMaxRequests = process.env.API_MAX_REQUESTS ?? 100;

const redisClient: redis.RedisClientType = redis.createClient({
    url: `redis://${redisHost}:${redisPort}`
});

export async function initializeRateLimiting() {
    await redisClient.connect();
}
