import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(
  express.urlencoded({
    limit: "30mb",
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    author: "AINHAJAR",
    message: "AINHAJAR's BLOG!",
  });
});

app.use("/blogs", postRoutes);

const PORT = process.env.PORT || 3003;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT} `);
    });
  })
  .catch((error) => {
    console.error(error.message);
  });


  /*
  router.get("/blogs", getPosts);
router.get("/blogs/search",Search);
router.get("/blogs/blogbychanid", getPostbyChannelId );
router.get("/blogs/blogbyid/:id", getSinglePost);
router.post("/blogs/createblog", createPost);
router.patch("//blogs/updateblog/:id", updatePost);
router.delete("/blogs/deleteblog/:id", deletePost);

  */