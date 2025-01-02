import { Container } from "inversify";
import { initializeContainer, container } from "./di/container";
import { TYPES } from "./di/types";
import { IHttpServer } from "./domain/interfaces/http.server.interface";

class App {
    private container: Container;

    constructor() {
        this.container = container;
    }

    async initialize() {
        try {
            this.container = await initializeContainer();
            if (this.container) {
                const server = this.container.get<IHttpServer>(TYPES.HttpServer);
                server.start(3000);
            }
        } catch (error) {
            console.error("Error during initialization:", error);
        }
    }
}

const app = new App();
app.initialize();