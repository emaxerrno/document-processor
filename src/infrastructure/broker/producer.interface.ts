export interface IQueueProducer<T> {
	send(key: string, value: T): Promise<void>;
}
