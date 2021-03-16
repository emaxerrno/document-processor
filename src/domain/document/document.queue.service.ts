import { DocumentCreated } from "../../events/documents/documentCreated.event";
import { DocumentRequested } from "../../events/documents/documentRequested.event";
import { IQueueProducer } from "../../infrastructure/broker/producer.interface";
import { HashUtils } from "../../infrastructure/utils/hash.utils";

export class DocumentQueueService {
	constructor(
		private documentRequestedProducer: IQueueProducer<DocumentRequested>,
		private documentCreatedProducer: IQueueProducer<DocumentCreated>
	) {}

	public async sendDocumentRequestedEvent(event: DocumentRequested): Promise<void> {
		await this.documentRequestedProducer.send(
			HashUtils.generate(event.url),
			event
		);
	}

	public async sendDocumentCreatedEvent(id: number, event: DocumentCreated): Promise<void> {
		await this.documentCreatedProducer.send(
			id.toString(),
			event
		);
	}

}
