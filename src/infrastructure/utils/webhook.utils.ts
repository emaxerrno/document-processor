import axios from "axios";
import { webHookConfig } from "../config/webhook.config";
import { environment as env } from "./../environment/environment";

interface IWebHookPayload {
	type: string;
	event: string;
	data: {}
}

export class WebHookUtils {

	public static async sendWebHook(payload: IWebHookPayload): Promise<void> {
		console.log(`ENV ${env}`);
		webHookConfig[env].subscribers.map(async (url) => {
			console.log(`WEBHOOK ${url}`)
			// TODO: persist task, add exponential backoff, etc
			// possibly use redis task queue
			try {
				// send an HTTP POSt
				await axios({
					method: 'post',
					url: url,
					data: payload
				});
			}
			catch (error) {
				console.error(`Error sending webhook to ${url}.`, error);
			}
		});
	}

}
