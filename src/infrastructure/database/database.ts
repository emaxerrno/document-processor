import { Repository, Sequelize } from "sequelize-typescript";
import { databaseConfig, DatabaseEnvironment } from "./config";
import { Document } from "../../domain/documents/document.model";
import { DocumentReference } from "../../domain/documents/documentReference.model";

const env: DatabaseEnvironment = (process.env["NODE_ENV"] as DatabaseEnvironment) || "development";
const sequelize = new Sequelize({
  database: databaseConfig[env].database,
	username: databaseConfig[env].username,
	password: databaseConfig[env].password,
	host: databaseConfig[env].host,
	dialect: databaseConfig[env].dialect,
  models: [Document, DocumentReference],
  repositoryMode: true,
});

class Database {
	public readonly sequelize: Sequelize;

	constructor(sequelize: Sequelize) {
		this.sequelize = sequelize;
	}

	public getDocumentRepository(): Repository<Document> {
		return sequelize.getRepository(Document);
	}

	public getDocumentReferencesRepository(): Repository<DocumentReference> {
		return sequelize.getRepository(DocumentReference);
	}
};

export default new Database(sequelize);
