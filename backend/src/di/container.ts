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
import { TypeOrmConnection } from "../infrastructure/orms/typeorm/connection";
import { IOrmRepository } from "../domain/interfaces/orm.client.interface";
import { AccountORM } from "../infrastructure/orms/typeorm/entities/account.orm.entity";
import { TransactionORM } from "../infrastructure/orms/typeorm/entities/transaction.orm.entity";
import { TypeOrmClientAdapter } from "../infrastructure/orms/typeorm/typeorm.client";

const container = new Container()

export async function initializeContainer() {
    container.bind<IHttpServer>(TYPES.HttpServer).to(ExpressClientAdapter).inSingletonScope();
    const dataSource = await TypeOrmConnection.connect();
    console.log("TypeORM connected successfully");

    container.bind<IOrmRepository<TransactionORM>>(TYPES.TransactionRepository)
        .toDynamicValue(() => new TypeOrmClientAdapter<TransactionORM>(dataSource.getRepository(TransactionORM)))
        .inSingletonScope();

    container.bind<IOrmRepository<AccountORM>>(TYPES.AccountRepository)
        .toDynamicValue(() => new TypeOrmClientAdapter<AccountORM>(dataSource.getRepository(AccountORM)))
        .inSingletonScope();

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
