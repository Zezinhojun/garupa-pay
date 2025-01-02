export interface PostgresConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
}

export const postgresConfig: PostgresConfig = {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    user: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? 'password',
    database: process.env.POSTGRES_DB ?? 'garupa-db',
    port: process.env.POSTGRES_HOST ? parseInt(process.env.POSTGRES_HOST, 10) : 5432,
};
