import { inject, injectable } from "inversify";
import { ProcessTransactionUseCase } from "../../applications/usecases/processTransaction.usecase";
import { IEventBus } from "../../domain/interfaces/eventbus.interface";
import { TYPES } from "../../di/types";

@injectable()
export class TransactionEventHandler {
    constructor(
        @inject(TYPES.EventBus)
        private readonly eventBus: IEventBus,
        @inject(TYPES.ProcessTransactionUseCase)
        private readonly processTransactionUseCase: ProcessTransactionUseCase,
    ) { }

    public async initialize(): Promise<void> {
        await this.initializeSubscription();
    }

    private async initializeSubscription(): Promise<void> {
        await this.eventBus.subscribe('transaction.created', async (message: string) => {
            try {
                const eventData = JSON.parse(message)
                await this.processTransactionUseCase.execute(eventData);
            } catch (error) {
                console.error('Error processing transaction:', error);
            }
        })

        await this.eventBus.subscribe('transaction.completed', async (message: string) => {
            try {
                const eventData = JSON.parse(message);
                console.log("Transaction completed event received:", eventData);
            } catch (error) {
                console.error('Error processing completed transaction event:', error);
            }
        });

    }

    async close(): Promise<void> {
        await this.eventBus.close();
    }
}