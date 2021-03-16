import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ProblemDocument } from "http-problem-details";
import { HttpException } from "../exceptions/http.exception";

function errorHandlingMiddleware(): ErrorRequestHandler {
	return (err: Error, _req: Request, res: Response, _next: NextFunction): Response => {
		// TODO: http problem details
		if (err instanceof HttpException) {
			return res.status(err.status).send(err.getProblemDocument());
		}
		// no known error return 500
		return res.status(500).send(new ProblemDocument({
			type: `https://httpstatuses.com/500`,
			status: 500
		}));
	}
}

export default errorHandlingMiddleware;
