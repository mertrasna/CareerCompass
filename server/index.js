const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();
const bcrypt = require('bcrypt');
const path = require("path");

// models
const UsersModel = require("./models/Users"); // Import Users model

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://rachelaranjo:rachel123@cluster1.rr3or.mongodb.net/career");

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connected successfully');
});

app.post('/register', async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

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
      role: 'job_seeker',
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

// Route for completing the profile
app.post('/complete-profile', async (req, res) => {
  const { username, dob, location, role, companyName, contactNumber, skills, subscription } = req.body;

  console.log('Profile completion request received for username:', username);

  // Validate incoming data
  if (!dob || !location || !role || (role === 'job_seeker' && (!skills || skills.length === 0))) {
    console.log('Validation failed: Missing required fields');
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  try {
    // Find user by username (instead of userId)
    const user = await UsersModel.findOne({ username });
    if (!user) {
      console.log('User not found for username:', username);
      return res.status(400).json({ message: "User not found" });
    }

    console.log('User found, updating profile for username:', username);

    // Update the user profile
    await UsersModel.findByIdAndUpdate(user._id, {
      $set: {
        dob,
        location,
        role,
        skills: role === "job_seeker" ? skills : [],
        companyName: role === "employer" ? companyName : undefined,
        contactNumber: role === "employer" ? contactNumber : undefined,
        subscriptionType: subscription || 'basic', // Default to 'basic' if subscription is not provided
      }
    });

    console.log('Profile updated successfully for username:', username);
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error('Error during profile update:', err);
    res.status(500).json({ message: "Error completing profile", error: err.message });
  }
});

// Server Listening
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
