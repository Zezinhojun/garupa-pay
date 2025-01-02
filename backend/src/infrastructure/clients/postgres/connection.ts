import { Pool } from 'pg'
import { PostgresConfig } from './config'

export class PostgresConnection {
    private static instance: Pool | null = null

    public static connect(config: PostgresConfig): Pool {
        if (!this.instance) {
            this.instance = new Pool({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database,
                port: config.port,
            })
        }

        return this.instance
    }
}