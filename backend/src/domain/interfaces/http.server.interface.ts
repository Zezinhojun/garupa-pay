export interface IHttpServer<RequestType = any, ResponseType = any> {
    start(port: number): void;
    addRoute(method: string, path: string, handler: (req: RequestType, res: ResponseType, next: (err?: any) => void) => Promise<void>): void;
    addMiddleware(middleware: any): void
}