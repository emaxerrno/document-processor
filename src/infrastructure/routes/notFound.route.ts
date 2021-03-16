import { NextFunction, Request, RequestHandler, Response } from "express";
import { NotFoundHttpException } from "../exceptions/notFound.exception";

function notFoundRoute(): RequestHandler {
	return (_req: Request, _res: Response, next: NextFunction) => {
		next(new NotFoundHttpException("Not found."));
	}
}

export default notFoundRoute;
