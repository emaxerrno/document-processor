import { HttpException } from "./http.exception";

export class NotFoundHttpException extends HttpException {
	constructor(message: string) {
		super(404, message);
	}
}
