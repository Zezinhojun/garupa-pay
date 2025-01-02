import { Transaction } from '../../../../domain/entities/transaction.entity';
import { TransactionORM } from './../typeorm/entities/transaction.orm.entity';
import { BaseMapper } from "./base.mapper";

export class TransactionMapper extends BaseMapper<Transaction, TransactionORM> {
    toDomain(orm: TransactionORM): Transaction {
        if (!orm.id || !orm.fromAccountId || !orm.toAccountId || !orm.amount || !orm.status || !orm.type) {
            throw new Error("Invalid data in ORM entity.");
        }
        const transaction = new Transaction({
            id: orm.id,
            fromAccountId: orm.fromAccountId,
            toAccountId: orm.toAccountId,
            amount: orm.amount,
            status: orm.status,
            dueDate: orm.dueDate ?? null,
            type: orm.type,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt
        });
        return transaction
    }

    toPersistence(domain: Transaction): TransactionORM {
        const transactioOrm = new TransactionORM();
        if (domain.id) {
            transactioOrm.id = domain.id;
        }
        transactioOrm.fromAccountId = domain.fromAccountId
        transactioOrm.toAccountId = domain.toAccountId
        transactioOrm.amount = domain.amount
        transactioOrm.status = domain.status
        if (domain.dueDate) {
            transactioOrm.dueDate = domain.dueDate;
        }
        transactioOrm.type = domain.type

        return transactioOrm
    }

}