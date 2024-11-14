// usersSeeders.js

const mongoose = require('mongoose');
const faker = require('faker');
const UsersModel = require('./Users'); // Adjust path as needed for your setup

// Connect to your CareerCompass MongoDB database
mongoose.connect("mongodb+srv://rachelaranjo:rachel123@cluster1.rr3or.mongodb.net/career", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connected successfully');
});

// Function to generate a fake user with followers and following relationships
const generateFakeUser = async (existingUsers) => {
    const numFollowers = faker.datatype.number({ min: 0, max: 10 });
    const numFollowing = faker.datatype.number({ min: 0, max: 10 });

    // Ensure existingUsers is an array
    existingUsers = existingUsers || [];

    // Select distinct random users from existingUsers as followers and following
    const followers = Array.from({ length: numFollowers }, () => faker.random.arrayElement(existingUsers));
    const following = Array.from({ length: numFollowing }, () => faker.random.arrayElement(existingUsers));

    // Remove duplicates from followers and following arrays
    const uniqueFollowers = Array.from(new Set(followers.map(user => user ? user._id : null).filter(id => id)));
    const uniqueFollowing = Array.from(new Set(following.map(user => user ? user._id : null).filter(id => id)));

    // Profile picture URL
    const pfp = `https://picsum.photos/100/100?random=${Math.random()}`;

    // Create a new user with a subset of schema fields
    const newUser = new UsersModel({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        pfp: pfp,
        createdAt: faker.date.past(),
        followers: uniqueFollowers,  // Add followers field if included in schema
        following: uniqueFollowing,  // Add following field if included in schema
        achievements: [], // Add achievements field if included in schema
    });

    // Save the new user
    await newUser.save();

    // Update existing users with new followers and following
    for (const existingUser of existingUsers) {
        // Update their following if the existing user is a follower of the new user
        if (uniqueFollowers.includes(existingUser._id) && !existingUser.following.includes(newUser._id)) {
            existingUser.following.push(newUser._id);
            await existingUser.save();
        }
        // Update their followers if the existing user is following the new user
        if (uniqueFollowing.includes(existingUser._id) && !existingUser.followers.includes(newUser._id)) {
            existingUser.followers.push(newUser._id);
            await existingUser.save();
        }
    }

    // Log each user's number of followers and add "popular" achievement if applicable
    await Promise.all(existingUsers.map(async (user) => {
        console.log(`${user.username} has ${user.followers.length} followers.`);
        
        // Add "popular" achievement if the user has more than 5 followers
        if (user.followers.length > 5 && !user.achievements.includes('popular')) {
            user.achievements.push('popular');
            await user.save();
        }
    }));

    return newUser;
};

// Function to create and save a specified number of fake users
const seedFakeUsers = async (numUsers) => {
    try {
        // Retrieve existing users
        const existingUsers = await UsersModel.find();

        for (let i = 0; i < numUsers; i++) {
            await generateFakeUser(existingUsers.slice()); // Clone existingUsers array
        }

        console.log(`${numUsers} fake users inserted successfully with followers/following relationships.`);
    } catch (error) {
        console.error('Error inserting fake users:', error);
    } finally {
        mongoose.disconnect();
    }
};

// Call the function with the desired number of fake users
seedFakeUsers(14);
