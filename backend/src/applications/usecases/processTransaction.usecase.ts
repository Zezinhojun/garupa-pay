import { inject, injectable } from "inversify";
import { Account } from "../../domain/entities/account.entity";
import { StatusTransaction, Transaction, TransactionType } from "../../domain/entities/transaction.entity"
import { IBaseRepository } from "../../domain/interfaces/base.repository";
import { IEventBus } from "../../domain/interfaces/eventbus.interface"
import { TYPES } from "../../di/types";

interface ProcessTransactionInput {
    transactionId: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    type: TransactionType;
    status: StatusTransaction;
    dueDate?: Date;
    createdAt: Date;
}

export enum ErrorCode {
    SUCCESS = 200,
    INVALID_DATA = 400,
    ACCOUNT_NOT_FOUND = 404,
    INSUFFICIENT_BALANCE = 406,
    UNEXPECTED_ERROR = 500,
}

@injectable()
export class ProcessTransactionUseCase {
    constructor(
        @inject(TYPES.EventBus)
        private readonly eventBus: IEventBus,
        @inject(TYPES.AccountRepository)
        private readonly accountRepository: IBaseRepository<Account>,
    ) { }

    public async execute(input: { formattedTransaction: ProcessTransactionInput }) {

        const { formattedTransaction } = input;

        try {
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
                if (!fromAccount) {
                    throw new Error(`fromAccount not found: ${ErrorCode.ACCOUNT_NOT_FOUND}`);
                }
                transaction.setStatus(StatusTransaction.FAILED);
                fromAccount.addTransaction(transaction);
                await this.accountRepository.update(fromAccount.id, fromAccount);
                throw new Error(`toAccount not found: ${ErrorCode.ACCOUNT_NOT_FOUND}`);
            }

            fromAccount.validateAccountStatus();
            toAccount.validateAccountStatus();

            if (transaction.isExpired()) {
                transaction.setStatus(StatusTransaction.FAILED);
                fromAccount.addTransaction(transaction);
                toAccount.addTransaction(transaction);
                await Promise.all([
                    this.accountRepository.update(fromAccount.id, fromAccount),
                    this.accountRepository.update(toAccount.id, toAccount),
                ]);
                throw new Error(`transaction expired`);
            }

            fromAccount.canWithDraw(formattedTransaction.amount);
            fromAccount.withdraw(transaction.amount);
            toAccount.deposit(transaction.amount);
            transaction.setStatus(StatusTransaction.COMPLETED);
            fromAccount.addTransaction(transaction);
            transaction.setType(TransactionType.DEPOSIT);

            await Promise.all([
                this.accountRepository.update(fromAccount.id, fromAccount),
                this.accountRepository.update(toAccount.id, toAccount)
            ])

            await this.eventBus.emit('transaction.processed', { status: 'completed' });

            return { success: true };

        } catch (error) {
            if (error instanceof Error && error.message) {
                throw new Error(`${error.message}`);
            }
            throw new Error(`Unexpected error occurred: ${ErrorCode.UNEXPECTED_ERROR}`);
        }
    }

}
