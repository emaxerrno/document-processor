import express from "express";

class App {
	public readonly app: express.Application;
	public readonly port: string | number;
	public readonly env: string;

	constructor() {
		this.app = express();
		this.port = process?.env?.['PORT'] || 3000;
		this.env = process?.env?.['NODE_ENV'] || 'development';
	}

	public async initialize() {
		this.initializeMiddlewares();
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log("Server is running on port", this.port);
		});
	}

	private initializeMiddlewares() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}
}

export default App;
