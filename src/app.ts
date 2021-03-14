import express from "express";
import DB from './infrastructure/database/database';
import errorHandlingMiddleware from "./infrastructure/middleware/errorHandling.middleware";
import notFoundRoute from "./infrastructure/routes/notFound.route";
import Routes from "./api/routes";
import StaticRoutes from "./infrastructure/routes/static.route";
import Broker from "./infrastructure/broker/broker";
import { Server } from "node:http";

class App {
	public readonly app: express.Application;
	public readonly port: string | number;
	public readonly env: string;

	constructor() {
		this.app = express();
		this.port = process?.env?.['PORT'] || 3000;
		this.env = process?.env?.['NODE_ENV'] || 'development';
	}

	public async initialize(): Promise<void> {
		await this.initializeDatabase();
		await this.initializeBroker();
		this.initializeMiddlewares();
		this.initializeRoutes();
		this.initializeErrorHandling();
	}

	public listen(): Server {
		return this.app.listen(this.port, () => {
			console.log("Server is running on port", this.port);
		});
	}

	private async initializeDatabase(): Promise<void> {
		await DB.sequelize.authenticate();
		// TODO: remove and use migrations
		await DB.sequelize.sync({ force: false });
	}

	private async initializeBroker(): Promise<void> {
		await Broker.initialize();
	}

	private initializeMiddlewares(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private initializeRoutes(): void {
		this.app.use('/api/v1', Routes);
		this.app.use('/public', StaticRoutes)
		this.app.use(notFoundRoute());
	}

	private initializeErrorHandling(): void {
		this.app.use(errorHandlingMiddleware());
	}
}

export default App;
