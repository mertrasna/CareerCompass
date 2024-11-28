const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    jobType: {
      type: String,
      enum: ["Remote", "Full-Time", "Part-Time", "Mini Job", "Internship", "Contract"],
      required: true,
    },
    description: { type: String, required: true, trim: true },
    requirements: [{ type: String, required: true }],
    skills: [{ type: String, trim: true }],
    companyName: { type: String, required: true, trim: true },
    companyLogo: { type: String, default: null },
    salaryRange: {
      min: { type: Number, default: 0 },
      max: { type: Number },
    },
    applicationDeadline: { type: Date, required: true },
    applications: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        coverLetter: { type: String },
        status: {
          type: String,
          enum: ["Pending", "Reviewed", "Rejected", "Accepted"],
          default: "Pending",
        },
        appliedAt: { type: Date, default: Date.now },
      },
    ],
    keywords: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // Reference to employer
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", PostSchema);
module.exports = PostModel;
