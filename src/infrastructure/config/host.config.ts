interface HostConfig {
	development: HostConfigOption,
	test: HostConfigOption,
	production: HostConfigOption
}

interface HostConfigOption {
	baseUrl: string;
}

// TODO: find a better solution for configs
export const hostConfig: HostConfig = {
	development: {
		baseUrl: "http://localhost:3000"
	},
	test: {
		baseUrl: "http://localhost:3000"
	},
	production: {
		baseUrl: process.env["APPLICATION_BASE_URL"] || "localhost:80"
	},
};
