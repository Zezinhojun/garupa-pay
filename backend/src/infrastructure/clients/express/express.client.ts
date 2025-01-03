import express, { Application, json, Request, RequestHandler, Response } from "express";
import { IHttpServer } from "../../../domain/interfaces/http.server.interface";
import { injectable } from "inversify";

@injectable()
export class ExpressClientAdapter implements IHttpServer<Request, Response> {
    private readonly app: Application

    constructor() {
        this.app = express();
        this.app.use(json());
    }

    start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
    addRoute(method: string, path: string, handler: RequestHandler): void {
        switch (method.toUpperCase()) {
            case 'GET':
                this.app.get(path, handler);
                break;
            case 'POST':
                this.app.post(path, handler);
                break;
            case 'PUT':
                this.app.put(path, handler);
                break;
            case 'DELETE':
                this.app.delete(path, handler);
                break;
            default:
                throw new Error(`Unsupported HTTP method: ${method}`);
        }
    }

    addMiddleware(middleware: any): void {
        this.app.use(middleware);
    }
}