import database from "../../infrastructure/database/database";
import { DocumentService } from "../../domain/documents/document.service";
import { CreateDocument } from "./models/createDocument.command";
import { IDocumentDto } from "./models/document.dto";
import { DocumentMapper } from "./mappers/document.mapper";

export class DocumentsController
{
	public async getDocuments(): Promise<IDocumentDto[]>
	{
		var result = await this.documentService.getList();
		return DocumentMapper.toDtoList(result);
	}

  public async createDocument(_body: CreateDocument): Promise<void>
	{
		// TODO
	}

	private get documentService(): DocumentService {
		return new DocumentService(database.getDocumentRepository());
	}
}
