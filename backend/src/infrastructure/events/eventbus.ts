import { IEventBus } from "../../domain/interfaces/eventbus.interface";

export class EventBus implements IEventBus {
    private readonly client: IEventBus

    constructor(client: IEventBus) {
        this.client = client
    }
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