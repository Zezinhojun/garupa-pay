export interface QueryFilter {
    [key: string]: any;
}

export interface ISqlClient {
    findOne<T>(tableName: string, query: QueryFilter): Promise<T | null>;
    findMany<T>(tableName: string, query?: QueryFilter): Promise<T[]>;
    insert<T extends object>(tableName: string, data: T): Promise<T>
    update<T>(tableName: string, query: QueryFilter, data: Partial<T>): Promise<T | null>;
    delete(tableName: string, query: QueryFilter): Promise<boolean>;
}
