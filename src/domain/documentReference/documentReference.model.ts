import { Model, Table, Column, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement, Unique, DataType } from 'sequelize-typescript';
import { IsUrl } from 'class-validator';
import { Document } from '../document/document.model';
import { DocumentReferenceProcessingState } from './documentReferenceProcessingState.enum';

@Table
export class DocumentReference extends Model {

	@PrimaryKey
	@AutoIncrement
	@Column
	id!: number;

	@ForeignKey(() => Document)
	@Column
	documentId?: number;

	@BelongsTo(() => Document)
	document?: Document;

	@IsUrl()
	@Unique(true)
	@Column
	url!: string;

	@Column({ type: DataType.ENUM({ values: Object.keys(DocumentReferenceProcessingState) }) })
  state!: DocumentReferenceProcessingState;

	@Column
	rejectedReason?: string;

}
