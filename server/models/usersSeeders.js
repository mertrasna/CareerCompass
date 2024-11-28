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

// Function to generate fake user with optional card details
const generateFakeUser = async () => {
    const numFollowers = faker.datatype.number({ min: 0, max: 10 });
    const numFollowing = faker.datatype.number({ min: 0, max: 10 });

    // Simulate card details for some users (randomly decide)
    const addCardDetails = faker.datatype.boolean(); // Randomly decide if the user will have card details

    console.log(`Generating user. Will include card details: ${addCardDetails}`); // Debugging line

    // Generate the new user
    const newUser = new UsersModel({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        pfp: `https://picsum.photos/100/100?random=${Math.random()}`,
        createdAt: faker.date.past(),
        followers: [],
        following: [],
        // If card details should be generated, add them; otherwise, leave as empty object
        cardDetails: addCardDetails ? {
            cardNumber: faker.finance.creditCardNumber(),
            expiryDate: (() => {
                const futureDate = faker.date.future(); // Generate a future date
                const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Get month and pad with leading zero if needed
                const year = String(futureDate.getFullYear()).slice(2); // Get last two digits of the year
                return `${month}/${year}`; // Return in MM/YY format
            })(),
            cardHolderName: faker.name.findName(),
            cardType: faker.random.arrayElement(['Visa', 'MasterCard', 'American Express', 'Discover']),
            cvv: faker.finance.creditCardCVV()
        } : {},  // If no card details, leave it as an empty object
        wallet: {
            balance: 0,  // Initialize balance as 0
        },
    });

    // Debugging the user's card details
    if (addCardDetails) {
        console.log(`Card details for ${newUser.username}:`, newUser.cardDetails);
    } else {
        console.log(`No card details for ${newUser.username}.`);
    }

    // Save the new user to the database
    await newUser.save();

    console.log(`Generated and saved user: ${newUser.username}`);
    return newUser;
};

// Function to create and save a specified number of fake users
const seedFakeUsers = async (numUsers) => {
    try {
        // Ensure we have no errors while seeding
        console.log(`Starting to seed ${numUsers} fake users...`);
        
        for (let i = 0; i < numUsers; i++) {
            await generateFakeUser(); // Generate a fake user and save it
        }

        console.log(`${numUsers} fake users inserted successfully with wallet and optional card details.`);
    } catch (error) {
        console.error('Error inserting fake users:', error);
    } finally {
        mongoose.disconnect();
    }
};

// Call the function to generate a specified number of fake users (adjust as needed)
seedFakeUsers(14); // Modify the number of users to be generated here