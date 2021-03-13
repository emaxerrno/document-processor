import express from "express";
import asyncHandler from 'express-async-handler';
import validationMiddleware from "../../infrastructure/middleware/validation.middleware";
import DocumentsController from "./documents.controller";
import CreateDocument from "./models/createDocument.command";

const router = express.Router();

// router.get("/", async (_req, res) => {
//   const controller = new PostController();
//   const response = await controller.getPosts();
//   return res.send(response);
// });

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

// router.get("/:id", async (req, res) => {
//   const controller = new PostController();
//   const response = await controller.getPost(req.params.id);
//   if (!response) res.status(404).send({message: "No post found"})
//   return res.send(response);
// });

export default router;
