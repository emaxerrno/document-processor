interface KafkaConfig {
	development: KafkaConfigOption,
	test: KafkaConfigOption,
	production: KafkaConfigOption
}

interface KafkaConfigOption {
	clientId?: string;
	brokers?: string[];
}

export const kafkaConfig: KafkaConfig = {
	development: {
		clientId: 'challenge-js',
		brokers: ['localhost:29092']
	},
	test: {
		clientId: 'challenge-js',
		brokers: ['localhost:29092']
	},
	production: {
		clientId: 'challenge-js',
		brokers: ['kafka:9092']
	},
};
