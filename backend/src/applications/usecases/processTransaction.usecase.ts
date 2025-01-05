import { inject, injectable } from "inversify";
import { Account } from "../../domain/entities/account.entity";
import { StatusTransaction, Transaction, TransactionType } from "../../domain/entities/transaction.entity"
import { IBaseRepository } from "../../domain/interfaces/base.repository";
import { IEventBus } from "../../domain/interfaces/eventbus.interface"
import { TYPES } from "../../di/types";
import { AppError } from "../error/appError";

interface ProcessTransactionInput {
    id: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    type: TransactionType;
    status: StatusTransaction;
    dueDate?: Date;
    createdAt: Date;
}

@injectable()
export class ProcessTransactionUseCase {
    constructor(
        @inject(TYPES.EventBus)
        private readonly eventBus: IEventBus,
        @inject(TYPES.AccountRepository)
        private readonly accountRepository: IBaseRepository<Account>,
        @inject(TYPES.TransactionRepository)
        private readonly transactionRepository: IBaseRepository<Transaction>
    ) { }

    public async execute(input: { formattedTransaction: ProcessTransactionInput }) {
        const { formattedTransaction } = input;
        const query = {
            id: [
                formattedTransaction.fromAccountId,
                formattedTransaction.toAccountId
            ]
        };

        const accounts = await this.accountRepository.findMany(query);

        const [fromAccount, toAccount] = [
            accounts.find(acc => acc.id === formattedTransaction.fromAccountId),
            accounts.find(acc => acc.id === formattedTransaction.toAccountId)
        ];

        const transaction = new Transaction({ ...formattedTransaction });

        if (!fromAccount || !toAccount) {
            if (!fromAccount) throw AppError.notFound(`fromAccount not found`);

            transaction.setStatus(StatusTransaction.FAILED);
            fromAccount.addTransaction(transaction);
            await this.accountRepository.update(fromAccount.id, fromAccount);
            throw AppError.notFound(`toAccount not found`);
        }

        try {
            fromAccount.validateAccountStatus();
            toAccount.validateAccountStatus();
        } catch {
            transaction.setStatus(StatusTransaction.FAILED);
            fromAccount.addTransaction(transaction);
            toAccount.addTransaction(transaction);

            await Promise.all([
                this.transactionRepository.update(transaction.id, transaction),
                this.accountRepository.update(fromAccount.id, fromAccount),
                this.accountRepository.update(toAccount.id, toAccount),
            ]);

            throw AppError.badRequest(`Invalid account(s)`);
        }

        if (transaction.isExpired()) {
            transaction.setStatus(StatusTransaction.FAILED);
            fromAccount.addTransaction(transaction);
            toAccount.addTransaction(transaction);

            await Promise.all([
                this.accountRepository.update(fromAccount.id, fromAccount),
                this.accountRepository.update(toAccount.id, toAccount),
                this.transactionRepository.update(transaction.id, transaction),
            ]);

            throw AppError.badRequest('Transaction expired');
        }

        if (!fromAccount.canWithDraw(formattedTransaction.amount)) {
            transaction.setStatus(StatusTransaction.FAILED);
            fromAccount.addTransaction(transaction);
            await Promise.all([
                this.transactionRepository.update(transaction.id, transaction),
                this.accountRepository.update(fromAccount.id, fromAccount),
            ]);
            throw AppError.badRequest(`Insufficient funds in fromAccount`);
        }

        fromAccount.withdraw(transaction.amount);
        toAccount.deposit(transaction.amount);
        transaction.setStatus(StatusTransaction.COMPLETED);
        await this.transactionRepository.update(transaction.id, transaction);
        fromAccount.addTransaction(transaction);
        transaction.setType(TransactionType.DEPOSIT);
        toAccount.addTransaction(transaction)

        await Promise.all([
            this.accountRepository.update(fromAccount.id, fromAccount),
            this.accountRepository.update(toAccount.id, toAccount)
        ])

        await this.eventBus.emit('transaction.completed', {
            status: 'completed',
            transaction: transaction.toPlain(),
        });

        return { success: true };
    }

}
