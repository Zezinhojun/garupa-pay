import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AccountORM } from "./account.orm.entity";
import { StatusTransaction, TransactionType } from "../../../../../domain/entities/transaction.entity";

@Entity('transactions')
export class TransactionORM {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    fromAccountId!: string;

    @ManyToOne(() => AccountORM, account => account.sentTransactions)
    fromAccount!: AccountORM;

    @Column({ type: 'uuid' })
    toAccountId!: string;

    @ManyToOne(() => AccountORM, account => account.receivedTransactions)
    toAccount!: AccountORM;

    @Column('decimal', { precision: 10, scale: 2 })
    amount!: number;

    @Column('enum', { enum: StatusTransaction, default: StatusTransaction.PENDING })
    status!: StatusTransaction;

    @Column('timestamp', { nullable: true })
    dueDate!: Date;

    @Column('enum', { enum: TransactionType })
    type!: TransactionType;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}