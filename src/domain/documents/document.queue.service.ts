import { v4 as uuidv4 } from "uuid";
import { DocumentRequested } from "../../events/documents/documentRequested.event";
import { IQueueProducer } from "../../infrastructure/broker/producer.interface";

export class DocumentQueueService {
	constructor(private documentQueueProducer: IQueueProducer<DocumentRequested>) {}

	public async create(event: DocumentRequested) {
		await this.documentQueueProducer.send(
			uuidv4.toString(),
			event
		);
	}

}
