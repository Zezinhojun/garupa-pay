import { DataSource } from 'typeorm';
import { TypeOrmConnection } from '../connection';

async function runMigrations() {
    try {
        console.log('Connecting to the database...');
        const connection: DataSource = await TypeOrmConnection.connect();

        console.log('Running migrations...');
        await connection.runMigrations();

        console.log('Migrations executed successfully');
    } catch (error) {
        console.error('Error running migrations', error);
        process.exit(1);
    } finally {
        await TypeOrmConnection.disconnect();
    }
}

runMigrations();
