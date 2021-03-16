import { HttpException } from "./http.exception";

export class ConflictHttpException extends HttpException {
	constructor(message: string) {
		super(409, message);
	}
}
