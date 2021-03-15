import { Repository } from "sequelize-typescript";
import { Transaction } from "sequelize/types";
import { Document } from "./document.model";

export class DocumentService {
	constructor(private documentRepository: Repository<Document>) {}

	public async get(hash: string): Promise<Document | null> {
		return await this.documentRepository
			.findOne({ where: { hash: hash } });
	}

	public async getList(): Promise<Document[]> {
		// TODO: pagination
		return await this.documentRepository
			.findAll({ order: [['id', 'asc']] });
	}

	public async create(hash: string, path: string, thumbnailPath: string, transaction?: Transaction): Promise<Document> {

		return await this.documentRepository
			.create({
				hash: hash,
				path: path,
				thumbnailPath: thumbnailPath,
				documentReferences: []
			}, {
				transaction: transaction
			});
	}

}
