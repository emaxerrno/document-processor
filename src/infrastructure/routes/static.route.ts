import express from "express";
import { publicPath } from "./path.const";

const router = express.Router();

router.use("/", express.static(publicPath));

export default router;
