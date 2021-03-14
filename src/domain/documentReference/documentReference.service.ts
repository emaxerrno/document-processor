import { Repository } from "sequelize-typescript";
import { FindOptions } from "sequelize/types";
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

	public async getOrCreate(url: string, options?: IQueryOptions): Promise<[documentReference: DocumentReference, created: boolean]> {
		return await this.documentReferenceRepository
			.findOrCreate({
				...this.defaultFindOptions(url, options),
				defaults: this.defaultCreateValues(url)
			});
	}

	public async create(url: string): Promise<DocumentReference> {
		return await this.documentReferenceRepository
			.create(this.defaultCreateValues(url));
	}

	private defaultFindOptions(url: string, options?: IQueryOptions): FindOptions<DocumentReference> {
		const findOptions: FindOptions<DocumentReference> = { where: { url: url } };
		return combineQueryOptions(findOptions, options);
	}

	private defaultCreateValues(url: string) {
		return { url: url, state: DocumentReferenceProcessingState.REQUESTED };
	}

}
