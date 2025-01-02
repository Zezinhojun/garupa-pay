import { Container } from "inversify";
import { IEventBus } from "../domain/interfaces/eventbus.interface";
import { EventBus } from "../infrastructure/events/eventbus";
import { TYPES } from "./types";
import { RedisClientAdapter } from "../infrastructure/clients/redis/redis.event.client";

const container = new Container()

function initializeContainer() {
    container.bind<IEventBus>(TYPES.EventBus).to(EventBus)
    container.bind<IEventBus>(TYPES.EventBusClient).to(RedisClientAdapter);
}
export { container, initializeContainer }