import { injectable, inject } from "inversify";
import { ICacheClient } from "../../../domain/interfaces/cache.client.interface";
import { ICacheRepository } from "../../../domain/interfaces/cache.repository.interface";
import { TYPES } from "../../../di/types";

@injectable()
export class CacheRepository implements ICacheRepository {
    private readonly client: ICacheClient

    constructor(
        @inject(TYPES.CacheClient)
        client: ICacheClient
    ) {
        this.client = client;
    }

    async set(key: string, value: any): Promise<void> {
        await this.client.set(key, value);
    }
    async get<T>(key: string): Promise<T | null> {
        return await this.client.get<T>(key);
    }
    async remove(key: string): Promise<void> {
        await this.client.remove(key);
    }

}