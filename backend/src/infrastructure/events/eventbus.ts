import { inject, injectable } from "inversify";
import { IEventBus } from "../../domain/interfaces/eventbus.interface";
import { TYPES } from "../../di/types";

@injectable()
export class EventBus implements IEventBus {
    @inject(TYPES.EventBusClient)
    private readonly client!: IEventBus;

    async emit(event: string, data: any): Promise<void> {
        await this.client.emit(event, data);
    }
    async subscribe(event: string, callback: (message: string) => void): Promise<void> {
        await this.client.subscribe(event, callback);
    }
    async close(): Promise<void> {
        await this.client.close();
    }
}