import { Account, IAccount } from "../../src/domain/entities/account.entity";
import { Transaction } from "../../src/domain/entities/transaction.entity";
import { ICacheClient } from "../../src/domain/interfaces/cache.client.interface";
import { IOrmRepository } from "../../src/domain/interfaces/orm.client.interface";
import { AccountORM } from "../../src/infrastructure/clients/orms/typeorm/entities/account.orm.entity";
import { TransactionORM } from "../../src/infrastructure/clients/orms/typeorm/entities/transaction.orm.entity";
import { BaseRepository } from "../../src/infrastructure/database/repositories/base.repository";

export const cacheRepositoryMock: ICacheClient = {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn()
}

export const mockOrmClient: IOrmRepository<any> = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

export const mockAccount: IAccount = {
    id: '123',
    balance: 1000,
    isActive: true,
    userCpf: '12345678901',
    name: 'John Doe',
    transactions: [],
};

export const eventBusMock = {
    emit: jest.fn(),
    subscribe: jest.fn(),
    close: jest.fn()
}

export const cacheClientMock: ICacheClient = {
    set: jest.fn(),
    get: jest.fn(),
    remove: jest.fn()
};


export const mockMapper = {
    toDomain: jest.fn(),
    toPersistence: jest.fn(),
    transactionMapper: {
        toDomain: jest.fn(),
        toPersistence: jest.fn(),
    },
};

export class MockAccountRepository extends BaseRepository<Account, AccountORM> {
    constructor() {
        super(mockOrmClient, mockMapper, cacheRepositoryMock);
    }
    create = jest.fn();
}

export class MockTransactionRepository extends BaseRepository<Transaction, TransactionORM> {
    constructor() {
        super(mockOrmClient, mockMapper, cacheRepositoryMock);
    }
    create = jest.fn();
}

export const accountRepositoryMock = new MockAccountRepository();
export const transactionRepositoryMock = new MockAccountRepository();

