import { ProcessTransactionUseCase } from './../applications/usecases/processTransaction.usecase';
import { Container } from "inversify";
import { IEventBus } from "../domain/interfaces/eventbus.interface";
import { TYPES } from "./types";
import { RedisClientAdapter } from "../infrastructure/clients/redis/redis.event.client";
import { RedisCacheClientAdapter } from "../infrastructure/clients/redis/redis.cache.client";
import { redisConfig } from "../infrastructure/clients/redis/config";
import { RedisConnection } from "../infrastructure/clients/redis/connection";
import { ExpressClientAdapter } from "../infrastructure/clients/express/express.client";
import { IHttpServer } from "../domain/interfaces/http.server.interface";
import { IOrmRepository } from "../domain/interfaces/orm.client.interface";
import { PostgresConnection } from "../infrastructure/clients/postgres/connection";
import { postgresConfig } from "../infrastructure/clients/postgres/config";
import { IMapper } from "../domain/interfaces/mapper.interface";
import { Account } from "../domain/entities/account.entity";
import { Transaction } from "../domain/entities/transaction.entity";
import { ICacheRepository } from "../domain/interfaces/cache.repository.interface";
import { CacheRepository } from "../infrastructure/database/repositories/cache.repository";
import { AccountMapper } from "../infrastructure/clients/orms/mappers/account.mapper";
import { TransactionMapper } from "../infrastructure/clients/orms/mappers/transaction.mapper";
import { TypeOrmConnection } from "../infrastructure/clients/orms/typeorm/connection";
import { AccountORM } from "../infrastructure/clients/orms/typeorm/entities/account.orm.entity";
import { TransactionORM } from "../infrastructure/clients/orms/typeorm/entities/transaction.orm.entity";
import { TypeOrmClientAdapter } from "../infrastructure/clients/orms/typeorm/typeorm.client";
import { IBaseRepository } from "../domain/interfaces/base.repository";
import { IAccountRepository } from "../domain/interfaces/account.repository.interface";
import { TransactionRepository } from "../infrastructure/database/repositories/transaction.repository";
import { AccountRepository } from "../infrastructure/database/repositories/account.repository";
import { UpdateAccountStatusUseCase } from "../applications/usecases/updateAccountStatus.usecase";
import { CreateTransactionUseCase } from "../applications/usecases/createTransaction.usecase";
import { TransactionEventHandler } from '../infrastructure/events/transaction.handler';
import { ICacheClient } from '../domain/interfaces/cache.client.interface copy';
import { AccountController } from '../applications/usecases/controllers/account.controller';

const container = new Container()

export async function initializeContainer() {
    initializePostgres()
    await initializeTypeOrm();
    await initializeRedis();

    initializeHttpServer();
    initializeCache();
    initializeMappers()
    initializeRepositories();
    initializeUseCases();
    initializeControllers()

    return container;
}

function initializePostgres() {
    PostgresConnection.connect(postgresConfig);
}

async function initializeTypeOrm() {
    const dataSource = await TypeOrmConnection.connect();
    container.bind<IOrmRepository<TransactionORM>>(TYPES.TransactionRepository)
        .toDynamicValue(() => new TypeOrmClientAdapter<TransactionORM>(dataSource.getRepository(TransactionORM)))
        .inSingletonScope();

    container.bind<IOrmRepository<AccountORM>>(TYPES.AccountRepository)
        .toDynamicValue(() => new TypeOrmClientAdapter<AccountORM>(dataSource.getRepository(AccountORM)))
        .inSingletonScope();
}

async function initializeRedis() {
    const mainRedis = await RedisConnection.connect(redisConfig);
    const subscriberRedis = await RedisConnection.connectSubscriber(redisConfig);

    container.bind<IEventBus>(TYPES.EventBusClient)
        .toDynamicValue(() => new RedisClientAdapter(mainRedis, subscriberRedis))
        .inSingletonScope();

    container.bind<ICacheClient>(TYPES.CacheClient)
        .toDynamicValue(() => new RedisCacheClientAdapter(mainRedis))
        .inSingletonScope();
}

function initializeHttpServer() {
    container.bind<IHttpServer>(TYPES.HttpServer).to(ExpressClientAdapter).inSingletonScope();
}

function initializeCache() {
    container.bind<ICacheRepository>(TYPES.CacheRepository).to(CacheRepository);
}

function initializeMappers() {
    container.bind<IMapper<Account, AccountORM>>(TYPES.AccountMapper).to(AccountMapper);
    container.bind<IMapper<Transaction, TransactionORM>>(TYPES.TransactionMapper).to(TransactionMapper);
}

function initializeRepositories() {
    container.bind<IBaseRepository<Transaction>>(TYPES.TransactionRepository).to(TransactionRepository).inSingletonScope();
    container.bind<IAccountRepository>(TYPES.AccountRepository).to(AccountRepository).inSingletonScope();
}

function initializeUseCases() {
    container.bind<UpdateAccountStatusUseCase>(TYPES.UpdateAccountStatusUseCase)
        .to(UpdateAccountStatusUseCase)
        .inSingletonScope();

    container.bind<CreateTransactionUseCase>(TYPES.CreateTransactionUseCase)
        .to(CreateTransactionUseCase)
        .inSingletonScope();

    container.bind<ProcessTransactionUseCase>(TYPES.ProcessTransactionUseCase)
        .to(ProcessTransactionUseCase)
        .inSingletonScope();

    container.bind<TransactionEventHandler>(TYPES.TransactionEventHandler)
        .to(TransactionEventHandler)
        .inSingletonScope();
}

function initializeControllers() {
    container.bind<AccountController>(TYPES.AccountController)
        .to(AccountController)
        .inSingletonScope();
}

export { container };
