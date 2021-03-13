import App from './app';

const app = new App();

async function main() {
	await app.initialize();
  app.listen();
}

main();
