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

app.post("/update-subscription", async (req, res) => {
    const { username, subscriptionType } = req.body;
  
    if (!username || !subscriptionType) {
      return res.status(400).json({ success: false, message: "Invalid request data." });
    }
  
    try {
      const user = await UsersModel.findOneAndUpdate(
        { username },
        { subscriptionType }, // Set subscription to the provided type
        { new: true } // Return the updated user
      );
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      res.status(200).json({
        success: true,
        message: `Subscription updated to ${subscriptionType}.`,
        user,
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
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


  app.post("/cancel-subscription", async (req, res) => {
    const { username } = req.body;
  
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required." });
    }
  
    try {
      const user = await UsersModel.findOneAndUpdate(
        { username },
        { subscriptionType: "basic" }, // Change subscription to "basic"
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      res.status(200).json({ success: true, message: "Subscription cancelled successfully." });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
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

  // Server Listening
app.listen(3004, () => {
  console.log("Server is running on port 3001");
});