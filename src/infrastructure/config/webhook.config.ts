interface WebHookConfig {
	development: WebHookConfigOption,
	test: WebHookConfigOption,
	production: WebHookConfigOption
}

interface WebHookConfigOption {
	subscribers: string[];
}

// TODO: find a better solution for configs
export const webHookConfig: WebHookConfig = {
	development: {
		subscribers: [
			"http://localhost:5000"
		]
	},
	test: {
		subscribers: [

		]
	},
	production: {
		subscribers: [

		]
	}
}
