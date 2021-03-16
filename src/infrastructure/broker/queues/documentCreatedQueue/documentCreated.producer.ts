import { Producer } from "kafkajs";
import { DocumentCreated } from "../../../../events/documents/documentCreated.event";
import { QueueProducerBase } from "../base/producer.base";
import { documentCreatedQueue } from "./documentCreated.queue";

export class DocumentCreatedProducer extends QueueProducerBase<DocumentCreated> {

	constructor(producer: Producer) {
		super(producer);
	}

	protected get topic(): string {
		return documentCreatedQueue;
	}

}
