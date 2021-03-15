import { Consumer } from "kafkajs";
import { QueueConsumerBase } from "../base/consumer.base";
import { DocumentCreated } from "../../../../events/documents/documentCreated.event";
import { documentCreatedQueue } from "./documentCreated.queue";

export class DocumentCreatedConsumer extends QueueConsumerBase<DocumentCreated> {

	constructor(consumer: Consumer) {
		super(consumer, 5);
	}

	protected get topic(): string {
		return documentCreatedQueue;
	}

	protected async messageProcessor(_message: DocumentCreated): Promise<void> {

	}

}
