import { DataSourceOptions } from 'typeorm';
import { AccountORM } from './entities/account.orm.entity';
import { TransactionORM } from './entities/transaction.orm.entity';
import { InitialMigration1735584303465 } from './migrations/1735584303465-InitialMigration';

const typeOrmConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    username: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? 'password',
    database: process.env.POSTGRES_DB ?? 'garupa-db',
    synchronize: false,
    logging: false,
    entities: [AccountORM, TransactionORM],
    migrations: [InitialMigration1735584303465],
};

export default typeOrmConfig;

