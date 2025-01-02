import { Container } from "inversify";
import { IEventBus } from "../domain/interfaces/eventbus.interface";
import { TYPES } from "./types";
import { RedisClientAdapter } from "../infrastructure/clients/redis/redis.event.client";
import { RedisCacheClientAdapter } from "../infrastructure/clients/redis/redis.cache.client";
import { ICacheClient } from "../domain/interfaces/cache.client.interface";
import { redisConfig } from "../infrastructure/clients/redis/config";
import { RedisConnection } from "../infrastructure/clients/redis/connection";

const container = new Container()

export async function initializeContainer() {
    const mainRedis = await RedisConnection.connect(redisConfig);
    const subscriberRedis = await RedisConnection.connectSubscriber(redisConfig);

    container.bind<IEventBus>(TYPES.EventBusClient)
        .toDynamicValue(() => new RedisClientAdapter(mainRedis, subscriberRedis))
        .inSingletonScope();

    container.bind<ICacheClient>(TYPES.CacheClient)
        .toDynamicValue(() => new RedisCacheClientAdapter(mainRedis))
        .inSingletonScope();

    return container;
}
