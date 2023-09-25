const express = require("express");
const router = express.Router();
const {
  createPost,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const jwt = require("jsonwebtoken");

const middleware = async (req, res, next) => {
  const token = req.header("Authtoken");
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
  try {
    let decoded = jwt.verify(token, process.env.secret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Authorization denied. Invalid token." });
  }
};

router.post("/create", middleware, createPost);
router.get("/", middleware, getPost);
router.patch("/update/:id", middleware, updatePost);
router.delete("/delete/:id", middleware, deletePost);

module.exports = router;
