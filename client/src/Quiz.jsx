import Cookies from 'js-cookie';
import React, { useState } from 'react';
import axios from 'axios'; // 


// Replace with your Adzuna App ID and API Key
const appId = "6e1ce45d";
const apiKey = "9939d5235fd78dee6f4aa9cf2b239580";

function Quiz() {
  // Mapping personality types to job-related keywords
  const jobKeywords = {
    ENTP: ["entrepreneur", "product manager", "consultant", "marketing", "startup"],
    ENFJ: ["teacher", "counselor", "public relations", "event planner"],
    INTJ: ["scientist", "software developer", "engineer", "philosopher"],
    INFP: ["writer", "artist", "psychologist", "social worker"],
    ESTJ: ["project manager", "banker", "administrator", "judge"],
    ISFP: ["musician", "artist", "photographer", "interior designer"],
    ISTP: ["mechanic", "engineer", "architect", "surgeon"],
    INFJ: ["psychiatrist", "therapist", "writer", "advocate"],
    // Add more personality types and corresponding job keywords as needed
  };

  const questions = [
    {
      question: "You enjoy vibrant social events with lots of people.",
      options: [
        { text: "Strongly Agree", value: 2 },
        { text: "Agree", value: 1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: -1 },
        { text: "Strongly Disagree", value: -2 },
      ],
    },
    {
      question: "You prefer to focus on facts and details rather than abstract concepts.",
      options: [
        { text: "Strongly Agree", value: -2 },
        { text: "Agree", value: -1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: 1 },
        { text: "Strongly Disagree", value: 2 },
      ],
    },
    {
      question: "You make decisions based more on logic than personal feelings.",
      options: [
        { text: "Strongly Agree", value: 2 },
        { text: "Agree", value: 1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: -1 },
        { text: "Strongly Disagree", value: -2 },
      ],
    },
    {
      question: "You prefer a planned, organized approach to life.",
      options: [
        { text: "Strongly Agree", value: 2 },
        { text: "Agree", value: 1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: -1 },
        { text: "Strongly Disagree", value: -2 },
      ],
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOptionClick = (value) => {
    setResponses([...responses, value]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
      fetchJobSuggestions();
    }
  };

  const fetchJobSuggestions = async () => {
    setLoading(true);

    // Calculate personality type based on responses
    const personalityType = calculatePersonalityType();
    const keywords = jobKeywords[personalityType] || [];
    savePersonalityType(personalityType);

    try {
      // Join keywords into a string to use in the API query
      const keywordQuery = keywords.join(","); // Example: "entrepreneur, consultant, marketing"
      
      // Fetch job listings from Adzuna API using the keyword query
      const response = await fetch(
        `http://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${appId}&app_key=${apiKey}&results_per_page=10&what=${keywordQuery}&content-type=application/json`
      );

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setJobSuggestions(data.results);
      } else {
        setJobSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching job suggestions:", error);
      setJobSuggestions([]);
    }

    setLoading(false);
  };

  const savePersonalityType = async (personalityType) => {
    try {
      // Retrieve username from cookies
      const username = Cookies.get('username');  // Assuming 'username' is stored in cookies
  
      if (!username) {
        console.error("Username not found in cookies.");
        return;
      }
  
      // Make an Axios POST request to save the personality type
      await axios.post('http://localhost:3001/api/savePersonalityType', {
        username,
        personalityType,
      });
  
      console.log("Personality type saved successfully!");
    } catch (error) {
      console.error("Error saving personality type:", error);
    }
  };
  

  const calculatePersonalityType = () => {
    // Logic to calculate personality type (e.g., ENTP, INTJ, etc.) based on quiz responses
    const types = [
      responses[0] >= 0 ? "E" : "I", // Extraverted vs Introverted
      responses[1] >= 0 ? "N" : "S", // Intuitive vs Sensing
      responses[2] >= 0 ? "T" : "F", // Thinking vs Feeling
      responses[3] >= 0 ? "J" : "P", // Judging vs Perceiving
    ];
    return types.join("");
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (showResult) {
    return (
      <div style={styles.container}>
        <h2>Job Suggestions</h2>
        {loading ? (
          <p>Loading job suggestions...</p>
        ) : jobSuggestions.length > 0 ? (
          jobSuggestions.map((job, index) => (
            <div key={index} style={styles.jobContainer}>
              <h4>{job.title}</h4>
              <p>Company: {job.company.display_name}</p>
              <p>Location: {job.location.display_name}</p>
              <a href={job.redirect_url} target="_blank" rel="noopener noreferrer">
                View Job
              </a>
            </div>
          ))
        ) : (
          <p>No job suggestions found.</p>
        )}
        <button style={styles.button} onClick={() => window.location.reload()}>
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Quiz</h2>
      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
      </div>
      <div style={styles.questionContainer}>
        <h3>{questions[currentQuestionIndex].question}</h3>
        <div style={styles.optionsContainer}>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <button
              key={index}
              style={styles.optionButton}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    background: "#F4F6F8",
    color: "#333",
    textAlign: "center",
    fontFamily: "'San Francisco', 'Helvetica Neue', sans-serif",
  },
  title: {
    fontSize: "36px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#1C1C1C",
  },
  progressBarContainer: {
    width: "100%",
    height: "10px",
    backgroundColor: "#ddd",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4A90E2",
    borderRadius: "5px",
  },
  questionContainer: {
    marginBottom: "30px",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    margin: "20px 0",
  },
  optionButton: {
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    background: "#4A90E2",
    color: "#fff",
    fontSize: "18px",
    transition: "background 0.3s",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  jobContainer: {
    margin: "20px 0",
    padding: "15px",
    background: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  button: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "10px",
    background: "#4A90E2",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
  },
};

export default Quiz;