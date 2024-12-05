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

app.post("/api/savePersonalityType", async (req, res) => {
    const { username, personalityType } = req.body;
  
    try {
      const user = await UsersModel.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Update the user's personality type
      user.personalityType = personalityType;
      await user.save();
  
      return res.status(200).json({ success: true, message: "Personality type saved successfully" });
    } catch (error) {
      console.error("Error saving personality type:", error);
      return res.status(500).json({ success: false, message: "Failed to save personality type" });
    }
  });
  
// Fetch user data
app.post("/userdata", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const user = await UsersModel.findOne({ username }).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Update profile picture
app.post("/updateProfilePic", upload.single("profilePic"), async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ success: false, message: "No profile picture uploaded." });
  }

  const { username } = req.body;
  const profilePicUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  try {
    const user = await UsersModel.findOneAndUpdate(
      { username },
      { pfp: profilePicUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile picture updated successfully", profilePicUrl });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Complete profile
app.post("/complete-profile", async (req, res) => {
  const {
    username,
    dob,
    location,
    role,
    companyName,
    contactNumber,
    skills,
    preferredJobType,
    subscription,
  } = req.body;

  try {
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const user = await UsersModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updatedFields = {};
    if (dob) updatedFields.dob = dob;
    if (location) updatedFields.location = location;
    if (role) updatedFields.role = role;
    if (subscription) updatedFields.subscriptionType = subscription;
    if (skills) updatedFields.skills = skills;
    if (preferredJobType) updatedFields.preferredJobType = preferredJobType;
    if (companyName) updatedFields.companyName = companyName;
    if (contactNumber) updatedFields.contactNumber = contactNumber;

    const updatedUser = await UsersModel.findByIdAndUpdate(
      user._id,
      { $set: updatedFields },
      { new: true }
    );

    res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Fetch user skills
app.get("/user-skills", async (req, res) => {
  const { username } = req.query;

  try {
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const user = await UsersModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, skills: user.skills || [] });
  } catch (error) {
    console.error("Error fetching user skills:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Upload document
app.post("/uploadDocument", upload.single("document"), async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ success: false, message: "No document uploaded." });
  }

  const { username } = req.body;
  const documentUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  try {
    const user = await UsersModel.findOneAndUpdate(
      { username },
      { $set: { documents: documentUrl } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Document uploaded successfully",
      documentUrl,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Fetch user location
app.get("/user-location", async (req, res) => {
  const { username } = req.query;

  try {
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const user = await UsersModel.findOne({ username });
    if (!user || !user.location) {
      return res.status(404).json({ success: false, message: "User location not found" });
    }

    res.json({ success: true, location: user.location });
  } catch (error) {
    console.error("Error fetching user location:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Delete account
app.delete("/delete-account", async (req, res) => {
  const { username } = req.body;

  try {
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }

    const deletedUser = await UsersModel.findOneAndDelete({ username });
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post('/updateCardDetails', async (req, res) => {
    const { username, cardDetails } = req.body;
  
    try {
      // Find the user by username and update card details
      const user = await UsersModel.findOneAndUpdate(
        { username },
        { $set: { cardDetails } }, // Update card details field
        { new: true } // Return the updated user document
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Card details updated successfully', user });
    } catch (err) {
      console.error("Error updating card details:", err);
      res.status(500).json({ message: 'Failed to update card details' });
    }
  });

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`User Service is running on port ${PORT}`);
});
