import { Dialect } from "sequelize/types";

export type DatabaseEnvironment = 'development' | 'test' | 'production';

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
