import DB from "../../../database/database"
import path from "path";
import { Consumer } from "kafkajs";
import { documentsPath } from "../../../routes/path.const";
import { FileUtils } from "../../../utils/file.utils";
import { UuidUtils } from "../../../utils/uuid.utils";
import { PdfUtils } from "../../../utils/pdf.utils";
import { QueueConsumerBase } from "../base/consumer.base";
import { DocumentRequested } from "../../../../events/documents/documentRequested.event";
import { documentRequestedQueue } from "./documentRequested.queue";
import { DocumentReferenceService } from "../../../../domain/documentReference/documentReference.service";
import { DocumentReferenceProcessingState } from "../../../../domain/documentReference/documentReferenceProcessingState.enum";
import { InvalidPdfException } from "../../../exceptions/invalidPdf.exception";

export class DocumentRequestedConsumer extends QueueConsumerBase<DocumentRequested> {

	constructor(consumer: Consumer) {
		super(consumer, 10);
	}

	protected async messageProcessor(message: DocumentRequested): Promise<void> {
		console.log(`Consuming message ${message.url}`);

		const documentReferenceService = new DocumentReferenceService(
			DB.getDocumentReferencesRepository()
		);

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

			// get thumbnail
			const thumbnailResultBuffer = await PdfUtils.generateThumbnail(pdfFileResultBuffer, 0.3);

			// save to file
			await this.saveToFileSystem(pdfFileResultBuffer, thumbnailResultBuffer);

			// save to database
		}
		catch (error) {
			// TODO: add to dead-letter queue

			if (error instanceof InvalidPdfException && error.message.includes("Invalid PDF structure.")) {
				return;
			}
			// some other error handling?

			console.error(error);
			// rethrow or persist failure?
		}
	}

	protected get topic(): string {
		return documentRequestedQueue;
	}

	private async saveToFileSystem(pdfBuffer: Buffer, thumbnailBuffer: Buffer): Promise<void> {
		var uuid = UuidUtils.getUuid().toString();
		const pdfFileName = `${uuid}.pdf`;
		const thumbnailFileName = `${uuid}.thumbnail.png`;

		const pdfFilePath = path.join(documentsPath, pdfFileName);
		const thumbnailFilePath = path.join(documentsPath, thumbnailFileName);

		try {
			await FileUtils.writeFile(pdfFilePath, pdfBuffer);
			await FileUtils.writeFile(thumbnailFilePath, thumbnailBuffer);
		}
		catch (error) {
			// clean any created file
			try {
				await FileUtils.removeFile(pdfFilePath);
			}
			catch (_) {}
			try {
				await FileUtils.removeFile(thumbnailFilePath);
			}
			catch (_) {}

			// rethrow
			throw error;
		}
	}

}
