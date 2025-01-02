import { In, ObjectLiteral, Repository } from 'typeorm';
import { injectable } from 'inversify';
import { IOrmRepository } from '../../../../domain/interfaces/orm.client.interface';

@injectable()
export class TypeOrmClientAdapter<T extends ObjectLiteral> implements IOrmRepository<T> {
    private readonly repository: Repository<T>

    constructor(repository: Repository<T>) {
        this.repository = repository
    }

    async save(entity: T): Promise<T> {
        return await this.repository.save(entity);
    }

    async find(criteria: Partial<T>, relations?: string[], page?: number, limit?: number): Promise<T[]> {
        const whereClause: any = {};

        Object.entries(criteria).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                whereClause[key] = In(value);
            } else {
                whereClause[key] = value;
            }
        });

        const skip = page && limit ? (page - 1) * limit : 0;
        const take = limit ?? 10;

        if (page && limit) {
            return this.repository.find({
                where: whereClause,
                relations: relations,
                skip: skip,
                take: take,
            });
        } else {
            return this.repository.find({
                where: whereClause,
                relations: relations,
            });
        }
    }

    async findOne(id: string): Promise<T | null> {
        return this.repository.findOne({ where: { id: id as any } });
    }

    async update(id: string, entity: Partial<T>): Promise<T | null> {
        const updateData = { ...entity } as any;
        delete updateData.sentTransactions;
        delete updateData.receivedTransactions;

        const result = await this.repository
            .createQueryBuilder()
            .update()
            .set(updateData)
            .where("id = :id", { id })
            .returning("*")
            .execute();

        return result.affected ? result.raw[0] : null;
    }

    async delete(id: string): Promise<boolean> {

        const result = await this.repository
            .createQueryBuilder()
            .delete()
            .from(this.repository.target)
            .where("id = :id", { id })
            .execute();

        return result.affected! > 0;
    }
}