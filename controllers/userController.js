const { User } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRegister = async (req, res) => {
  try {
    const { name, email, gender, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ message: "Please login,User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = await User.create({
      name,
      email,
      gender,
      password: hashedPassword,
    });
    res.status(201).json(newuser);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

const userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const userPresent = await User.findOne({ email });
  
      if (!userPresent) {
        return res.status(404).json({ message: "User is not present" });
      }
  
      const check = await bcrypt.compare(password, userPresent.password);
  
      if (!check) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ userId: userPresent._id }, process.env.secret);
  
      res.json({ email, token });
    } catch (err) {
      console.error("Login Error:", err); 
  
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: "Validation Error", error: err.message });
      } else {
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
      }
    }
  };
  

module.exports = { userRegister, userLogin };
