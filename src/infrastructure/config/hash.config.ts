interface HashConfig {
	development: HashConfigOption,
	test: HashConfigOption,
	production: HashConfigOption
}

interface HashConfigOption {
	salt: number;
}

export const hashConfig: HashConfig = {
	development: {
		salt: 0x123,
	},
	test: {
		salt: 0x123
	},
	production: {
		salt: +(process.env["APPLICATION_HASH_SALT"] || 0x1928571423957219512)
	},
};
