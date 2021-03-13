import { Kafka } from 'kafkajs';
import { kafkaConfig } from "./kafka.config";
import { environment as env } from "./../environment/environment";

const kafka = new Kafka({
	clientId: kafkaConfig[env].clientId,
	brokers: kafkaConfig[env].brokers || [],
});

class Broker {
	public async initialize(): Promise<void> {}
}

export default new Broker();
