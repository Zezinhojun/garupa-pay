import { Container } from "inversify";
import { IEventBus } from "../domain/interfaces/eventbus.interface";
import { TYPES } from "./types";
import { RedisClientAdapter } from "../infrastructure/clients/redis/redis.event.client";
import { RedisCacheClientAdapter } from "../infrastructure/clients/redis/redis.cache.client";
import { ICacheClient } from "../domain/interfaces/cache.client.interface";
import { redisConfig } from "../infrastructure/clients/redis/config";
import { RedisConnection } from "../infrastructure/clients/redis/connection";
import { ICacheRepository } from "../domain/interfaces/cache.repository.interface";
import { CacheRepository } from "../infrastructure/database/repositories/cache.repository";
import { ExpressClientAdapter } from "../infrastructure/clients/express/express.client";
import { IHttpServer } from "../domain/interfaces/http.server.interface";

const container = new Container()

export async function initializeContainer() {
    container.bind<IHttpServer>(TYPES.HttpServer).to(ExpressClientAdapter).inSingletonScope();
    const mainRedis = await RedisConnection.connect(redisConfig);
    const subscriberRedis = await RedisConnection.connectSubscriber(redisConfig);

    container.bind<IEventBus>(TYPES.EventBusClient)
        .toDynamicValue(() => new RedisClientAdapter(mainRedis, subscriberRedis))
        .inSingletonScope();

    container.bind<ICacheClient>(TYPES.CacheClient)
        .toDynamicValue(() => new RedisCacheClientAdapter(mainRedis))
        .inSingletonScope();
    container.bind<ICacheRepository>(TYPES.CacheRepository).to(CacheRepository);
    return container;
}

export { container };
