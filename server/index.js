const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();
const bcrypt = require('bcrypt');
const path = require("path");
const multer = require('multer');

// models
const UsersModel = require("./models/Users"); // Import Users model
const PostModel = require("./models/Post");

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





// Route to fetch user data based on username
app.post('/userdata', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }

    // Find the user by username
    const user = await UsersModel.findOne({ username }).lean(); // Use .lean() for faster reads

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Respond with user data (you can modify the response to send more/less data as needed)
    res.json({ success: true, user: user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Route to update profile picture
app.post('/updateProfilePic', upload.single('profilePic'), async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ success: false, message: "No profile picture uploaded." });
  }

  const { username } = req.body;
  const profilePicUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  try {
    const user = await UsersModel.findOneAndUpdate(
      { username },
      { pfp: profilePicUrl }, // Update the profile picture URL in the user's document
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Respond with the updated profile picture URL
    res.json({ success: true, message: "Profile picture updated successfully", profilePicUrl });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

app.post('/complete-profile', async (req, res) => {
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

  console.log('Profile update request received:', req.body);

  // Validate username existence
  if (!username) {
    return res.status(400).json({ success: false, message: "Username is required" });
  }

  try {
    // Find the user by username
    const user = await UsersModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log('User found:', user.username);

    // Prepare the fields to update
    const updatedFields = {};

    // Update only fields provided in the request
    if (dob) updatedFields.dob = dob;
    if (location) updatedFields.location = location;
    if (role) updatedFields.role = role;
    if (subscription) updatedFields.subscriptionType = subscription;
    if (skills) updatedFields.skills = skills;
    if (preferredJobType) updatedFields.preferredJobType = preferredJobType;
    if (companyName) updatedFields.companyName = companyName;
    if (contactNumber) updatedFields.contactNumber = contactNumber;

    // Perform the update
    const updatedUser = await UsersModel.findByIdAndUpdate(
      user._id,
      { $set: updatedFields },
      { new: true }
    );

    console.log('Profile updated successfully:', updatedUser);
    res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error('Error during profile update:', error);
    res.status(500).json({ success: false, message: "Error completing profile", error: error.message });
  }
});




// Payment API
app.post("/payment", async (req, res) => {
  const { username, cardNumber, expiryDate, cvv } = req.body;

  try {
    const user = await UsersModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Simulate payment processing (e.g., check card details, etc.)
    if (
      user.cardDetails.cardNumber === cardNumber &&
      user.cardDetails.expiryDate === expiryDate &&
      user.cardDetails.cvv === cvv
    ) {
      return res.status(200).json({ success: true, message: "Payment successful" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid card details" });
    }
  } catch (error) {
    console.error("Error during payment processing:", error);
    return res.status(500).json({ success: false, message: "Payment failed" });
  }
});

// Wallet payment endpoint
app.post("/wallet-payment", async (req, res) => {
  const { username, amount } = req.body;

  // Validate the request body
  if (!username || !amount) {
    return res.status(400).json({ success: false, message: "Missing username or amount" });
  }

  try {
    // Find the user by username
    const user = await UsersModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the user has enough wallet balance
    if (user.wallet.balance >= amount) {
      // Deduct the amount from the wallet balance
      user.wallet.balance -= amount;

      // Save the updated user data
      await user.save();

      // Respond with success and the new balance
      return res.status(200).json({
        success: true,
        message: "Payment successful!",
        newBalance: user.wallet.balance,
      });
    } else {
      return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
    }
  } catch (error) {
    console.error("Error processing wallet payment:", error.message);
    return res.status(500).json({ success: false, message: "An error occurred during payment", error: error.message });
  }
});

// Backend - Express route to save personality type
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

app.delete("/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.findByIdAndDelete(postId);
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ success: false, message: "Failed to delete post" });
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





// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Server Listening
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});