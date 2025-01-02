import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitialMigration1735584303465 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "accounts",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255"
                    },
                    {
                        name: "userCpf",
                        type: "varchar",
                        length: "11",
                        isUnique: true
                    },
                    {
                        name: "balance",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        default: 0
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    }
                ]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "transactions",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid"
                    },
                    {
                        name: "fromAccountId",
                        type: "uuid",
                    },
                    {
                        name: "toAccountId",
                        type: "uuid",
                    },
                    {
                        name: "amount",
                        type: "decimal",
                        precision: 10,
                        scale: 2
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["PENDING", "COMPLETED", "FAILED", "CANCELLED"]
                    },
                    {
                        name: "dueDate",
                        type: "timestamp",
                        isNullable: true
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "type",
                        type: "enum",
                        enum: ["WITHDRAW", "DEPOSIT"],
                        default: "'WITHDRAW'"
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["fromAccountId"],
                        referencedTableName: "accounts",
                        referencedColumnNames: ["id"]
                    },
                    {
                        columnNames: ["toAccountId"],
                        referencedTableName: "accounts",
                        referencedColumnNames: ["id"]
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("transactions");
        await queryRunner.dropTable("accounts");
    }

}
