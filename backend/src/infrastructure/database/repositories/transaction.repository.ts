import { Transaction } from "../../../domain/entities/transaction.entity";
import { ICacheRepository } from "../../../domain/interfaces/cache.repository.interface";
import { IOrmRepository } from "../../../domain/interfaces/orm.client.interface";
import { TransactionMapper } from "../../clients/orms/mappers/transaction.mapper";
import { TransactionORM } from "../../clients/orms/typeorm/entities/transaction.orm.entity";
import { BaseRepository } from "./base.repository";

export class TransactionRepository extends BaseRepository<Transaction, TransactionORM> {
    constructor(
        client: IOrmRepository<TransactionORM>,
        mapper: TransactionMapper,
        cacheRepository: ICacheRepository
    ) {
        super(client, mapper, cacheRepository)
    }
}