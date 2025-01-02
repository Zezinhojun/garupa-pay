import { Container } from "inversify";
import { initializeContainer, container } from "./di/container";
import { TYPES } from "./di/types";
import { IHttpServer } from "./domain/interfaces/http.server.interface";
import { AccountController } from "./applications/usecases/controllers/account.controller";

class App {
    private container: Container;

    constructor() {
        this.container = container;
    }

    async initialize() {
        try {
            this.container = await initializeContainer();
            const accountController = container.get<AccountController>(TYPES.AccountController);
            if (this.container) {
                const server = this.container.get<IHttpServer>(TYPES.HttpServer);
                server.addRoute('PUT', '/accounts/:accountId/status', (req, res) => accountController.updatedStatus(req, res));
                server.start(3000);
            }
        } catch (error) {
            console.error("Error during initialization:", error);
        }
    }
}

const app = new App();
app.initialize();