import { Request, Response, NextFunction } from 'express';
import redis, { createClient } from 'redis';
import { errorTooManyRequests } from './responses-helper';

const redisHost: string = process.env.REDIS_HOST ?? 'localhost';
const redisPort: string = process.env.REDIS_PORT ?? '6379';

const rateLimitWindowMilliseconds: number = 60000;
const rateLimitWindowMaxRequests: number = parseInt(process.env.API_MAX_REQUESTS ?? "") || 100;

const redisClient: redis.RedisClientType = createClient({
    url: `redis://${redisHost}:${redisPort}`
});

type TokenBucket = {
    tokens: number,
    last: number
}

async function getTokenBucketForIP(ip: string): Promise<TokenBucket> {
    const tokenBucket: { [x: string]: string } = await redisClient.hGetAll(ip);
    let parsedTokenBucket: TokenBucket = {
        tokens: parseFloat(tokenBucket.tokens) || rateLimitWindowMaxRequests,
        last: parseInt(tokenBucket.last) || Date.now()
    }
    return parsedTokenBucket;
}

async function saveTokenBucketForIP(ip: string, tokenBucket: TokenBucket): Promise<void> {
    await redisClient.hSet(ip, [
        ['tokens', tokenBucket.tokens],
        ['last', tokenBucket.last]
    ])
}

function refreshTokenBucket(tokenBucket: TokenBucket) {
    const timestamp: number = Date.now();
    const elapsedMilliseconds: number = timestamp - tokenBucket.last;
    const refreshRate: number = rateLimitWindowMaxRequests / rateLimitWindowMilliseconds;

    tokenBucket.tokens += elapsedMilliseconds * refreshRate;
    tokenBucket.tokens = Math.min(rateLimitWindowMaxRequests, tokenBucket.tokens);

    tokenBucket.last = timestamp;
}

export async function initializeRateLimiting(): Promise<void> {
    await redisClient.connect();
}

export async function rateLimit(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (rateLimitWindowMaxRequests <= 0) {
        next();
        return;
    }
    try {
        const ip: string = String(req.ip);

        const tokenBucket: TokenBucket = await getTokenBucketForIP(ip);
        refreshTokenBucket(tokenBucket);

        if (tokenBucket.tokens >= 1) {
            tokenBucket.tokens -= 1;
            next();
        } else {
            errorTooManyRequests(res);
        }

        await saveTokenBucketForIP(ip, tokenBucket);

    } catch (err) {
        console.log(err);
        console.log("Error in rate limiting. Bypassing.");
        next();
    }
}
