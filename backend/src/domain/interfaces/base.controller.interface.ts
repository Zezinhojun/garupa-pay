export interface IRequest<TBody = any, TParams = any, TQuery = any> {
    body: TBody;
    params: TParams;
    query: TQuery;
}

export interface IResponse {
    status(statusCode: number): IResponse;
    json(data: any): IResponse;
    send(data?: any): IResponse;
}

export interface IBaseController<T> {
    create(req: { body: T; }, res: any, next: any): Promise<void>
    findById(req: IRequest, res: IResponse): Promise<void>;
    findAll(req: IRequest<object, object, { page?: string; limit?: string }>, res: any): Promise<void>
    update(req: { params: { id: string; }; body: Partial<T>; }, res: any): Promise<void>
    delete(req: { params: { id: string; }; }, res: any): Promise<void>
}