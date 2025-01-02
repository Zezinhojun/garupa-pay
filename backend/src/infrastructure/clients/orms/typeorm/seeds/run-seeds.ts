import 'dotenv/config';
import { TypeOrmConnection } from '../connection';
import { Seeder } from './seeder';

async function runSeeds() {
    try {
        console.log('Connecting to database...');
        await TypeOrmConnection.connect();

        console.log('Running seeds...');
        const seeder = new Seeder();
        await seeder.initialize();

        console.log('Seeds completed successfully');
    } catch (error) {
        console.error('Error running seeds:', error);
        process.exit(1);
    } finally {
        await TypeOrmConnection.disconnect();
    }
}

runSeeds();