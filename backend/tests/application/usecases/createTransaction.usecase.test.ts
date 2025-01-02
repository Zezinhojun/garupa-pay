import { CreateTransactionUseCase, CreateTransactionDTO, CreateTransactionResponseDTO, ErrorCode } from "../../../src/applications/usecases/createTransaction.usecase";
import { StatusTransaction, Transaction, TransactionType } from "../../../src/domain/entities/transaction.entity";
import { TransactionRepository } from "../../../src/infrastructure/database/repositories/transaction.repository";
import { cacheRepositoryMock, eventBusMock, mockMapper, mockOrmClient } from "../../utils/Mocks";

describe('CreateTransaction usecase', () => {
    let sut: CreateTransactionUseCase;
    let transactionRepositoryMock: TransactionRepository;

    beforeEach(() => {
        transactionRepositoryMock = new TransactionRepository(mockOrmClient, mockMapper, cacheRepositoryMock);
        transactionRepositoryMock.create = jest.fn()
        sut = new CreateTransactionUseCase(eventBusMock, transactionRepositoryMock);
    });

    it('should successfully create a transaction', async () => {
        const input: CreateTransactionDTO = {
            fromAccountId: '123',
            toAccountId: '456',
            amount: 100,
            type: TransactionType.DEPOSIT,
        };

        const mockTransaction = {
            id: 'tx123',
            fromAccountId: input.fromAccountId,
            toAccountId: input.toAccountId,
            amount: input.amount,
            type: input.type,
            status: StatusTransaction.PENDING,
            dueDate: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        transactionRepositoryMock.create = jest.fn().mockResolvedValue(mockTransaction);

        const result: CreateTransactionResponseDTO = await sut.execute(input);

        expect(result.success).toBe(true);
        expect(result.data).toEqual({
            transactionId: 'tx123',
            fromAccountId: '123',
            toAccountId: '456',
            amount: 100,
            type: TransactionType.DEPOSIT,
            status: StatusTransaction.PENDING,
            dueDate: null,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });

        expect(eventBusMock.emit).toHaveBeenCalledWith('transaction.created', {
            formattedTransaction: expect.any(Object),
        });
    });

    it('should throw error when invalid data is provided', async () => {
        const input: CreateTransactionDTO = {
            fromAccountId: '',
            toAccountId: '456',
            amount: 0,
            type: TransactionType.DEPOSIT,
        };

        await expect(sut.execute(input)).rejects
            .toThrow(`Invalid data: ${ErrorCode.INVALID_DATA}`);
    });

    it('should handle unexpected errors gracefully', async () => {
        const input: CreateTransactionDTO = {
            fromAccountId: '123',
            toAccountId: '456',
            amount: 100,
            type: TransactionType.DEPOSIT,
        };

        transactionRepositoryMock.create = jest.fn().mockRejectedValue(new Error('Unexpected error'));

        await expect(sut.execute(input)).rejects.toThrow(`${ErrorCode.UNEXPECTED_ERROR}`);
    });

    it("should emit event when transaction is successfully created", async () => {
        const input: CreateTransactionDTO = {
            fromAccountId: "account1",
            toAccountId: "account2",
            amount: 100,
            type: TransactionType.DEPOSIT,
        };

        const mockTransaction = new Transaction({
            fromAccountId: input.fromAccountId,
            toAccountId: input.toAccountId,
            amount: input.amount,
            type: input.type,
            status: StatusTransaction.PENDING,
            dueDate: input.dueDate,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        (transactionRepositoryMock.create as jest.Mock).mockResolvedValue(mockTransaction);

        const result = await sut.execute(input);

        expect(result.success).toBe(true);
        expect(eventBusMock.emit).toHaveBeenCalledWith("transaction.created", expect.objectContaining({
            formattedTransaction: expect.objectContaining({
                transactionId: mockTransaction.id,
                fromAccountId: mockTransaction.fromAccountId,
                toAccountId: mockTransaction.toAccountId,
                amount: mockTransaction.amount,
                type: mockTransaction.type,
                status: mockTransaction.status,
            })
        }));
    });


})