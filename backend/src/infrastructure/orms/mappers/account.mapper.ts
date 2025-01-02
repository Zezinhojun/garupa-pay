import { Account } from "../../../domain/entities/account.entity";
import { AccountORM } from "../typeorm/entities/account.orm.entity";
import { BaseMapper } from "./base.mapper";
import { TransactionMapper } from "./transaction.mapper";

export class AccountMapper extends BaseMapper<Account, AccountORM> {
    public readonly transactionMapper: TransactionMapper;
    constructor() {
        super();
        this.transactionMapper = new TransactionMapper();
    }

    toDomain(orm: AccountORM): Account {
        if (!orm.userCpf || !orm.name || !orm.balance || orm.isActive === undefined) {
            throw new Error("invalid data in ORM entity.");
        }

        const sentTransactions = Array.isArray(orm.sentTransactions) ? orm.sentTransactions : [];
        const receivedTransactions = Array.isArray(orm.receivedTransactions) ? orm.receivedTransactions : [];
        const account = new Account({
            userCpf: orm.userCpf,
            name: orm.name,
            balance: orm.balance,
            isActive: orm.isActive,
            id: orm.id,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt
        });

        const allTransactions = [...sentTransactions, ...receivedTransactions];

        allTransactions.forEach(transactionOrm => {
            account.addTransaction(this.transactionMapper.toDomain(transactionOrm));
        });

        return account;
    }

    toPersistence(domain: Account): AccountORM {
        if (!domain.userCpf || !domain.name || domain.balance === undefined || domain.isActive === undefined) {
            throw new Error("Missing required fields in domain entity.");
        }

        const accountOrm = new AccountORM()

        if (domain.id) {
            accountOrm.id = domain.id;
        }
        accountOrm.userCpf = domain.userCpf;
        accountOrm.name = domain.name;
        accountOrm.balance = domain.balance;
        accountOrm.isActive = domain.isActive;

        if (domain.transactions && domain.transactions.length > 0) {
            const sentTransactions = domain.transactions.filter(transaction => transaction.type === 'WITHDRAW');
            const receivedTransactions = domain.transactions.filter(transaction => transaction.type === 'DEPOSIT');

            accountOrm.sentTransactions = sentTransactions.map(transaction =>
                this.transactionMapper.toPersistence(transaction)
            );
            accountOrm.receivedTransactions = receivedTransactions.map(transaction =>
                this.transactionMapper.toPersistence(transaction)
            );
        }

        return accountOrm;
    }
}