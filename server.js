import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import eventRoutes from "./routes/eventRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/events", eventRoutes);
app.use("/api/", aiRoutes);


mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB Connected 🔥"))
.catch(err=>console.log(err));

app.listen(5000, ()=> console.log("Server running 5000 🚀"));