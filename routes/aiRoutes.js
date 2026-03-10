import express from "express";
import multer from "multer";
import { generateAIImage } from "../controllers/aiController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/generate", upload.single("image"), generateAIImage);

export default router;