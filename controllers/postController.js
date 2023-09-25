const { Post } = require("../models/postModel");
const jwt = require("jsonwebtoken");

const createPost = async (req, res) => {
  try {
    let { title, body, device } = req.body;
    const obj = {
      title,
      body,
      device,
      author: req.userId,
    };
    const post = await Post.create(obj);
    res.status(201).json({ post });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

const getPost = async (req, res) => {
  try {
    const { device, page } = req.query;
    let skip;
    if (page) skip = (page - 1) * 3;
    else skip = 0;
    let query = { author: req.userId };
    if (device) {
      query.device = device;
    }
    const postdata = await Post.find(query).skip(skip).limit(3);
    res.status(200).json(postdata);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Update Error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete Error" });
  }
};

module.exports = {
  createPost,
  getPost,
  updatePost,
  deletePost,
};
