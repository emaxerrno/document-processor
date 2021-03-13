import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ValidationException } from "../exceptions/validation.exception";

function errorHandlingMiddleware(): ErrorRequestHandler {
	return (err: Error, _req: Request, res: Response, _next: NextFunction): Response => {
		if (err instanceof ValidationException) {
			return res.status(422).json(err);
		}
		// TODO: http problem details
		return res.status(500).send({ message: err.message });
	}
}

export default errorHandlingMiddleware;
