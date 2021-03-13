import { ConsumerConfig, Kafka } from 'kafkajs';
import { kafkaConfig } from "./kafka.config";
import { environment as env } from "./../environment/environment";
import { DocumentRequestedProducer } from './queues/documentRequestedQueue/documentRequested.producer';
import { DocumentRequestedConsumer } from './queues/documentRequestedQueue/documentRequested.consumer';

const kafka = new Kafka({
	clientId: kafkaConfig[env].clientId,
	brokers: kafkaConfig[env].brokers || [],
});

const consumerConfig: ConsumerConfig = { groupId: `${kafkaConfig[env].clientId}-group` };

class Broker {
	private readonly documentRequestedConsumer = new DocumentRequestedConsumer(kafka.consumer(consumerConfig));
	private readonly documentRequestedProducer = new DocumentRequestedProducer(kafka.producer());

	public async initialize(): Promise<void> {
		await this.documentRequestedConsumer.connect();
		await this.documentRequestedProducer.connect();
		await this.initializeConsumers();
	}

	public getDocumentRequestedProducer(): DocumentRequestedProducer {
		return this.documentRequestedProducer;
	}

	private async initializeConsumers(): Promise<void> {
		await this.documentRequestedConsumer.initialize();
	}
}

export default new Broker();
