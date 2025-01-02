export interface IBaseRepository<T> {
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    findMany(query: object): Promise<T[]>
    create(entity: T): Promise<T>;
    update(id: string, entity: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    findWithPagination(page: number, limit: number): Promise<T[]>;
}
