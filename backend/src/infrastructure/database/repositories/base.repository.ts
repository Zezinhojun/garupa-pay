import { inject, injectable } from "inversify";
import { IBaseRepository } from "../../../domain/interfaces/base.repository";
import { IOrmRepository } from "../../../domain/interfaces/orm.client.interface";
import { TYPES } from "../../../di/types";
import { BaseMapper } from "../../clients/orms/mappers/base.mapper";
import { ICacheClient } from "../../../domain/interfaces/cache.client.interface copy";

@injectable()
export abstract class BaseRepository<TDomain, TORM> implements IBaseRepository<TDomain> {
    private readonly prefix: string = this.constructor.name;

    constructor(
        @inject(TYPES.OrmRepository)
        protected client: IOrmRepository<TORM>,
        @inject(TYPES.BaseMapper)
        protected mapper: BaseMapper<TDomain, TORM>,
        @inject(TYPES.CacheClient)
        protected cacheRepository: ICacheClient
    ) { }

    async findById(id: string): Promise<TDomain | null> {
        if (!id) throw new Error('Id is required');
        const ormEntity = await this.client.findOne(id);

        return ormEntity ? this.mapper.toDomain(ormEntity) : null
    }

    async findAll(): Promise<TDomain[]> {
        const cacheKey = this.generateKey();
        const cachedData = await this.cacheRepository.get<TORM[]>(cacheKey);

        if (cachedData) {
            return cachedData.map((entity: TORM) => this.mapper.toDomain(entity));
        }

        const ormEntities = await this.client.find({})
        const result = ormEntities.map(entity => this.mapper.toDomain(entity));

        await this.cacheRepository.set(cacheKey, ormEntities);

        return result
    }

    async findWithPagination(page: number, limit: number): Promise<TDomain[]> {
        const cachedData = await this.cacheRepository.get<TORM[]>(this.generateKey());

        if (cachedData) {
            const paginatedData = this.getPaginatedData(cachedData.map(entity =>
                this.mapper.toDomain(entity)), page, limit);
            return paginatedData;
        }

        const allData = await this.findAll();

        return this.getPaginatedData(allData, page, limit);
    }

    async findMany(query: object): Promise<TDomain[]> {
        const ormEntities = await this.client.find(query)
        if (!ormEntities || ormEntities.length === 0) throw new Error('No entities found');

        return ormEntities.map(entity => this.mapper.toDomain(entity))
    }

    async create(entity: TDomain): Promise<TDomain> {
        if (!entity) throw new Error('Entity is required');
        const ormEntity = this.mapper.toPersistence(entity)
        const created = await this.client.save(ormEntity);

        await this.invalidateCache();

        return this.mapper.toDomain(created)

    }

    async update(id: string, entity: Partial<TDomain>): Promise<TDomain | null> {
        if (!id || !entity) throw new Error('Id and entity are required');
        const ormEntity = this.mapper.toPersistence(entity as TDomain)
        const updated = await this.client.update(id, ormEntity)

        await this.invalidateCache();

        return updated ? this.mapper.toDomain(updated) : null
    }

    async delete(id: string): Promise<boolean> {
        if (!id) throw new Error('Id is required');
        const deleted = await this.client.delete(id);

        if (deleted) await this.invalidateCache();

        return deleted
    }

    private generateKey() {
        return `${this.prefix}:list`
    }

    private getPaginatedData(allData: TDomain[], page: number, limit: number): TDomain[] {
        const skip = (page - 1) * limit;
        const take = page * limit;
        return allData.slice(skip, take);
    }

    private async invalidateCache(): Promise<void> {
        const cacheKey = this.generateKey();
        await this.cacheRepository.remove(cacheKey);
    }
}