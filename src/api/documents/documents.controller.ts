import database from "../../infrastructure/database/database";
import broker from "../../infrastructure/broker/broker";
import { DocumentService } from "../../domain/document/document.service";
import { CreateDocument } from "./models/createDocument.command";
import { IDocumentDto } from "./models/document.dto";
import { DocumentMapper } from "./mappers/document.mapper";
import { DocumentReferenceService } from "../../domain/documentReference/documentReference.service";
import { DocumentQueueService } from "../../domain/document/document.queue.service";
import { DocumentRequested } from "../../events/documents/documentRequested.event";
import { ConflictHttpException } from "../../infrastructure/exceptions/conflict.exception";

export class DocumentsController
{
	public async getDocuments(): Promise<IDocumentDto[]>
	{
		var result = await this.documentService.getList();
		return DocumentMapper.toDtoList(result);
	}

  public async createDocument(body: CreateDocument): Promise<void>
	{
		var exists = await this.documentReferenceService.exists(body.url);

		// in case reference already exists, processing is not needed
		if (exists) {
			throw new ConflictHttpException("Document reference already exists.");
		}

		// TODO: use transactional outbox pattern instead of sending directly to broker
		// OR use kafka connect
		// - in case of transactional outbox this would mean (under single transaction or unit of work):
		// 	- add a new DocumentReference record
		//	- add a new outbox event

		// send to queue
		await this.documentQueueService.sendDocumentRequestedEvent(
			new DocumentRequested(body.url)
		)
	}

	private get documentService(): DocumentService {
		return new DocumentService(
			database.getDocumentRepository()
		);
	}

	private get documentReferenceService(): DocumentReferenceService {
		return new DocumentReferenceService(
			database.getDocumentReferencesRepository()
		);
	}

	private get documentQueueService(): DocumentQueueService {
		return new DocumentQueueService(
			broker.getDocumentRequestedProducer(),
			broker.getDocumentCreatedProducer()
		);
	}
}
