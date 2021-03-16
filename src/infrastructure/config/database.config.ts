import { Dialect } from "sequelize/types";

interface DatabaseConfig {
	development: DatabaseConfigOption,
	test: DatabaseConfigOption,
	production: DatabaseConfigOption
}

interface DatabaseConfigOption {
	username?: string;
	password?: string;
	database?: string;
	host?: string;
	dialect: Dialect
}

// TODO: find a better solution for configs
export const databaseConfig: DatabaseConfig = {
	development: {
		username: 'postgres',
		password: 'changeme',
		database: 'challenge_js',
		host: 'localhost',
		dialect: 'postgres',
	},
	test: {
		username: 'postgres',
		password: 'changeme',
		database: 'challenge_js',
		host: 'localhost',
		dialect: 'postgres',
	},
	production: {
		username: process.env["POSTGRES_USER"],
		password: process.env["POSTGRES_PASSWORD"],
		database: process.env["POSTGRES_DATABASE"],
		host: 'postgres',
		dialect: 'postgres',
	},
};
