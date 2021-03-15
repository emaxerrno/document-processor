import { DocumentRequested } from "../../events/documents/documentRequested.event";
import { IQueueProducer } from "../../infrastructure/broker/producer.interface";
import { HashUtils } from "../../infrastructure/utils/hash.utils";

export class DocumentQueueService {
	constructor(private documentRequestedProducer: IQueueProducer<DocumentRequested>) {}

	public async sendDocumentRequestedEvent(event: DocumentRequested) {
		await this.documentRequestedProducer.send(
			HashUtils.generate(event.url),
			event
		);
	}

}
