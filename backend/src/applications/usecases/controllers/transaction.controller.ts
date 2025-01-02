import { inject, injectable } from "inversify";
import { Transaction, TransactionType } from "../../../domain/entities/transaction.entity";
import { IEventBus } from "../../../domain/interfaces/eventbus.interface";
import { TransactionRepository } from "../../../infrastructure/database/repositories/transaction.repository";
import { CreateTransactionUseCase } from "../createTransaction.usecase";
import { BaseController } from "./base.controller";
import { TYPES } from "../../../di/types";

interface CreateTransactionDTO {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    type: TransactionType;
    dueDate?: Date;
}

@injectable()
export class TransactionController extends BaseController<Transaction> {
    private readonly createTransactionUseCase: CreateTransactionUseCase;
    constructor(
        @inject(TYPES.TransactionRepository)
        protected readonly transactionRepository: TransactionRepository,
        @inject(TYPES.EventBus)
        private readonly eventBus: IEventBus,
        @inject(TYPES.CreateTransactionUseCase)
        createTransactionUseCase: CreateTransactionUseCase
    ) {
        super(transactionRepository);
        this.createTransactionUseCase = createTransactionUseCase;

    }

    async create(req: any, res: any) {
        const { fromAccountId, toAccountId, amount, dueDate } = req.body;
        const createTransactionDTO: CreateTransactionDTO = {
            fromAccountId,
            toAccountId,
            amount,
            type: TransactionType.WITHDRAW,
            dueDate
        }

        try {
            const result = await this.createTransactionUseCase.execute(createTransactionDTO);
            if (result.success) {
                return res.status(201).json(result.data);
            } else {
                return res.status(400).json({ error: result.errorMessage ?? 'Failed to create transaction' });
            }
        } catch (error) {
            const errorMessage = (error as Error).message;
            return res.status(500).json({ error: errorMessage });
        }
    }
}