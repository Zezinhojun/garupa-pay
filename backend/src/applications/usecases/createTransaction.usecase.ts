import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { StatusTransaction, Transaction, TransactionType } from "../../domain/entities/transaction.entity";
import { IEventBus } from "../../domain/interfaces/eventbus.interface";
import { TransactionRepository } from "../../infrastructure/database/repositories/transaction.repository";
import { AppError } from "../error/appError";
import { isUUID } from "validator";

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
        if (!this.isValidTransactionData(input)) throw AppError.badRequest(`Invalid data`);

        this.validateUUIDs(input);

        const transaction = Transaction.createTransaction(
            input.fromAccountId,
            input.toAccountId,
            input.amount,
            input.type,
            input.dueDate
        );

        if (!this.transactionRepository) throw AppError.internalServerError('Transaction repository not available');

        const savedTransaction = await this.transactionRepository.create(transaction);
        const formattedTransaction = await this.formatTrasanction(savedTransaction)

        await this.eventBus.emit('transaction.created', {
            formattedTransaction
        });

        return { success: true, data: formattedTransaction };
    }

    private async formatTrasanction(transaction: Transaction) {
        return {
            id: transaction.id,
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

    private validateUUIDs(input: CreateTransactionDTO): void {
        if (!isUUID(input.fromAccountId)) throw AppError.badRequest("fromAccountId must be a valid UUID");
        if (!isUUID(input.toAccountId)) throw AppError.badRequest("toAccountId must be a valid UUID");
    }
}
