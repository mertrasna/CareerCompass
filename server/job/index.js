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

app.get("/matched-job-seekers", async (req, res) => {
    const { username } = req.query;
  
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }
  
    try {
      // Find the employer based on username and role
      const employer = await UsersModel.findOne({ username, role: "employer" });
      if (!employer) {
        return res.status(404).json({ success: false, message: "Employer not found" });
      }
  
      // Fetch posts created by the employer
      const employerPosts = await PostModel.find({ postedBy: employer._id });
      const postIds = employerPosts.map((post) => post._id.toString());
  
      // Fetch matched job seekers
      const matchedJobSeekers = await UsersModel.find({
        role: "job_seeker",
        swipes: {
          $elemMatch: {
            jobId: { $in: postIds },
            status: "yes",
            employerStatus: { $ne: "Rejected" },
          },
        },
      })
        .select("username firstName lastName email skills preferredJobType swipes pdfData verified") // Include verified field
        .lean();
  
      // Attach postId to each matched job seeker
      const matchedJobSeekersWithPostId = matchedJobSeekers.map((seeker) => {
        const matchedSwipe = seeker.swipes.find(
          (swipe) => postIds.includes(swipe.jobId.toString()) && swipe.employerStatus !== "Rejected"
        );
        return {
          ...seeker,
          postId: matchedSwipe ? matchedSwipe.jobId : null,
        };
      });
  
      return res.status(200).json({
        success: true,
        matchedJobSeekers: matchedJobSeekersWithPostId,
      });
    } catch (err) {
      console.error("Error fetching matched job seekers:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.post("/process-decision", async (req, res) => {
    try {
      const { employerUsername, seekerUsername, postId, decision } = req.body;
  
      // Validate required fields
      if (!employerUsername || !seekerUsername || !postId || !decision) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      // Fetch employer and seeker to validate their existence
      const employer = await UsersModel.findOne({ username: employerUsername, role: "employer" });
      if (!employer) {
        return res.status(404).json({ success: false, message: "Employer not found" });
      }
  
      const seeker = await UsersModel.findOne({ username: seekerUsername, role: "job_seeker" });
      if (!seeker) {
        return res.status(404).json({ success: false, message: "Job seeker not found" });
      }
  
      // Find the swipe record
      const swipe = seeker.swipes.find((swipe) => swipe.jobId.toString() === postId);
      if (!swipe) {
        return res.status(404).json({ success: false, message: "Swipe record not found" });
      }
  
      // Update employerStatus based on decision
      if (decision === "yes") {
        swipe.employerStatus = "Accepted";
      } else {
        swipe.employerStatus = "Rejected";
      }
  
      // Save the updated seeker document
      await seeker.save();
  
      // Respond to the client
      res.status(200).json({
        success: true,
        message: decision === "yes" ? "Candidate accepted" : "Candidate rejected",
      });
    } catch (error) {
      console.error("Error processing decision:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  

  app.post("/posts", upload.single("companyLogo"), async (req, res) => {
    try {
      const {
        title,
        location,
        jobType,
        description,
        requirements,
        skills,
        companyName,
        salaryMin,
        salaryMax,
        applicationDeadline,
      } = req.body;
  
      // Retrieve employer's username from headers
      const username = req.headers.username; // Ensure this is being sent correctly from the client
  
      // Validate the username
      if (!username) {
        return res.status(400).json({ success: false, message: "Username is required" });
      }
  
      // Find the employer in the UsersModel
      const employer = await UsersModel.findOne({ username, role: "employer" });
      if (!employer) {
        return res.status(404).json({ success: false, message: "Employer not found" });
      }
  
      // Handle file upload for company logo
      const companyLogoUrl = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null;
  
      // Create the post
      const newPost = await PostModel.create({
        title,
        location,
        jobType,
        description,
        requirements: Array.isArray(requirements) ? requirements : [requirements],
        skills: Array.isArray(skills) ? skills : [skills],
        companyName,
        companyLogo: companyLogoUrl,
        salaryRange: { min: salaryMin, max: salaryMax },
        applicationDeadline,
        postedBy: employer._id, // Reference the employer
      });
  
      // Optionally update the employer's profile with the new post reference
      await UsersModel.findByIdAndUpdate(employer._id, { $push: { posts: newPost._id } });
  
      res.status(201).json({ success: true, post: newPost });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
  });

  app.get("/subscription", async (req, res) => {
    const { username } = req.query;
  
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required." });
    }
  
    try {
      const user = await UsersModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      res.status(200).json({ success: true, subscriptionType: user.subscriptionType });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  });


  app.get("/all-jobs", async (req, res) => {
    const { username } = req.query;
  
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }
  
    try {
      const user = await UsersModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Extract job IDs the user has swiped on
      const swipedJobIds = user.swipes.map((swipe) => swipe.jobId.toString());
  
      // Fetch jobs that the user hasn't swiped on
      const jobs = await PostModel.find({ _id: { $nin: swipedJobIds } });
  
      if (jobs.length === 0) {
        return res.status(200).json({ success: true, jobs: [] });
      }
  
      res.status(200).json({ success: true, jobs });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  app.get("/user-skills", async (req, res) => {
    const { username } = req.query;
  
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }
  
    try {
      const user = await UsersModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, skills: user.skills || [] });
    } catch (error) {
      console.error("Error fetching user skills:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });


  app.post("/swipe", async (req, res) => {
    try {
      const { username, jobId, status } = req.body;
  
      if (!username || !jobId || !status) {
        return res.status(400).json({ success: false, message: "Missing data" });
      }
  
      const user = await UsersModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      const existingSwipe = user.swipes.find((swipe) => swipe.jobId.toString() === jobId);
  
  if (existingSwipe) {
    existingSwipe.status = status;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Swipe status updated" });
  }
  
  // Save the new swipe
  user.swipes.push({ jobId, status });
  await user.save();
  
  res.status(200).json({ success: true, message: "Swipe recorded" });
  
    } catch (error) {
      console.error("Error saving swipe:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  

app.post("/employer-posts", async (req, res) => {
    try {
      const { username } = req.body;
  
      if (!username) {
        console.log("No username provided in request.");
        return res.status(400).json({ success: false, message: "Username is required" });
      }
  
      // Find the user by username using the correct model name
      const user = await UsersModel.findOne({ username });
  
      if (!user) {
        console.log(`No user found for username: ${username}`);
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      console.log(`Found user: ${username}, ObjectId: ${user._id}`);
  
      // Use the user's `_id` to fetch posts
      const employerPosts = await PostModel.find({ postedBy: user._id }).sort({ createdAt: -1 });
  
      if (employerPosts.length === 0) {
        console.log(`No posts found for ObjectId: ${user._id}`);
      } else {
        console.log(`Posts found for ObjectId: ${user._id}`, employerPosts);
      }
  
      res.status(200).json({ success: true, posts: employerPosts });
    } catch (error) {
      console.error("Error fetching employer posts:", error);
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
  });
  

  // Server Listening
app.listen(3006, () => {
  console.log("Server is running on port 3006");
});