import { Consumer } from "kafkajs";
import { QueueConsumerBase } from "../base/consumer.base";
import { DocumentRequested } from "../../../../events/documents/documentRequested.event";
import { documentRequestedQueue } from "./documentRequested.queue";

export class DocumentRequestedConsumer extends QueueConsumerBase<DocumentRequested> {

	constructor(consumer: Consumer) {
		super(consumer, 10);
	}

	protected async messageProcessor(message: DocumentRequested): Promise<void> {
		console.log(`Consuming message ${message.url}`);
	}

	protected get topic(): string {
		return documentRequestedQueue;
	}

}
