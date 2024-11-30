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
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pfp: {
        type: String, // Profile picture URL (can be updated or linked to a cloud storage service)
        required: false // Optional field
    },
    role: {
        type: String,
        enum: ['job_seeker', 'employer', 'admin']
    },
    preferredJobType: {
        type: String,
        enum: ['full-time', 'part-time', 'remote', 'mini-job'],
        default: 'full-time'
    },
    personalityType: {
        type: String, // Personality type, you can map it based on the quiz (e.g., INTJ, ENFP, etc.)
        required: false // Optional field
    },
    verified: {
        type: Boolean,
        default: false
    },
    location: {
        type: String,
    },
    subscriptionType: {
        type: String,
        enum: ['basic', 'premium'],
        default: 'basic'
    },
    education: [{
        degree: {
            type: String, // Degree or certification
            required: true
        },
        institution: {
            type: String, // Name of the educational institution
            required: true
        },
        startDate: {
            type: Date, // Start date of the education
        },
        endDate: {
            type: Date, // End date of the education
        },
        description: {
            type: String, // A brief description or details about the course
        }
    }],
    experience: [{
        company: String,
        role: String,
        startDate: Date,
        endDate: Date,
        description: String
    }],
    skills: [String],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    swipes: [{
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post' // Reference to the job post
        },
        status: {
            type: String,
            enum: ['yes', 'no'], // Job seeker’s swipe decision
            required: true
        },
        employerStatus: {
            type: String,
            enum: ['Pending', 'Reviewed', 'Rejected', 'Accepted'], // Employer's decision
            default: 'Pending'
        },
        swipedAt: {
            type: Date,
            default: Date.now // Timestamp of the swipe
        }
    }],
    reported: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    saved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    notificationsEnabled: {
        type: Boolean,
        default: true
    },
    languagePreference: {
        type: String,
        default: 'en'
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    authProvider: {
        type: String,
        enum: ['email', 'google'],
        default: 'email'
    },
    cardDetails: {
        cardNumber: {
            type: String,
            required: false
        },
        expiryDate: {
            type: String,
            required: false
        },
        cardHolderName: {
            type: String,
            required: false
        },
        cardType: {
            type: String,
            enum: ['Visa', 'MasterCard', 'American Express', 'Discover'],
            required: false
        },
        cvv: {
            type: String,
            required: false
        }
    },
    wallet: {
        balance: {
            type: Number,
            default: 70
        },
    },
    companyName: {
        type: String,
        required: function() { return this.role === 'employer'; }, // Only required for employers
        default: ''
    },
    contactNumber: {
        type: String,
        required: function() { return this.role === 'employer'; }, // Only required for employers
        default: ''
    },
    pdfData: { 
        type: String, 
        default: null // Base64 string for PDF data
      },
    documents: {
        type: String, // Profile picture URL (can be updated or linked to a cloud storage service)
        required: false // Optional field
    },
    interviews: [
        {
          employerUsername: { type: String, required: true },
          postId: { type: mongoose.Schema.Types.ObjectId, required: true },
          interviewDate: { type: Date, required: true },
        },
      ],
    });

const UsersModel = mongoose.model('Users', UsersSchema);

module.exports = UsersModel;