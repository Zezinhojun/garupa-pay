import { Container } from "inversify";
import { IEventBus } from "../domain/interfaces/eventbus.interface";
import { EventBus } from "../infrastructure/events/eventbus";
import { TYPES } from "./types";

const container = new Container()

function initializeContainer() {
    container.bind<IEventBus>(TYPES.EventBus).to(EventBus)
    container.bind<IEventBus>(TYPES.EventBusClient).to(EventBus);
}
export { container, initializeContainer }