import express from "express";
import {
  getPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
  getPostbyChannelId,
  Search,
} from "../controllers/posts.js";

const router = express.Router();



router.get("/", getPosts);
router.get("/search",Search);
router.get("/usr", getPostbyChannelId );
router.get("/:id", getSinglePost);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);


export default router;
