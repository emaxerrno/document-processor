import { Producer } from "kafkajs";
import { IQueueProducer } from "../../producer.interface";

export abstract class QueueProducerBase<T extends object> implements IQueueProducer<T> {
	constructor(private producer: Producer) {}

	public async connect(): Promise<void> {
		await this.producer.connect();
	}

	public async send(key: string, value: T): Promise<void> {
		await this.producer.send({
      topic: this.topic,
      messages: [{
				key: key,
				value: JSON.stringify(value)
			}],
    });
	}

	protected abstract get topic(): string;
}
