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
router.get("/blogbychanid/:id", getPostbyChannelId );
router.get("/blogbyid/:id", getSinglePost);
router.post("/createblog", createPost);
router.patch("/updateblog/:id", updatePost);
router.delete("/deleteblog/:id", deletePost);


export default router;
