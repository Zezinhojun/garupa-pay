export interface IHttpServer<RequestType = any, ResponseType = any> {
    start(port: number): void;
    addRoute(method: string, path: string, handler: (req: RequestType, res: ResponseType) => Promise<void>): void;
}