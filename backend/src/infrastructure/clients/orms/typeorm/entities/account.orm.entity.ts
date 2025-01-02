import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TransactionORM } from "./transaction.orm.entity";

@Entity('accounts')
export class AccountORM {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'varchar', length: 11, unique: true })
    userCpf!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    balance!: number;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @OneToMany(() => TransactionORM, transaction => transaction.fromAccount)
    sentTransactions!: TransactionORM[];

    @OneToMany(() => TransactionORM, transaction => transaction.toAccount)
    receivedTransactions!: TransactionORM[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;


}