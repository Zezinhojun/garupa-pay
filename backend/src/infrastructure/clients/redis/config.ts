import { RedisOptions } from "ioredis";

export interface RedisConfig {
    host: string;
    port: number;
}

export const redisConfig: RedisConfig = {
    host: process.env.REDIS_GARUPA_SERVICE_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_GARUPA_SERVICE_PORT ?? '6379'),
}

export const redisOptions: RedisOptions = {
    host: redisConfig.host,
    port: redisConfig.port,
    reconnectOnError: (err) => {
        console.error('Redis reconnect on error', err);
        return true;
    },
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay
    },
}