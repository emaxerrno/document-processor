import express from "express";
import DocumentsRouter from "./documents/documents.routes";

const router = express.Router();

router.use("/documents", DocumentsRouter)

export default router;
