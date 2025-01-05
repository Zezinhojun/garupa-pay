import { ProcessTransactionUseCase } from "../../../src/applications/usecases/processTransaction.usecase";
import { Account } from "../../../src/domain/entities/account.entity";
import { TransactionType, StatusTransaction } from "../../../src/domain/entities/transaction.entity";
import { AccountRepository } from "../../../src/infrastructure/database/repositories/account.repository";
import { cacheRepositoryMock, eventBusMock, mockAccount, mockMapper, mockOrmClient } from "../../utils/Mocks";
import { TransactionRepository } from '../../../src/infrastructure/database/repositories/transaction.repository';

describe('ProcessTransaction usecase', () => {
    let sut: ProcessTransactionUseCase
    let accountRepositoryMock: AccountRepository;
    let transactionRepositoryMock: TransactionRepository

    beforeEach(() => {
        accountRepositoryMock = new AccountRepository(mockOrmClient, mockMapper, cacheRepositoryMock)
        transactionRepositoryMock = new TransactionRepository(mockOrmClient, mockMapper, cacheRepositoryMock)
        sut = new ProcessTransactionUseCase(eventBusMock, accountRepositoryMock, transactionRepositoryMock);

        accountRepositoryMock.update = jest.fn().mockResolvedValue({});
        transactionRepositoryMock.update = jest.fn().mockResolvedValue({});
    })

    it('should successfully process a transaction', async () => {
        const input = {
            formattedTransaction: {
                id: 'tx123',
                fromAccountId: 'acc1',
                toAccountId: 'acc2',
                amount: 100,
                type: TransactionType.DEPOSIT,
                status: StatusTransaction.PENDING,
                createdAt: new Date()
            }
        };

        const fromAccount = new Account({ ...mockAccount, id: 'acc1' });
        const toAccount = new Account({ ...mockAccount, id: 'acc2' });
        accountRepositoryMock.findMany = jest.fn().mockResolvedValue([fromAccount, toAccount]);
        const result = await sut.execute(input);

        expect(result.success).toBe(true);
        expect(eventBusMock.emit).toHaveBeenCalledWith('transaction.completed', {
            status: 'completed',
            transaction: expect.objectContaining({
                id: input.formattedTransaction.id,
                amount: input.formattedTransaction.amount,
                createdAt: input.formattedTransaction.createdAt,
                fromAccountId: input.formattedTransaction.fromAccountId,
                toAccountId: input.formattedTransaction.toAccountId,
                status: StatusTransaction.COMPLETED,
                type: input.formattedTransaction.type,
                updatedAt: undefined,
                dueDate: undefined
            })
        });
    });


    it('should throw when fromAccount not found', async () => {
        const input = {
            formattedTransaction: {
                id: 'tx123',
                fromAccountId: 'acc1',
                toAccountId: 'acc2',
                amount: 100,
                type: TransactionType.DEPOSIT,
                status: StatusTransaction.PENDING,
                createdAt: new Date()
            }
        };
        accountRepositoryMock.findMany = jest.fn().mockResolvedValue([]);

        await expect(sut.execute(input)).rejects
            .toThrow(`fromAccount not found`);
    });

    it('should fail when transaction is expired', async () => {
        const input = {
            formattedTransaction: {
                id: 'tx123',
                fromAccountId: 'acc1',
                toAccountId: 'acc2',
                amount: 100,
                type: TransactionType.DEPOSIT,
                status: StatusTransaction.PENDING,
                dueDate: new Date('2020-01-01'),
                createdAt: new Date()
            }
        };

        const fromAccount = new Account({ ...mockAccount, id: 'acc1' });
        const toAccount = new Account({ ...mockAccount, id: 'acc2' });
        accountRepositoryMock.findMany = jest.fn().mockResolvedValue([fromAccount, toAccount]);

        await expect(sut.execute(input)).rejects
            .toThrow(`Transaction expired`);
    });

    it('should throw when there is insufficient balance', async () => {
        const input = {
            formattedTransaction: {
                id: 'tx123',
                fromAccountId: 'acc1',
                toAccountId: 'acc2',
                amount: 1000,
                type: TransactionType.DEPOSIT,
                status: StatusTransaction.PENDING,
                createdAt: new Date()
            }
        };

        const fromAccount = new Account({ ...mockAccount, id: 'acc1', balance: 500 });
        const toAccount = new Account({ ...mockAccount, id: 'acc2' });
        accountRepositoryMock.findMany = jest.fn().mockResolvedValue([fromAccount, toAccount]);

        await expect(sut.execute(input)).rejects
            .toThrow(`Insufficient funds in fromAccount`);
    });

    it('should throw when toAccount is not found but fromAccount is found and save the transaction as FAILED', async () => {
        const input = {
            formattedTransaction: {
                id: 'tx123',
                fromAccountId: 'acc1',
                toAccountId: 'acc2',
                amount: 100,
                type: TransactionType.DEPOSIT,
                status: StatusTransaction.PENDING,
                createdAt: new Date()
            }
        };

        const fromAccount = new Account({ ...mockAccount, id: 'acc1' });
        accountRepositoryMock.findMany = jest.fn().mockResolvedValue([fromAccount]);
        accountRepositoryMock.update = jest.fn().mockResolvedValue(undefined);

        await expect(sut.execute(input)).rejects.toThrow(`toAccount not found`);
        expect(fromAccount.transactions[0].status).toBe(StatusTransaction.FAILED);
        expect(accountRepositoryMock.update).toHaveBeenCalledWith(fromAccount.id, fromAccount);
    });
})  