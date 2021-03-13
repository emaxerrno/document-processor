import { Producer } from "kafkajs";
import { QueueProducerBase } from "../base/producer.base";
import { DocumentRequested } from "../../../../events/documents/documentRequested.event";
import { documentRequestedQueue } from "./documentRequested.queue";

export class DocumentRequestedProducer extends QueueProducerBase<DocumentRequested> {

	constructor(producer: Producer) {
		super(producer);
	}

	protected get topic(): string {
		return documentRequestedQueue;
	}

}
