import express from "express";
import multer from "multer";
import { createEvent, getAllEvents,deleteEvent,updateEvent } from "../controllers/eventController.js";
import fs from "fs";
import mongoose from "mongoose";
import Event from "../models/Event.js";

const router = express.Router();

const uploadPath = "uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post(
  "/create",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 }
  ]),
  createEvent
);

router.delete("/:id", deleteEvent);

router.put(
  "/:id",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 }
  ]),
  updateEvent
);

router.get("/all", getAllEvents);



router.get("/:id", async (req, res) => {
  try {
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("ERROR in GET /api/events/:id →", {
      id: req.params.id,
      error: err.message,
      stack: err.stack
    });
    res.status(500).json({ 
      message: "Server error while fetching event",
      error: err.message 
    });
  }
});

export default router;