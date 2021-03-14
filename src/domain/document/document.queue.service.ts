import { DocumentRequested } from "../../events/documents/documentRequested.event";
import { IQueueProducer } from "../../infrastructure/broker/producer.interface";
import { UuidUtils } from "../../infrastructure/utils/uuid.utils";

export class DocumentQueueService {
	constructor(private documentRequestedProducer: IQueueProducer<DocumentRequested>) {}

	public async sendDocumentRequestedEvent(event: DocumentRequested) {
		await this.documentRequestedProducer.send(
			UuidUtils.getUuid().toString(), // TODO: use url hash as partition key
			event
		);
	}

}
