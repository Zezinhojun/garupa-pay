import { injectable } from "inversify";
import { IBaseController, IRequest } from "../../../domain/interfaces/base.controller.interface";
import { IBaseRepository } from "../../../domain/interfaces/base.repository";


interface IPlainConvertible {
    toPlain(): object;
}

@injectable()
export class BaseController<T extends IPlainConvertible> implements IBaseController<T> {
    constructor(
        protected readonly repository: IBaseRepository<T>
    ) { }

    async create(req: { body: T; }, res: any): Promise<void> {
        try {
            const entity = req.body;
            const createdEntity = await this.repository.create(entity);
            return res.status(201).json(createdEntity);
        } catch (error) {
            const errorMessage = (error as Error).message;
            return res.status(500).json({ error: errorMessage });
        }
    }

    async findById(req: IRequest, res: any): Promise<void> {
        const { id } = req.params;
        try {
            const entity = await this.repository.findById(id);
            if (!entity) {
                return res.status(404).json({ error: `${this.repository.constructor.name} not found` });
            }
            return res.status(200).json(entity.toPlain());
        } catch (error) {
            const errorMessage = (error as Error).message;
            return res.status(500).json({ error: errorMessage });
        }
    }

    async findAll(req: IRequest<object, object, { page?: string; limit?: string }>, res: any): Promise<void> {
        const { page, limit } = req.query;

        try {
            let entities;
            if (page && limit) {
                entities = await this.repository.findWithPagination(parseInt(page), parseInt(limit));
            } else {
                entities = await this.repository.findAll();
            }

            return res.status(200).json(entities.map(entity => entity.toPlain()));
        } catch (error) {
            const errorMessage = (error as Error).message;
            return res.status(500).json({ error: errorMessage });
        }
    }

    async update(req: IRequest, res: any): Promise<void> {
        const { id } = req.params;
        const entityUpdates = req.body;

        try {
            const updatedEntity = await this.repository.update(id, entityUpdates);
            return res.status(200).json(updatedEntity?.toPlain());
        } catch (error) {
            const errorMessage = (error as Error).message;
            return res.status(500).json({ error: errorMessage });
        }
    }

    async delete(req: IRequest, res: any): Promise<void> {
        const { id } = req.params;
        try {
            const success = await this.repository.delete(id);
            if (!success) {
                return res.status(404).json({ error: `${this.repository.constructor.name} not found` });
            }
            return res.status(204).send();
        } catch (error) {
            const errorMessage = (error as Error).message;
            return res.status(500).json({ error: errorMessage });
        }
    }

}