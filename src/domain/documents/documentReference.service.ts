import { Repository } from "sequelize-typescript";
import { DocumentReference } from "./documentReference.model";

export class DocumentReferenceService {
	constructor(private documentReferenceRepository: Repository<DocumentReference>) { }

	public async exists(url: string): Promise<boolean> {
		const result = await this.documentReferenceRepository
			.count({ where: { url: url } });

		return result > 0;
	}

}
