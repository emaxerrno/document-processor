import { Document } from "../../../domain/document/document.model";
import { PathUtils } from "../../../infrastructure/utils/path.utils";
import { IDocumentDto } from "../models/document.dto";

export class DocumentMapper {
  public static toDto(document: Document): IDocumentDto {
    return {
      path: PathUtils.generateDocumentFullPath(document.path),
			thumbnailPath: PathUtils.generateDocumentFullPath(document.thumbnailPath),
			createdAt: document.createdAt
    }
  }

	public static toDtoList(documentList: Document[]): IDocumentDto[] {
		return documentList.map(this.toDto);
	}
}
