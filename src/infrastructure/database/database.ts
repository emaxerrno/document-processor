import { Sequelize } from "sequelize-typescript";
import { databaseConfig, DatabaseEnvironment } from "./config";

const env: DatabaseEnvironment = (process.env["NODE_ENV"] as DatabaseEnvironment) || "development";
const sequelize = new Sequelize({
  database: databaseConfig[env].database,
	username: databaseConfig[env].username,
	password: databaseConfig[env].password,
	host: databaseConfig[env].host,
	dialect: databaseConfig[env].dialect,
  repositoryMode: true,
});

class Database {
	public readonly sequelize: Sequelize;

	constructor(sequelize: Sequelize) {
		this.sequelize = sequelize;
	}
};

export default new Database(sequelize);
