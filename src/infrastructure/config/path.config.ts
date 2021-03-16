import path from "path";

interface PathConfig {
	development: PathConfigOption,
	test: PathConfigOption,
	production: PathConfigOption
}

interface PathConfigOption {
	rootFolder: string;
}

// TODO: find a better solution for configs
export const pathConfig: PathConfig = {
	development: {
		rootFolder: path.join(__dirname, '..', '..', '..')
	},
	test: {
		rootFolder: path.join(__dirname, '..', '..', '..')
	},
	production: {
		rootFolder: process.env["APPLICATION_PUBLIC_FOLDER"] || path.join(__dirname, '..', '..')
	},
};
