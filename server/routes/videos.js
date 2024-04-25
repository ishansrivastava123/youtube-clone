import express from "express";
import { addVideo, addView, deleteVideo, getByTags, getVideo, random, search, trend, updateVideo } from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";
import { sub } from "../controllers/video.js";

const router = express.Router();

// Create A Video
router.post("/", verifyToken, addVideo);

// Update A Video
router.put("/:id", verifyToken, updateVideo);

// Delete A Video
router.delete("/:id", verifyToken, deleteVideo);

// Get A Video
router.get("/find/:id", getVideo);

//Increase Views
router.put("/view/:id", addView);

// Trending Videos
router.get("/trend", trend);

// Random Videos
router.get("/random", random);

// Get Subscribed Videos
router.get("/sub",verifyToken, sub);

// Tagged Videos
router.get("/tags", getByTags);

// Search Videos
router.get("/search", search);

export default router;