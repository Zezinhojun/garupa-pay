import { Account } from "../../../domain/entities/account.entity";
import { IAccountRepository } from "../../../domain/interfaces/account.repository.interface";
import { ICacheRepository } from "../../../domain/interfaces/cache.repository.interface";
import { IOrmRepository } from "../../../domain/interfaces/orm.client.interface";
import { AccountMapper } from "../../clients/orms/mappers/account.mapper";
import { AccountORM } from "../../clients/orms/typeorm/entities/account.orm.entity";
import { BaseRepository } from "./base.repository";

export class AccountRepository extends BaseRepository<Account, AccountORM> implements IAccountRepository {
    constructor(
        client: IOrmRepository<AccountORM>,
        mapper: AccountMapper,
        cacheRepository: ICacheRepository
    ) {
        super(client, mapper, cacheRepository)
    }

    async findAll(): Promise<Account[]> {
        const ormEntities = await this.client.find({}, ['sentTransactions', 'receivedTransactions']);
        return ormEntities.map(entity => this.mapper.toDomain(entity));
    }
}