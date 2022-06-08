import Post from "../models/posts.js";
import jwt from "jsonwebtoken";

/* {
     "id": 2,
     "firstname": "abdelmoghit",
     "lastname": "idhsaine",
     "fullname": "abdelmoghit idhsaine",
     "email": "abdelmoghit1@gmail.com",
     "username": "abdelmoghit1",
     "signupDate": "2022-05-19T21:01:41.000Z",
     "isAdmin": false,
     "iat": 1652994755,
     "exp": 1653030755
 }*/

export const decode = (bearerToken) => {
  try {
    const tokenSecret="secret";

    const decodeAuthToken = (token, tokenSecret ) =>
          jwt.verify(token, tokenSecret);
    const decoded = decodeAuthToken(bearerToken, tokenSecret);
    decoded["success"] = true;
    console.log("Wayeeeeeeeh");
    return decoded;
  } catch (e) {
    console.log("walaaaaaaaaa",e);
    return { success: false };
  }
};

export const tokenBody = (req) => {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  const Body = decode(token);
  return Body;
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }

};

export const getPostbyChannelId = async (req, res) => {
  
  try {
    const id=req.query;
    const posts = await Post.findOne(id);
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const Search= async (req, res) => {
  const body = tokenBody(req);
  if (body["success"]){
  try {
  const filter = req.body.title;
  const filteredUsers = await Post.find({
    title: { $regex: "^" + filter },
  })
    .sort({ date: -1 })
  res.status(200).json(filteredUsers);
 } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}else {
  res.status(401).json("Unauthorized");
}
};

export const getSinglePost = async (req, res) => {
  
  try {
    const { id: _id } = req.params;
    const post = await Post.findById(_id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }

};

export const createPost = async (req, res) => {
  const body = tokenBody(req);
  if (body["success"]){
    req.body["author"]=body["username"];
    req.body["chanid"]=body["id"];
    const newPost = new Post(req.body);
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
}else {
  res.status(401).json("Unauthorized");
}
};

export const updatePost = async (req, res) => {
  const body = tokenBody(req);
  const { id: _id } = req.params;
  const postt = await Post.findById(_id);
  const post = req.body;
  if (body["success"]&&(body["username"]==postt["author"])){
  try {
    const updatedPost = await Post.findByIdAndUpdate(_id, post, { new: true });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
  }else {
    res.status(401).json("Unauthorized");
  }
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;
  const body = tokenBody(req);
  const post = await Post.findById(_id);
  if (body["success"]&&(body["username"]==post["author"])){
  try {
    const deletedPost = await Post.findByIdAndRemove(_id);
    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
}else {
  res.status(401).json("Unauthorized");
}
};
