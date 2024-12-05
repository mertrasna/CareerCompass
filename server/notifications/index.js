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


// Routes

app.post("/schedule-interview", async (req, res) => {
    const { employerUsername, seekerUsername, postId, interviewDate } = req.body;
  
    // Validate required fields
    if (!employerUsername || !seekerUsername || !postId || !interviewDate) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }
  
    try {
      const user = await UsersModel.findOne({ username: seekerUsername });
      if (!user) {
        return res.status(404).json({ success: false, message: "Job seeker not found." });
      }
  
      user.interviews = user.interviews || [];
      user.interviews.push({
        employerUsername,
        postId,
        interviewDate,
      });
  
      await user.save();
  
      return res.status(200).json({ success: true, message: "Interview scheduled successfully." });
    } catch (error) {
      console.error("Error scheduling interview:", error);
      return res.status(500).json({ success: false, message: "Internal server error." });
    }
  });

  app.get("/interview-notifications", async (req, res) => {
    const { username } = req.query;
  
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }
  
    try {
      const user = await UsersModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      const interviews = user.interviews || [];
  
      res.status(200).json({ success: true, interviews });
    } catch (error) {
      console.error("Error fetching interview notifications:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
  app.post("/log-notification", (req, res) => {
    const { notification } = req.body;
    console.log("Server-side log:", notification);
    res.status(200).json({ success: true });
  });
  app.get("/interview-schedule", async (req, res) => {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ success: false, message: "Username required." });
    }
    const user = await UsersModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, interviews: user.interviews || [] });
  });

  // Server Listening
app.listen(3007, () => {
    console.log("Server is running on port 3007");
  });
