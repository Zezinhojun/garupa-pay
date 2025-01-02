import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { StatusTransaction, Transaction, TransactionType } from "../../domain/entities/transaction.entity";
import { IEventBus } from "../../domain/interfaces/eventbus.interface";
import { TransactionRepository } from "../../infrastructure/database/repositories/transaction.repository";

export enum ErrorCode {
    SUCCESS = 200,
    INVALID_DATA = 400,
    ACCOUNT_NOT_FOUND = 404,
    INSUFFICIENT_BALANCE = 406,
    UNEXPECTED_ERROR = 500,
}

export interface CreateTransactionDTO {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    type: TransactionType;
    dueDate?: Date;
}

export interface CreateTransactionResponseDTO {
    success: boolean;
    data?: {
        id?: string;
        fromAccountId: string;
        toAccountId: string;
        amount: number;
        type: TransactionType;
        status: StatusTransaction;
        dueDate?: Date | null;
        createdAt?: Date;
        updatedAt?: Date;
    };
    errorMessage?: string;
}

@injectable()
export class CreateTransactionUseCase {
    constructor(
        @inject(TYPES.EventBus)
        private readonly eventBus: IEventBus,
        @inject(TYPES.TransactionRepository)
        private readonly transactionRepository: TransactionRepository

    ) { }

    async execute(input: CreateTransactionDTO): Promise<CreateTransactionResponseDTO> {
        let transaction: Transaction | null = null

        if (!this.isValidTransactionData(input)) {
            throw new Error(`Invalid data: ${ErrorCode.INVALID_DATA}`);
        }

        try {
            transaction = Transaction.createTransaction(
                input.fromAccountId,
                input.toAccountId,
                input.amount,
                input.type,
                input.dueDate
            );

            if (!this.transactionRepository) {
                throw new Error(`Unexpected error: ${ErrorCode.UNEXPECTED_ERROR}`);
            }

            const savedTransaction = await this.transactionRepository.create(transaction);
            const formattedTransaction = await this.formatTrasanction(savedTransaction)

            await this.eventBus.emit('transaction.created', {
                formattedTransaction
            });

            return { success: true, data: formattedTransaction };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new Error(`Unexpected error: ${ErrorCode.UNEXPECTED_ERROR}`);
        }

    }

    private async formatTrasanction(transaction: Transaction) {
        return {
            transactionId: transaction.id,
            fromAccountId: transaction.fromAccountId,
            toAccountId: transaction.toAccountId,
            amount: transaction.amount,
            type: transaction.type,
            status: transaction.status,
            dueDate: transaction.dueDate,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt
        }
    }

    private isValidTransactionData(input: CreateTransactionDTO): boolean {
        if (!input.fromAccountId || !input.toAccountId || input.amount <= 0 || !input.type) {
            return false;
        }
        return true;
    }
}
