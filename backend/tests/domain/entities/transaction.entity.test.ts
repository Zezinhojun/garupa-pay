import { StatusTransaction, Transaction, TransactionType } from "../../../src/domain/entities/transaction.entity";

describe('Transaction entity', () => {
    let transaction: Transaction
    beforeEach(() => {
        transaction = new Transaction({
            fromAccountId: 'from123',
            toAccountId: 'to456',
            amount: 100,
            type: TransactionType.WITHDRAW
        });
    })
    describe('Constructor', () => {
        it('should create transaction with minimum required parameters', () => {
            expect(transaction.fromAccountId).toBe('from123');
            expect(transaction.toAccountId).toBe('to456');
            expect(transaction.amount).toBe(100);
            expect(transaction.type).toBe(TransactionType.WITHDRAW);
            expect(transaction.status).toBe('PENDING');
        });

        it('should create transaction with all parameters', () => {
            const dueDate = new Date('2024-12-31');
            const transaction = new Transaction({
                fromAccountId: 'from123',
                toAccountId: 'to456',
                amount: 100,
                type: TransactionType.DEPOSIT,
                status: StatusTransaction.COMPLETED,
                dueDate,
            });

            expect(transaction.status).toBe(StatusTransaction.COMPLETED);
            expect(transaction.dueDate).toBe(dueDate);
        });

        it('should throw error for non-positive amount', () => {
            expect(() => new Transaction({
                fromAccountId: 'from123',
                toAccountId: 'to456',
                amount: 0,
                type: TransactionType.WITHDRAW
            })).toThrow('Amount must be greater than zero');

            expect(() => new Transaction({
                fromAccountId: 'from123',
                toAccountId: 'to456',
                amount: -100,
                type: TransactionType.WITHDRAW
            })).toThrow('Amount must be greater than zero');
        });

        it('should format amount to two decimal places', () => {
            const transaction = new Transaction({
                fromAccountId: 'from123',
                toAccountId: 'to456',
                amount: 100.999,
                type: TransactionType.WITHDRAW
            });

            expect(transaction.amount).toBe(101.00);
        });
    });

    describe('Static createTransaction method', () => {
        it('should create a new transaction with valid parameters', () => {
            const dueDate = new Date();
            const transaction = Transaction.createTransaction(
                'from123',
                'to456',
                100,
                TransactionType.WITHDRAW,
                dueDate
            );

            expect(transaction).toBeInstanceOf(Transaction);
            expect(transaction.fromAccountId).toBe('from123');
            expect(transaction.toAccountId).toBe('to456');
            expect(transaction.amount).toBe(100);
            expect(transaction.type).toBe(TransactionType.WITHDRAW);
            expect(transaction.dueDate).toBe(dueDate);
            expect(transaction.status).toBe('PENDING');
        });
    });

    describe('isExpired method', () => {
        it('should return true for past due date', () => {
            const transaction = new Transaction({
                fromAccountId: 'from123',
                toAccountId: 'to456',
                amount: 100,
                type: TransactionType.WITHDRAW,
                dueDate: new Date('2023-01-01')
            });

            expect(transaction.isExpired()).toBe(true);
        })

        it('should return false when no due date is set', () => {
            const transaction = new Transaction({
                fromAccountId: 'from123',
                toAccountId: 'to456',
                amount: 100,
                type: TransactionType.WITHDRAW
            });

            expect(transaction.isExpired()).toBe(false);
        });
    });

    describe('setStatus method', () => {
        it('should update status', () => {
            transaction.setStatus(StatusTransaction.COMPLETED);
            expect(transaction.status).toBe(StatusTransaction.COMPLETED);

            transaction.setStatus(StatusTransaction.FAILED);
            expect(transaction.status).toBe(StatusTransaction.FAILED);
        });
    });

    describe('setType method', () => {
        it('should update type', () => {
            transaction.setType(TransactionType.DEPOSIT);
            expect(transaction.type).toBe(TransactionType.DEPOSIT);
        });

        it('should throw error for invalid type', () => {
            expect(() => transaction.setType('INVALID' as TransactionType))
                .toThrow('Invalid transaction type');
        });

    });

    describe('Getters', () => {
        const transaction = new Transaction({
            fromAccountId: 'from123',
            toAccountId: 'to456',
            amount: 100,
            type: TransactionType.WITHDRAW,
            status: StatusTransaction.PENDING,
            dueDate: new Date('2024-12-31'),
        });

        it('should return correct fromAccountId', () => {
            expect(transaction.fromAccountId).toBe('from123');
        });

        it('should return correct toAccountId', () => {
            expect(transaction.toAccountId).toBe('to456');
        });

        it('should return correct amount', () => {
            expect(transaction.amount).toBe(100);
        });

        it('should return correct type', () => {
            expect(transaction.type).toBe(TransactionType.WITHDRAW);
        });

        it('should return correct status', () => {
            expect(transaction.status).toBe('PENDING');
        });

        it('should return correct dueDate', () => {
            expect(transaction.dueDate).toBeInstanceOf(Date);
            expect(transaction.dueDate?.toISOString()).toBe(new Date('2024-12-31').toISOString());
        });
    });

    describe('toPlain', () => {
        it('should return plain object with correct properties', () => {
            const plainAccount = transaction.toPlain();

            expect(plainAccount).toEqual({
                id: transaction.id,
                fromAccountId: 'from123',
                toAccountId: 'to456',
                amount: 100,
                status: StatusTransaction.PENDING,
                dueDate: transaction.dueDate,
                type: TransactionType.WITHDRAW,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt
            });
        });

        it('should handle missing optional properties', () => {
            const plainAccount = transaction.toPlain();

            expect(plainAccount.id).toBeUndefined();
            expect(plainAccount.createdAt).toBeUndefined();
            expect(plainAccount.updatedAt).toBeUndefined();
        });
    });
})