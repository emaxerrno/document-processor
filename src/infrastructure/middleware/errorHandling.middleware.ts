import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/http.exception";
import { ValidationException } from "../exceptions/validation.exception";

function errorHandlingMiddleware(): ErrorRequestHandler {
	return (err: Error, _req: Request, res: Response, _next: NextFunction): Response => {
		if (err instanceof ValidationException) {
			return res.status(422).json(err);
		}
		// TODO: http problem details
		if (err instanceof HttpException) {
			return res.status(err.status).send({
				status: err.status,
				message: err.message
			});
		}
		// no known error return 500
		return res.status(500).send();
	}
}

export default errorHandlingMiddleware;
