import DB from "../../../database/database"
import path from "path";
import { Consumer } from "kafkajs";
import { Transaction } from "sequelize/types";
import broker from "../../broker";
import { documentsPath } from "../../../routes/path.const";
import { FileUtils } from "../../../utils/file.utils";
import { UuidUtils } from "../../../utils/uuid.utils";
import { PdfUtils } from "../../../utils/pdf.utils";
import { HashUtils } from "../../../utils/hash.utils";
import { QueueConsumerBase } from "../base/consumer.base";
import { DocumentRequested } from "../../../../events/documents/documentRequested.event";
import { documentRequestedQueue } from "./documentRequested.queue";
import { DocumentReferenceService } from "../../../../domain/documentReference/documentReference.service";
import { DocumentReferenceProcessingState } from "../../../../domain/documentReference/documentReferenceProcessingState.enum";
import { InvalidPdfException } from "../../../exceptions/invalidPdf.exception";
import { DocumentService } from "../../../../domain/document/document.service";
import { DocumentQueueService } from "../../../../domain/document/document.queue.service";
import { DocumentCreated } from "../../../../events/documents/documentCreated.event";

export class DocumentRequestedConsumer extends QueueConsumerBase<DocumentRequested> {

	constructor(consumer: Consumer) {
		super(consumer, 10);
	}

	protected get topic(): string {
		return documentRequestedQueue;
	}

	protected async messageProcessor(message: DocumentRequested): Promise<void> {
		console.log(`Consuming message ${message.url}`);

		// initialize dependencies
		const documentService = new DocumentService(
			DB.getDocumentRepository()
		);
		const documentReferenceService = new DocumentReferenceService(
			DB.getDocumentReferencesRepository()
		);
		const documentQueueService = new DocumentQueueService(
			broker.getDocumentRequestedProducer(),
			broker.getDocumentCreatedProducer()
		)

		// create document reference (or get in case of retry execution)
		let documentReference = (await documentReferenceService.getOrCreate(message.url))[0];

		// check whether event has already been processed
		if (documentReference.state != DocumentReferenceProcessingState.REQUESTED) {
			console.log("Document reference already processed");
			return;
		}

		// process document
		try {

			// get file
			const pdfFileResult = await FileUtils.getFile(message.url);
			const pdfFileResultBuffer = Buffer.from(pdfFileResult);

			// get hash
			const pdfFileHash = HashUtils.generate(pdfFileResultBuffer);

			// check if document with hash already exists
			// - in case it does, add to references
			const document = await documentService.get(pdfFileHash);
			if (document) {
				await documentReferenceService.finishProcessing(documentReference.id, document.id);
				// since document already exists, we can skip processing
				return;
			}

			// generate potential file names
			const [pdfFileName, pdfFilePath, thumbnailFileName, thumbnailFilePath] = this.generateFilePaths();

			let transaction!: Transaction;
			try {
				// get thumbnail
				const thumbnailResultBuffer = await PdfUtils.generateThumbnail(pdfFileResultBuffer, 0.2);

				// save files
				await this.saveToFileSystem(pdfFilePath, pdfFileResultBuffer, thumbnailFilePath, thumbnailResultBuffer);

				// save in database
				transaction = await DB.sequelize.transaction();

				// TODO: can I do this without transaction in sequelize?
				const newDocument = await documentService.create(pdfFileHash, pdfFileName, thumbnailFileName, transaction);
				await documentReferenceService.finishProcessing(documentReference.id, newDocument.id, transaction);

				// here it would be much better to use transactional outbox pattern or kafka connect
				// - instead of using having an open transaction and sending directly to broker
				await documentQueueService.sendDocumentCreatedEvent(newDocument.id, new DocumentCreated({
					path: newDocument.path,
					thumbnailPath: newDocument.thumbnailPath
				}));

				// commit transaction
				await transaction.commit();
			}
			catch (error) {
				// rollback transaction
				await transaction?.rollback();

				// clean any created file
				try {
					await FileUtils.removeFile(pdfFilePath);
				}
				catch (_) { }
				try {
					await FileUtils.removeFile(thumbnailFilePath);
				}
				catch (_) { }

				// rethrow
				throw error;
			}
		}
		catch (error) {
			// TODO: add to retry / dead-letter queue

			if (error instanceof InvalidPdfException && error.message.includes("Invalid PDF structure.")) {
				return;
			}

			// for now only mark as rejected
			console.error(error);
			await documentReferenceService.rejectProcessing(documentReference.id, `Processing error: ${error.message}`);
		}
	}

	private generateFilePaths(): [pdfFileName: string, pdfFilePath: string,
		thumbnailFileName: string, thumbnailFilePath: string] {

		var uuid = UuidUtils.getUuid().toString();
		const pdfFileName = `${uuid}.pdf`;
		const thumbnailFileName = `${uuid}.thumbnail.png`;

		const pdfFilePath = path.join(documentsPath, pdfFileName);
		const thumbnailFilePath = path.join(documentsPath, thumbnailFileName);

		return [pdfFileName, pdfFilePath, thumbnailFileName, thumbnailFilePath];
	}

	private async saveToFileSystem(pdfFilePath: string, pdfBuffer: Buffer,
		thumbnailFilePath: string, thumbnailBuffer: Buffer): Promise<void> {

		await FileUtils.writeFile(pdfFilePath, pdfBuffer);
		await FileUtils.writeFile(thumbnailFilePath, thumbnailBuffer);
	}

}
