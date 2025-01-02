import Redis from "ioredis";
import { ICacheClient } from "../../../domain/interfaces/cache.client.interface";
import { injectable } from "inversify";

@injectable()
export class RedisCacheClientAdapter implements ICacheClient {
    private readonly redis: Redis;

    constructor(redisInstance: Redis) {
        this.redis = redisInstance;
    }

    async set(key: string, value: any): Promise<void> {
        await this.redis.set(key, JSON.stringify(value));
    }
    async get<T>(key: string): Promise<T | null> {
        const result = await this.redis.get(key);
        return result ? JSON.parse(result) : null;
    }
    async remove(key: string): Promise<void> {
        await this.redis.del(key);
    }

}