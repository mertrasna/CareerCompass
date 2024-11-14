//Users.js

const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }, 
    username: {
        type: String,
        required: true,
        unique: true // Ensure uniqueness of usernames
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure uniqueness of emails
    },
    password: {
        type: String,
        required: true
    },
    pfp: {
        type: String, // Profile picture URL
    },
    role: {
        type: String,
        enum: ['job_seeker', 'employer', 'admin'],
        default: 'job_seeker' // Role of the user in the platform
    },
    verified: {
        type: Boolean,
        default: false // Indicates if the user is verified
    },
    location: {
        type: String, // General location of the user
    },
    subscriptionType: {
        type: String,
        enum: ['basic', 'premium'],
        default: 'basic' // Subscription level of the user
    },
    education: {
        type: String, // Education details of the user
    },
    experience: [{
        company: String,
        role: String,
        startDate: Date,
        endDate: Date,
        description: String // Array of job experience objects
    }],
    skills: [String], // Array of skills for the user
    preferredJobType: {
        type: String,
        enum: ['full-time', 'part-time', 'remote', 'mini-job'] // Preferred type of job
    },
    personalityType: {
        type: String, // Result of the 16 Personalities Quiz
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post' // Reference to the Post model for user posts
    }],
    reported: {
        type: Boolean,
        default: false // Whether the user has been reported
    },
    createdAt: {
        type: Date,
        default: Date.now // Date of account creation
    },
    saved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post' // Reference to saved posts
    }],
    notificationsEnabled: {
        type: Boolean,
        default: true // User preference for notifications
    },
    languagePreference: {
        type: String,
        default: 'en' // Preferred language for user interface
    },
    lastLogin: {
        type: Date,
        default: Date.now // Last login time
    },
    authProvider: {
        type: String,
        enum: ['email', 'google'],
        default: 'email' // Authentication provider used for login
    }
});

const UsersModel = mongoose.model('Users', UsersSchema);

module.exports = UsersModel;
