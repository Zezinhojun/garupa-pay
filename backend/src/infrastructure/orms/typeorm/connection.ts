import { DataSource } from 'typeorm';
import typeOrmConfig from './config';

export class TypeOrmConnection {
    private static instance: DataSource | null = null

    public static async connect(): Promise<DataSource> {
        if (!this.instance) {
            this.instance = new DataSource(typeOrmConfig)
            await this.instance.initialize()
        }

        return this.instance
    }

    public static getInstance(): DataSource {
        if (!this.instance) {
            throw new Error('TypeORM connection not initialized. Call connect() first.');
        }
        return this.instance;
    }

    public static async disconnect(): Promise<void> {
        if (this.instance) {
            await this.instance.destroy();
            this.instance = null;
            console.log('TypeORM disconnected');
        }
    }
}