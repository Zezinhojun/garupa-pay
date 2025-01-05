import { AppError } from "../../applications/error/appError";
import { Transaction } from "./transaction.entity";

export interface IAccount {
    id?: string;
    name: string;
    userCpf: string;
    balance: number;
    isActive: boolean;
    transactions: Transaction[];
}

interface AccountConstructor {
    userCpf: string;
    name: string;
    balance: number;
    isActive?: boolean;
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Account implements IAccount {
    private readonly _userCpf: string;
    private readonly _name: string;
    private _balance: number;
    private _isActive: boolean;
    private readonly _id?: string;
    private readonly _transactions: Transaction[] = [];
    private readonly _createdAt?: Date;
    private readonly _updatedAt?: Date;

    constructor({
        userCpf,
        name,
        balance,
        isActive = true,
        id,
        createdAt,
        updatedAt
    }: AccountConstructor) {
        if (!this.isValidCpf(userCpf)) {
            throw new Error('Invalid CPF');
        }

        this._userCpf = userCpf;
        this._name = name.trim();
        this._balance = this.formatAmount(balance);
        this._isActive = isActive;
        this._id = id;
        this._transactions = [];
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get id(): string { return this._id!; }
    get userCpf() { return this._userCpf; }
    get name(): string { return this._name; }
    get balance(): number { return this._balance; }
    get isActive(): boolean { return this._isActive; }
    get transactions(): Transaction[] { return [...this._transactions]; }
    get createdAt(): Date | undefined { return this._createdAt; }
    get updatedAt(): Date | undefined { return this._updatedAt; }

    deposit(amount: number): void {
        if (amount <= 0) {
            throw AppError.badRequest('Deposit amount must be greater than zero');
        }

        this._balance += this.formatAmount(amount);
    }

    withdraw(amount: number): void {
        if (amount <= 0) {
            throw AppError.badRequest('Withdraw amount must be greater than zero');
        }

        const formatedAmount = this.formatAmount(amount)

        if (this._balance < formatedAmount) {
            throw AppError.badRequest('Insufficient balance');
        }

        this._balance -= formatedAmount;
    }

    validateAccountStatus(): void {
        if (!this._isActive) {
            throw AppError.badRequest('Account is inactive');
        }
    }

    activateAccount() {
        this._isActive = true
    }

    deactivateAccount(): void {
        this._isActive = false;
    }

    static create(userCpf: string, name: string, initialBalance: number): Account {
        if (initialBalance < 0) {
            throw AppError.badRequest('Initial balance cannot be negative');
        }
        return new Account({ userCpf, name, balance: initialBalance });
    }

    private isValidCpf(cpf: string): boolean {
        const regex = /^\d{11}$/;
        if (!regex.test(cpf)) {
            throw AppError.badRequest('Invalid CPF format');
        }
        return true;
    }

    private formatAmount(amount: number): number {
        if (amount < 0) {
            throw AppError.badRequest('Amount cannot be negative');
        }
        return Math.floor(amount * 100) / 100;
    }

    canWithDraw(amount: number): boolean {
        if (amount <= 0) {
            throw AppError.badRequest('Amount must be greater than zero');
        }
        return this._balance >= amount;
    }

    addTransaction(transaction: Transaction): void {
        if (!transaction) {
            throw AppError.badRequest('Invalid transaction');
        }
        this._transactions.push(transaction);
    }

    toPlain() {
        return {
            id: this._id,
            userCpf: this._userCpf,
            name: this._name,
            balance: this._balance,
            isActive: this._isActive,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
            transactions: this._transactions.map(transaction => transaction.toPlain()),
        }
    }
}