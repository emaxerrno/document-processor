import { ConsumerConfig, Kafka } from 'kafkajs';
import { kafkaConfig } from "../config/kafka.config";
import { environment as env } from "./../environment/environment";
import { DocumentRequestedProducer } from './queues/documentRequestedQueue/documentRequested.producer';
import { DocumentRequestedConsumer } from './queues/documentRequestedQueue/documentRequested.consumer';
import { DocumentCreatedProducer } from './queues/documentCreatedQueue/documentCreated.producer';
import { DocumentCreatedConsumer } from './queues/documentCreatedQueue/documentCreated.consumer';

const kafka = new Kafka({
	clientId: kafkaConfig[env].clientId,
	brokers: kafkaConfig[env].brokers || [],
});

const consumerConfigDocumentRequested: ConsumerConfig = { groupId: `${kafkaConfig[env].clientId}-document-requested` };
const consumerConfigDocumentCreated: ConsumerConfig = { groupId: `${kafkaConfig[env].clientId}-document-created` };

class Broker {
	// TODO: add better abstraction

	// document requested
	private readonly documentRequestedConsumer = new DocumentRequestedConsumer(kafka.consumer(consumerConfigDocumentRequested));
	private readonly documentRequestedProducer = new DocumentRequestedProducer(kafka.producer());
	// document created
	private readonly documentCreatedConsumer = new DocumentCreatedConsumer(kafka.consumer(consumerConfigDocumentCreated));
	private readonly documentCreatedProducer = new DocumentCreatedProducer(kafka.producer());

	public async initialize(): Promise<void> {
		await this.documentRequestedConsumer.connect();
		await this.documentRequestedProducer.connect();
		await this.documentCreatedConsumer.connect();
		await this.documentCreatedProducer.connect();
		await this.initializeConsumers();
	}

	public getDocumentRequestedProducer(): DocumentRequestedProducer {
		return this.documentRequestedProducer;
	}

	public getDocumentCreatedProducer(): DocumentCreatedProducer {
		return this.documentCreatedProducer;
	}

	private async initializeConsumers(): Promise<void> {
		await this.documentRequestedConsumer.initialize();
		await this.documentCreatedConsumer.initialize();
	}
}

export default new Broker();
