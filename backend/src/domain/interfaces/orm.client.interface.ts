export interface IOrmRepository<T> {
    save(entity: T): Promise<T>;
    findOne(id: string): Promise<T | null>;
    find(criteria: Partial<T>, relations?: string[], page?: number, limit?: number): Promise<T[]>;
    update(id: string, entity: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}