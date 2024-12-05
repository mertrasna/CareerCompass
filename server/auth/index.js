const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();
const bcrypt = require('bcrypt');
const path = require("path");
const multer = require('multer');

// models
const UsersModel = require("../models/Users"); // Import Users model
const PostModel = require("../models/Post");

const app = express();
app.use(express.json());
app.use(cors());

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // File name with unique suffix
  }
});

const upload = multer({ storage: storage });

mongoose.connect("mongodb+srv://rachelaranjo:rachel123@cluster1.rr3or.mongodb.net/career");

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connected successfully');
});


app.post('/register', async (req, res) => {
    const { firstName, lastName, username, email, password,role } = req.body;
  
    console.log('Registering new user with username:', username);
  
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    const existingUser = await UsersModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UsersModel.create({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role,
        verified: false,
        subscriptionType: 'basic',
      });
  
      console.log('New user created:', newUser);
      
      // Return success flag and user info
      res.json({ success: true, user: newUser });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Error creating user", error: err.message });
    }
  });
  
  
  // Route for user login
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    console.log('Login attempt for username:', username);
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    try {
      const user = await UsersModel.findOne({ username });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
  
      console.log('Login successful for username:', username);
      res.json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
  });
  

  // Server Listening
app.listen(3002, () => {
  console.log("Server is running on port 3002");
});