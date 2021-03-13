import { Model, Table, Column, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement, Unique } from 'sequelize-typescript';
import { IsUrl } from 'class-validator';
import { Document } from './document.model';

@Table
export class DocumentReference extends Model {

	@PrimaryKey
	@AutoIncrement
	@Column
	id!: number;

	@ForeignKey(() => Document)
	@Column
	documentId!: number;

	@BelongsTo(() => Document)
	document!: Document;

	@IsUrl()
	@Unique(true)
	@Column
	url!: string;

}
