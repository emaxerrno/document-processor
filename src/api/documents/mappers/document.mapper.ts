import { Document } from "../../../domain/document/document.model";
import { IDocumentDto } from "../models/document.dto";

export class DocumentMapper {
  public static toDto(document: Document): IDocumentDto {
    return {
      path: document.path,
			thumbnailPath: document.thumbnailPath
    }
  }

	public static toDtoList(documentList: Document[]): IDocumentDto[] {
		return documentList.map(this.toDto);
	}
}
