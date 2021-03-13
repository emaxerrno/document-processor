import { NextFunction, Request, RequestHandler, Response } from "express";

function notFoundRoute(): RequestHandler {
	return (_req: Request, _res: Response, next: NextFunction) => {
		// TODO: error
		next(new Error("Not found"));
	}
}

export default notFoundRoute;
