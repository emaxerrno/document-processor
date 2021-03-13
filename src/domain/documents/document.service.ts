import { Repository } from "sequelize-typescript";
import { Document } from "./document.model";

export class DocumentService {
	constructor(private documentRepository: Repository<Document>) {}

	public async getList(): Promise<Document[]>
	{
		// TODO: pagination
		return await this.documentRepository
			.findAll({ order: [['id', 'asc']] });
	}

}
