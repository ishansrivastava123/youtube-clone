import express from "express";
import { addComment, deleteComment, getComments } from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// Add A Comment

router.post("/add", verifyToken, addComment);

// Delete A Comment

router.delete("/:id", verifyToken, deleteComment);

// Get All Comments

router.get("/:videoId", getComments);

export default router;