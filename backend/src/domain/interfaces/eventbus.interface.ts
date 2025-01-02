export interface IEventBus {
    emit(event: string, data: any): Promise<void>;
    subscribe(event: string, callback: (message: string) => void): Promise<void>;
    close(): Promise<void>;
}