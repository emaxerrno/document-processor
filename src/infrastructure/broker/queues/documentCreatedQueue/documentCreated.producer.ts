import { Producer } from "kafkajs";
import { QueueProducerBase } from "../base/producer.base";
import { DocumentCreated } from "../../../../events/documents/documentCreated.event";
import { documentCreatedQueue } from "./documentCreated.queue";

export class DocumentCreatedProducer extends QueueProducerBase<DocumentCreated> {

	constructor(producer: Producer) {
		super(producer);
	}

	protected get topic(): string {
		return documentCreatedQueue;
	}

}
