import Redis from "ioredis";
import { RedisConfig, redisOptions } from "./config";

export class RedisConnection {
    private static mainInstance: Redis | null = null
    private static subscriberInstance: Redis | null = null;

    public static async connect(config: RedisConfig): Promise<Redis> {
        if (!this.mainInstance) {
            try {
                this.mainInstance = new Redis({
                    host: config.host,
                    port: config.port,
                    ...redisOptions
                })

                this.mainInstance.on('error', (err) => {
                    console.error('Redis Client Error', err);
                });

            } catch (error) {
                console.error('Redis connection error', error);
                throw error;
            }
        }
        return this.mainInstance;
    }

    public static async connectSubscriber(config: RedisConfig): Promise<Redis> {
        if (!this.subscriberInstance) {
            try {
                this.subscriberInstance = new Redis({
                    host: config.host,
                    port: config.port,
                    ...redisOptions
                });

                this.subscriberInstance.on('error', (err) => {
                    console.error('Redis Subscriber Client Error', err);
                });

            } catch (error) {
                console.error('Redis subscriber connection error', error);
                throw error;
            }
        }
        return this.subscriberInstance;
    }

    public static getInstance(): Redis {
        if (!this.mainInstance) {
            throw new Error('RedisConnection not initialized. Call connect() first.');
        }
        return this.mainInstance;
    }

    public static getSubscriberInstance(): Redis {
        if (!this.subscriberInstance) {
            throw new Error('Subscriber Redis connection not initialized. Call connectSubscriber() first.');
        }
        return this.subscriberInstance;
    }

    public static async disconnect(): Promise<void> {
        if (this.mainInstance) {
            await this.mainInstance.quit();
            this.mainInstance = null;
        }

        if (this.subscriberInstance) {
            await this.subscriberInstance.quit();
            this.subscriberInstance = null;
        }
    }

}