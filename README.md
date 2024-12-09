# CareerCompass

*CareerCompass* is an advanced job search and career management platform designed to connect job seekers with the right opportunities based on personalized insights. The platform integrates multiple services such as job matchmaking, user authentication, notifications, and secure payment options to enhance both the job-seeking and recruitment experience. With robust support for user profiles, job applications, and employer tools, CareerCompass aims to streamline the job search process while fostering growth and professional connections.

## Tech Stack

- *Frontend*: 
  - *React.js*: Component-based UI for a responsive and dynamic user experience.

- *Backend*: 
  - *Node.js*: Event-driven runtime for scalable server-side logic.
  - *Express.js*: Web framework for building robust APIs.

- *Database*: 
  - *MongoDB*: NoSQL database for flexible data storage, using Mongoose ODM for schema definitions and queries.

## Architecture

The project follows a microservices architecture with the following key components:

- *Client*: The frontend application (React + Vite).
- *Server*: Backend services handling various aspects of the platform.
  - *Auth Service*: Handles user authentication and authorization.
  - *User Service*: Manages user profile data and interactions.
  - *Job Service*: Manages job postings, recommendations, and matchmaking.
  - *Payment Service*: Handles subscription management and payments.
  - *Notifications Service*: Sends real-time notifications to users regarding job applications and other events.

Each service runs independently, ensuring modularity and ease of maintenance.

## Installation

### Prerequisites

Before setting up the project, ensure you have the following installed on your machine:

- *Node.js* (v18 or higher recommended)
- *MongoDB* (local instance or MongoDB Atlas for cloud storage)
- *Git* (for version control)

# Clone The Repository
To clone the repository to your local machine, run the following command:
`git clone https://github.com/mertrasna/careercompass.git`
`cd careercompass`

# For the Client (Frontend)
`cd client`

`npm install --legacy-peer-deps`


# For the server (Backend)
new terminal
`cd server/auth`
`npm start`

new terminal
`cd server/user`
`npm start`

new terminal
`cd server/job`
`npm start`

new terminal
`cd server/payment`
`npm start`

new terminal
`cd server/notification`
`npm start`

# For testing
`cd client/`

`npx vitest`

# Start Frontend
`cd client/`

`npm run dev`

The frontend will be available at http://localhost:5173/login.
