import { Consumer } from "kafkajs";
import { DocumentCreated } from "../../../../events/documents/documentCreated.event";
import { WebHookUtils } from "../../../utils/webhook.utils";
import { QueueConsumerBase } from "../base/consumer.base";
import { documentCreatedQueue } from "./documentCreated.queue";

export class DocumentCreatedConsumer extends QueueConsumerBase<DocumentCreated> {

	constructor(consumer: Consumer) {
		super(consumer, 5);
	}

	protected get topic(): string {
		return documentCreatedQueue;
	}

	protected async messageProcessor(message: DocumentCreated): Promise<void> {
		console.log("CREATED PROCESSOR");
		await WebHookUtils.sendWebHook({
			type: 'Document',
			event: 'DocumentCreated',
			data: message
		});
	}

}
