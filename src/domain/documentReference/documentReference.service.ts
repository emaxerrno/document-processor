import { Repository } from "sequelize-typescript";
import { FindOptions, Transaction } from "sequelize/types";
import { combineQueryOptions, IQueryOptions } from "../../infrastructure/database/queryOptions.model";
import { DocumentReference } from "./documentReference.model";
import { DocumentReferenceProcessingState } from "./documentReferenceProcessingState.enum";

export class DocumentReferenceService {
	constructor(private documentReferenceRepository: Repository<DocumentReference>) { }

	public async exists(url: string): Promise<boolean> {
		const result = await this.documentReferenceRepository
			.count({ where: { url: url } });

		return result > 0;
	}

	public async get(url: string, options?: IQueryOptions): Promise<DocumentReference | null> {
		return await this.documentReferenceRepository
			.findOne(this.defaultFindOptions(url, options));
	}

	public async getOrCreate(url: string, options?: IQueryOptions, transaction?: Transaction)
		: Promise<[documentReference: DocumentReference, created: boolean]> {

		return await this.documentReferenceRepository
			.findOrCreate({
				...this.defaultFindOptions(url, options),
				defaults: this.defaultCreateValues(url),
				transaction: transaction
			});
	}

	public async create(url: string, transaction?: Transaction): Promise<DocumentReference> {
		const documentReference = new DocumentReference(this.defaultCreateValues(url));

		return await this.documentReferenceRepository
			.create(documentReference, { transaction: transaction });
	}

	public async finishProcessing(id: number, documentId: number, transaction?: Transaction): Promise<void> {
		await this.documentReferenceRepository
			.update({
				documentId: documentId,
				state: DocumentReferenceProcessingState.FINISHED
			}, {
				where: { id: id },
				transaction: transaction
			});
	}

	public async rejectProcessing(id: number, reason: string, transaction?: Transaction): Promise<void> {
		await this.documentReferenceRepository
			.update({
				state: DocumentReferenceProcessingState.REJECTED,
				rejectedReason: reason
			}, {
				where: { id: id },
				transaction: transaction
			});
	}

	private defaultFindOptions(url: string, options?: IQueryOptions): FindOptions<DocumentReference> {
		const findOptions: FindOptions<DocumentReference> = { where: { url: url } };
		return combineQueryOptions(findOptions, options);
	}

	private defaultCreateValues(url: string) {
		return { url: url, state: DocumentReferenceProcessingState.REQUESTED };
	}

}
