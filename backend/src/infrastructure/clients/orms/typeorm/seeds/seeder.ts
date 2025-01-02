import { DataSource } from "typeorm";
import { TypeOrmConnection } from "../connection";
import { AccountORM } from "../entities/account.orm.entity";
import { TransactionORM } from "../entities/transaction.orm.entity";
import { TransactionMapper } from "../../mappers/transaction.mapper";
import { Account } from "../../../../../domain/entities/account.entity";
import { StatusTransaction, Transaction, TransactionType } from "../../../../../domain/entities/transaction.entity";

export class Seeder {
    private readonly dataSource: DataSource;

    constructor() {
        this.dataSource = TypeOrmConnection.getInstance();
    }

    private async seedAccounts() {
        const accountRepository = this.dataSource.getRepository(AccountORM);
        const existingAccounts = await accountRepository.find();

        if (existingAccounts.length === 0) {
            await accountRepository.save([
                {
                    name: 'José Junior',
                    userCpf: '12345678901',
                    balance: 1000.00,
                    isActive: true
                },
                {
                    name: 'Eminem',
                    userCpf: '98765432100',
                    balance: 2000.00,
                    isActive: true
                },
            ]);
            console.log('Accounts seeded successfully.');
            return await accountRepository.find();
        } else {
            console.log('Accounts already exist.');
            return existingAccounts;
        }
    }

    private async seedTransactions() {
        const transactionRepository = this.dataSource.getRepository(TransactionORM);
        const existingTransactions = await transactionRepository.find();
        const accountRepository = this.dataSource.getRepository(AccountORM);

        if (existingTransactions.length === 0) {
            const accounts = await this.seedAccounts();

            if (accounts.length >= 2) {
                const account1 = accounts[0];
                const account2 = accounts[1];

                const account1Domain = new Account({
                    userCpf: account1.userCpf,
                    name: account1.name,
                    balance: account1.balance,
                    isActive: account1.isActive,
                    id: account1.id,
                });

                const account2Domain = new Account({
                    userCpf: account2.userCpf,
                    name: account2.name,
                    balance: account2.balance,
                    isActive: account2.isActive,
                    id: account2.id,
                });

                account1Domain.withdraw(150);
                account2Domain.deposit(150);

                const transaction = new Transaction({
                    fromAccountId: account1.id,
                    toAccountId: account2.id,
                    amount: 150.00,
                    status: StatusTransaction.COMPLETED,
                    type: TransactionType.WITHDRAW,
                    dueDate: new Date(),
                });
                const transactionMapper = new TransactionMapper();
                const transactionOrm = transactionMapper.toPersistence(transaction);
                await transactionRepository.save(transactionOrm);
                account1Domain.addTransaction(transaction);
                transaction.setType(TransactionType.DEPOSIT);
                account2Domain.addTransaction(transaction);
                await accountRepository.update(account1.id, { balance: account1Domain.balance });
                await accountRepository.update(account2.id, { balance: account2Domain.balance });

                console.log('Transactions seeded successfully.');
            } else {
                console.log('Not enough accounts to create transactions.');
            }
        } else {
            console.log('Transactions already exist.');
        }
    }

    public async initialize() {
        try {
            console.log('Initializing seeds...');
            await this.seedAccounts();
            await this.seedTransactions();
            console.log('Seeds initialized successfully.');
        } catch (error) {
            console.error('Error while seeding:', error);
            throw error;
        }
    }

}