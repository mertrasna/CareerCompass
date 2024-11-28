// postSeeders.js

const mongoose = require("mongoose");
const faker = require("faker");
const PostModel = require("./Post"); // Adjust the path to the Post model
const UsersModel = require("./Users"); // Adjust the path to the Users model

// Skills to be randomly assigned
const SKILLS = [
  "Microsoft Office", "Excel", "Accounting", "JavaScript", "React",
  "Data Analysis", "Project Management", "Python", "Java",
  "C++", "Machine Learning", "Marketing", "Sales", "Communication",
  "Team Leadership", "Problem Solving", "Time Management", "SQL",
  "Cybersecurity", "Network Administration"
];

// Connect to the CareerCompass MongoDB database
mongoose.connect("mongodb+srv://rachelaranjo:rachel123@cluster1.rr3or.mongodb.net/career", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB connected successfully");
});

// Function to generate a random job post
const generateFakeJobPost = async (employerId) => {
  // Select random skills
  const selectedSkills = faker.helpers.shuffle(SKILLS).slice(0, faker.datatype.number({ min: 2, max: 5 }));

  const jobTypes = ["Remote", "Full-Time", "Part-Time", "Mini Job", "Internship", "Contract"];
  const salaryMin = faker.datatype.number({ min: 30000, max: 70000 });
  const salaryMax = faker.datatype.number({ min: salaryMin + 10000, max: salaryMin + 50000 });

  const newJob = new PostModel({
    title: faker.name.jobTitle(),
    location: faker.address.city(),
    jobType: faker.helpers.randomize(jobTypes),
    description: faker.lorem.paragraph(),
    requirements: faker.lorem.words(5).split(" "), // Example requirements
    skills: selectedSkills,
    companyName: faker.company.companyName(),
    companyLogo: `https://picsum.photos/100/100?random=${Math.random()}`,
    salaryRange: { min: salaryMin, max: salaryMax },
    applicationDeadline: faker.date.future(),
    postedBy: employerId, // Reference to an employer
  });

  await newJob.save();
  console.log(`Generated and saved job post: ${newJob.title}`);
};

// Function to seed job posts for existing employers
const seedJobPosts = async (numPosts) => {
  try {
    console.log(`Seeding ${numPosts} job posts...`);

    // Fetch all employers
    const employers = await UsersModel.find({ role: "employer" });

    if (employers.length === 0) {
      console.error("No employers found. Cannot seed job posts without employers.");
      return;
    }

    // Randomly assign posts to employers
    for (let i = 0; i < numPosts; i++) {
      const randomEmployer = faker.helpers.randomize(employers);
      await generateFakeJobPost(randomEmployer._id);
    }

    console.log(`${numPosts} job posts inserted successfully.`);
  } catch (error) {
    console.error("Error inserting job posts:", error);
  } finally {
    mongoose.disconnect();
  }
};

// Call the function to seed a specified number of job posts
seedJobPosts(20); // Adjust the number of job posts to generate
