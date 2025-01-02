import { Account } from "../../../../src/domain/entities/account.entity";
import { StatusTransaction, Transaction, TransactionType } from "../../../../src/domain/entities/transaction.entity";
import { AccountRepository } from "../../../../src/infrastructure/database/repositories/account.repository"
import { mockOrmClient, mockMapper, cacheRepositoryMock } from "../../../utils/Mocks";

describe('AccountRepository', () => {
    let repository: AccountRepository;

    const mockTransaction = new Transaction({
        id: '1',
        fromAccountId: '1',
        toAccountId: '2',
        amount: 100,
        type: TransactionType.WITHDRAW,
        status: StatusTransaction.COMPLETED
    });

    const mockAccount = new Account({
        id: '1',
        userCpf: '12345678901',
        name: 'John Doe',
        balance: 1000,
        isActive: true
    });

    beforeEach(() => {
        repository = new AccountRepository(mockOrmClient, mockMapper, cacheRepositoryMock);
    })

    it('should fetch accounts with transactions', async () => {
        const mockOrmResponse = {
            ...mockAccount,
            sentTransactions: [mockTransaction],
            receivedTransactions: []
        };

        (mockOrmClient.find as jest.Mock).mockReturnValue([mockOrmResponse]);
        mockMapper.toDomain.mockReturnValue(mockAccount);
        const result = await repository.findAll();

        expect(mockOrmClient.find).toHaveBeenCalledWith(
            {},
            ['sentTransactions', 'receivedTransactions']
        );

        expect(result).toHaveLength(1);
        expect(mockMapper.toDomain).toHaveBeenCalledWith(mockOrmResponse);
    });

    it('should handle empty account list', async () => {
        (mockOrmClient.find as jest.Mock).mockReturnValue([]);
        const result = await repository.findAll();
        expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
        (mockOrmClient.find as jest.Mock).mockRejectedValue(new Error('Database connection failed'));
        await expect(repository.findAll()).rejects.toThrow('Database connection failed');
    });

    it('should handle accounts with both sent and received transactions', async () => {
        const mockOrmResponse = {
            ...mockAccount,
            sentTransactions: [mockTransaction],
            receivedTransactions: [{ ...mockTransaction, id: '2' }]
        };

        (mockOrmClient.find as jest.Mock).mockReturnValue([mockOrmResponse]);
        const accountWithTransactions = { ...mockAccount, transactions: [mockTransaction, { ...mockTransaction, id: '2' }] };
        mockMapper.toDomain.mockReturnValue(accountWithTransactions);

        const result = await repository.findAll();

        expect(result[0].transactions).toHaveLength(2);
        expect(mockMapper.toDomain).toHaveBeenCalledWith(mockOrmResponse);
    });

})