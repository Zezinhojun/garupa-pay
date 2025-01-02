import { Account } from "../../../src/domain/entities/account.entity"
import { StatusTransaction, Transaction, TransactionType } from "../../../src/domain/entities/transaction.entity";

describe('Account entity', () => {
    let account: Account;

    beforeEach(() => {
        account = new Account({
            userCpf: '12345678901',
            name: 'John Doe',
            balance: 1000
        });
    })
    describe('Constructor', () => {
        it('should create account with valid parameters', () => {
            expect(account.userCpf).toBe('12345678901');
            expect(account.name).toBe('John Doe');
            expect(account.balance).toBe(1000);
            expect(account.isActive).toBe(true);
            expect(account.transactions).toEqual([]);
        });

        it('should trim name on creation', () => {
            expect(account.name).toBe('John Doe');
        });

        it('should throw error for invalid CPF', () => {
            expect(() => new Account({
                userCpf: '123',
                name: 'John Doe',
                balance: 1000
            })).toThrow('Invalid CPF');
            expect(() => new Account({
                userCpf: '1234567890',
                name: 'John Doe',
                balance: 1000
            })).toThrow('Invalid CPF');
            expect(() => new Account({
                userCpf: '123456789012',
                name: 'John Doe',
                balance: 1000
            })).toThrow('Invalid CPF');
            expect(() => new Account({
                userCpf: 'abcdefghijk',
                name: 'John Doe',
                balance: 1000
            })).toThrow('Invalid CPF');
        });

        it('should format initial balance', () => {
            const account = new Account({
                userCpf: '12345678901',
                name: 'John Doe',
                balance: 1000.999
            });
            expect(account.balance).toBe(1000.99);
        });
    });

    describe('Static create method', () => {
        it('should create account with valid parameters', () => {
            const account = Account.create('12345678901', 'John Doe', 1000);
            expect(account).toBeInstanceOf(Account);
            expect(account.balance).toBe(1000);
        });

        it('should throw error for negative initial balance', () => {
            expect(() => Account.create('12345678901', 'John Doe', -100))
                .toThrow('Initial balance cannot be negative');
        });
    });

    describe('Deposit', () => {
        it('should add amount to balance', () => {
            account.deposit(500);
            expect(account.balance).toBe(1500);
        });

        it('should format deposited amount', () => {
            account.deposit(500.999);
            expect(account.balance).toBe(1500.99);
        });

        it('should throw error for non-positive amounts', () => {
            expect(() => account.deposit(0)).toThrow('Deposit amount must be greater than zero');
            expect(() => account.deposit(-100)).toThrow('Deposit amount must be greater than zero');
        });
    });

    describe('Withdraw', () => {
        it('should subtract amount from balance', () => {
            account.withdraw(500);
            expect(account.balance).toBe(500);
        });

        it('should format withdrawn amount', () => {
            account.withdraw(500.999);
            expect(account.balance).toBe(499.01);
        });

        it('should throw error for insufficient balance', () => {
            expect(() => account.withdraw(1500)).toThrow('Insufficient balance');
        });

        it('should throw error for non-positive amounts', () => {
            expect(() => account.withdraw(0)).toThrow('Withdraw amount must be greater than zero');
            expect(() => account.withdraw(-100)).toThrow('Withdraw amount must be greater than zero');
        });
    });

    describe('Account Status', () => {
        it('should validate active account status', () => {
            expect(() => account.validateAccountStatus()).not.toThrow();
        });

        it('should throw error for inactive account', () => {
            account.deactivateAccount();
            expect(() => account.validateAccountStatus()).toThrow('Account is inactive');
        });

        it('should deactivate account', () => {
            account.deactivateAccount();
            expect(account.isActive).toBe(false);
        });

        it('should activate account', () => {
            account.deactivateAccount();
            account.activateAccount();
            expect(account.isActive).toBe(true);
        });
    });

    describe('Can Withdraw', () => {
        it('should return true for valid amount', () => {
            expect(account.canWithDraw(500)).toBe(true);
        });

        it('should return false for insufficient balance', () => {
            expect(account.canWithDraw(1500)).toBe(false);
        });

        it('should throw error for non-positive amounts', () => {
            expect(() => account.canWithDraw(0)).toThrow('Amount must be greater than zero');
            expect(() => account.canWithDraw(-100)).toThrow('Amount must be greater than zero');
        });
    });

    describe('Transactions', () => {
        let transaction: Transaction;

        beforeEach(() => {
            transaction = new Transaction({
                fromAccountId: '12345678901',
                toAccountId: '98765432101',
                amount: 500,
                type: TransactionType.WITHDRAW,
                status: StatusTransaction.COMPLETED,

            });
        });

        it('should add valid transaction', () => {
            account.addTransaction(transaction);
            expect(account.transactions).toHaveLength(1);
            expect(account.transactions[0]).toBe(transaction);
        });

        it('should throw error for null transaction', () => {
            expect(() => account.addTransaction(null!)).toThrow('Invalid transaction');
        });

        it('should throw error for undefined transaction', () => {
            expect(() => account.addTransaction(undefined!)).toThrow('Invalid transaction');
        });

        it('should return copy of transactions array', () => {
            account.addTransaction(transaction);
            const transactions = account.transactions;
            transactions.pop();
            expect(account.transactions).toHaveLength(1);
        });
    });

    describe('Getters', () => {
        it('should return correct user CPF', () => {
            expect(account.userCpf).toBe('12345678901');
        });

        it('should return correct name', () => {
            expect(account.name).toBe('John Doe');
        });

        it('should return correct balance', () => {
            expect(account.balance).toBe(1000);
        });

        it('should return correct active status', () => {
            const account = new Account({
                userCpf: '12345678901',
                name: 'John Doe',
                balance: 1000,
                isActive: false
            });
            expect(account.isActive).toBe(false);
        });
    });

    describe('toPlain', () => {
        it('should return plain object with correct properties', () => {
            const plainAccount = account.toPlain();

            expect(plainAccount).toEqual({
                id: account.id,
                userCpf: '12345678901',
                name: 'John Doe',
                balance: 1000,
                isActive: true,
                createdAt: account.createdAt,
                updatedAt: account.updatedAt
            });
        });

        it('should handle missing optional properties', () => {
            const plainAccount = account.toPlain();

            expect(plainAccount.id).toBeUndefined();
        });
    });
})