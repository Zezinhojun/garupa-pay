import { Container } from "inversify";
import { initializeContainer, container } from "./di/container";
import { TYPES } from "./di/types";
import { IHttpServer } from "./domain/interfaces/http.server.interface";
import { AccountController } from "./applications/usecases/controllers/account.controller";
import { TransactionController } from "./applications/usecases/controllers/transaction.controller";
import { errorHandler } from "./infrastructure/clients/express/error.handler";

class App {
    private readonly port: number
    private container: Container;

    constructor() {
        this.container = container;
        this.port = parseInt(process.env.BACKEND_SERVICE_PORT ?? '8080')
    }

    async initialize() {
        try {
            this.container = await initializeContainer();
            const accountController = container.get<AccountController>(TYPES.AccountController);
            const transactionController = container.get<TransactionController>(TYPES.TransactionController);
            if (this.container) {
                const server = this.container.get<IHttpServer>(TYPES.HttpServer);

                server.addRoute('PUT', '/accounts/:accountId/status', (req, res, next) => accountController.updatedStatus(req, res, next));
                server.addRoute('POST', '/accounts', (req, res, next) => accountController.create(req, res, next));
                server.addRoute('GET', '/accounts/:id', (req, res) => accountController.findById(req, res));
                server.addRoute('GET', '/accounts', (req, res) => accountController.findAll(req, res));
                server.addRoute('PUT', '/accounts/:id', (req, res) => accountController.update(req, res));
                server.addRoute('DELETE', '/accounts/:id', (req, res) => accountController.delete(req, res));

                server.addRoute('POST', '/transactions', (req, res, next) => transactionController.create(req, res, next));
                server.addRoute('GET', '/transactions/:id', (req, res) => transactionController.findById(req, res));
                server.addRoute('GET', '/transactions', (req, res) => transactionController.findAll(req, res));
                server.addRoute('PUT', '/transactions/:id', (req, res) => transactionController.update(req, res));
                server.addRoute('DELETE', '/transactions/:id', (req, res) => transactionController.delete(req, res));

                server.addMiddleware(errorHandler);

                server.start(this.port);
            }
        } catch (error) {
            console.error("Error during initialization:", error);
        }
    }
}

const app = new App();
app.initialize();