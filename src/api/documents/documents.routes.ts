import express from "express";
import asyncHandler from 'express-async-handler';
import validationMiddleware from "../../infrastructure/middleware/validation.middleware";
import { DocumentsController } from "./documents.controller";
import { CreateDocument } from "./models/createDocument.command";

const router = express.Router();

router.get("/", asyncHandler(
	async (_: express.Request, res: express.Response) => {
		const controller = new DocumentsController();
		const response = await controller.getDocuments();
		return res.send(response);
	}
));

router.post("/",
	validationMiddleware(CreateDocument, 'body'),
	asyncHandler(
		async (req: express.Request, res: express.Response) => {
			const controller = new DocumentsController();
			const response = await controller.createDocument(req.body);
			return res.send(response);
		}
	)
);

export default router;
