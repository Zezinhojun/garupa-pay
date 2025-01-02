import { Pool } from 'pg';
import { ISqlClient } from '../../../domain/interfaces/sql.client.interface';

export class PostgresClientAdapter implements ISqlClient {
    private readonly pool: Pool

    constructor(pool: Pool) {
        this.pool = pool
    }

    async findOne<T>(tableName: string, query: any): Promise<T | null> {
        const keys = Object.keys(query || {})
        const values = Object.values(query || {})

        if (keys.length === 0) return null;

        const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
        const sql = `SELECT * FROM ${tableName} WHERE ${conditions} LIMIT 1`;

        try {
            const { rows } = await this.pool.query(sql, values);

            return rows[0] || null;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error in findOne: ${error.message}`);
            } else {
                throw new Error('Unknown error in findOne');
            }
        }

    }

    async findMany<T>(tableName: string, query?: any): Promise<T[]> {
        const keys = Object.keys(query || {})
        const values = Object.values(query || {});
        let sql = `SELECT * FROM ${tableName}`

        if (keys.length > 0) {
            const conditions = keys.map((key, index) => {
                const value = values[index]
                if (Array.isArray(value)) {
                    return `${key} = ANY($${index + 1})`
                }
                return `${key} = $${index + 1}`
            }).join(' AND ')
            sql += ` WHERE ${conditions}`;
        }

        try {
            const { rows } = await this.pool.query(sql, values);

            return rows;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error in findMany: ${error.message}`);
            } else {
                throw new Error('Unknown error in findMany');
            }
        }
    }

    async insert<T extends object>(tableName: string, data: T): Promise<T> {
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map((_, index) => `$${index + 1}`).join(', ');
        const values = Object.values(data);
        const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;

        try {
            const { rows } = await this.pool.query(sql, values);

            return rows[0];
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error in insert: ${error.message}`);
            } else {
                throw new Error('Unknown error in insert');
            }
        }

    }

    async update<T>(tableName: string, query: any, data: Partial<T>): Promise<T | null> {
        const keys = Object.keys(query || {});

        if (keys.length === 0) return null;

        const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
        const values = Object.values(query || {});
        const dataKeys = Object.keys(data || {});

        if (dataKeys.length === 0) return null;

        const columns = Object.keys(data).map((key, index) => `${key} = $${keys.length + index + 1}`).join(', ');
        const dataValues = Object.values(data || {});
        const sql = `UPDATE ${tableName} SET ${columns} WHERE ${conditions} RETURNING *`;

        try {
            const { rows } = await this.pool.query(sql, [...values, ...dataValues]);

            return rows[0] || null;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error in update: ${error.message}`);
            } else {
                throw new Error('Unknown error in update');
            }
        }
    }

    async delete(tableName: string, query: any): Promise<boolean> {
        const keys = Object.keys(query || {});

        if (keys.length === 0) return false;

        const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
        const values = Object.values(query || {});
        const sql = `DELETE FROM ${tableName} WHERE ${conditions}`;

        try {
            const result = await this.pool.query(sql, values);

            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error in delete: ${error.message}`);
            } else {
                throw new Error('Unknown error in delete');
            }
        }


    }

}