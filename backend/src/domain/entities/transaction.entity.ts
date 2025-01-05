export enum StatusTransaction {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}
export enum TransactionType {
    WITHDRAW = "WITHDRAW",
    DEPOSIT = "DEPOSIT",
}

export interface ITransaction {
    id: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    dueDate?: Date;
    status: StatusTransaction
    type: TransactionType;
    createdAt?: Date;
    updatedAt?: Date;
}

interface TransactionConstructor {
    id?: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    type: TransactionType;
    status?: StatusTransaction;
    dueDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Transaction implements ITransaction {
    private readonly _fromAccountId: string;
    private readonly _toAccountId: string;
    private readonly _amount: number
    private _type: TransactionType;
    private readonly _dueDate?: Date;
    private _status: StatusTransaction;
    private readonly _createdAt?: Date;
    private readonly _updatedAt?: Date;
    private readonly _id?: string;

    constructor({
        fromAccountId,
        toAccountId,
        amount,
        id,
        type = TransactionType.WITHDRAW,
        status = StatusTransaction.PENDING,
        dueDate,
        createdAt,
        updatedAt
    }: TransactionConstructor) {

        if (amount <= 0) {
            throw new Error('Amount must be greater than zero');
        }

        this._fromAccountId = fromAccountId;
        this._toAccountId = toAccountId;
        this._amount = this.formatAmount(amount);
        this._type = type;
        this._id = id;
        this._dueDate = dueDate;
        this._status = status;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get id(): string { return this._id!; }
    get fromAccountId(): string { return this._fromAccountId; }
    get toAccountId(): string { return this._toAccountId; }
    get amount(): number { return this._amount; }
    get type(): TransactionType { return this._type; }
    get dueDate(): Date | undefined { return this._dueDate; }
    get status(): StatusTransaction { return this._status; }
    get createdAt(): Date | undefined { return this._createdAt; }
    get updatedAt(): Date | undefined { return this._updatedAt; }

    isExpired(): boolean {
        if (this._dueDate) {
            const dueDate = new Date(this._dueDate);
            if (isNaN(dueDate.getTime())) {
                throw new Error('Invalid dueDate format');
            }

            const currentDate = new Date();
            dueDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);

            return dueDate < currentDate;
        }
        return false;
    }

    setStatus(status: StatusTransaction) {
        this._status = status;
    }

    setType(type: TransactionType): void {
        if (type !== 'DEPOSIT' && type !== 'WITHDRAW') {
            throw new Error('Invalid transaction type');
        }
        this._type = type;
    }

    static createTransaction(
        fromAccountId: string,
        toAccountId: string,
        amount: number,
        type: TransactionType,
        dueDate?: Date
    ): Transaction {
        return new Transaction({
            fromAccountId,
            toAccountId,
            amount,
            type,
            dueDate,
        })
    }

    private formatAmount(amount: number): number {
        return Math.round(amount * 100) / 100;
    }

    toPlain() {
        return {
            id: this._id,
            fromAccountId: this._fromAccountId,
            toAccountId: this._toAccountId,
            amount: this._amount,
            status: this._status,
            dueDate: this._dueDate,
            type: this._type,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        }
    }

}

