import Redis from "ioredis";
import { IEventBus } from "../../../domain/interfaces/eventbus.interface";
import { RedisConnection } from "./connection";
import { injectable } from "inversify";

@injectable()
export class RedisClientAdapter implements IEventBus {
    private readonly publishClient: Redis;
    private readonly subscribeClient: Redis;

    constructor() {
        this.publishClient = RedisConnection.getInstance();
        this.subscribeClient = RedisConnection.getSubscriberInstance();
    }
    async emit(event: string, data: any): Promise<void> {
        await this.publishClient.publish(event, JSON.stringify(data));
    }
    async subscribe(event: string, callback: (message: string) => void): Promise<void> {
        await this.subscribeClient.subscribe(event);

        this.subscribeClient.on('message', (channel, message) => {
            if (channel === event) {
                callback(message);
            }
        });
    }
    async close(): Promise<void> {
        await RedisConnection.disconnect();
    }
}