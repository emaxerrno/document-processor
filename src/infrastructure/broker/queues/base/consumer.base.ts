import { Consumer, EachMessagePayload } from "kafkajs";

export abstract class QueueConsumerBase<T> {
	constructor(private consumer: Consumer, private concurrency: number = 1) {}

	public async connect(): Promise<void> {
		await this.consumer.connect();
	}

	public async initialize(): Promise<void> {
		await this.consumer.subscribe({ topic: this.topic });

		// only kickstart consumer (do not await here)
		this.consumer.run({
			partitionsConsumedConcurrently: this.concurrency,
			eachMessage: async (payload: EachMessagePayload) => {
				const value = payload?.message?.value?.toString();
				if (!value)
				{
					throw new Error("Consumed message value is undefined.");
				}
				await this.messageProcessor(JSON.parse(value));
			}
		})
		.catch(error => console.error(`Consumer (${this.topic}) error.`, error))
	}

	protected abstract messageProcessor(message: T): Promise<void>;

	protected abstract get topic(): string;
}
