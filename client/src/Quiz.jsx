//importing necessary modules
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import Navbar from './Navbar';

//JOB API details
const appId = "6e1ce45d";
const apiKey = "9939d5235fd78dee6f4aa9cf2b239580";

//mapping personality type to keywords
function Quiz() {
  const jobKeywords = {
    ENTP: ["entrepreneur", "product manager", "consultant", "marketing", "startup"],
    ENFJ: ["teacher", "counselor", "public relations", "event planner"],
    INTJ: ["scientist", "software developer", "engineer", "philosopher"],
    INFP: ["writer", "artist", "psychologist", "social worker"],
    ESTJ: ["project manager", "banker", "administrator", "judge"],
    ISFP: ["musician", "artist", "photographer", "interior designer"],
    ISTP: ["mechanic", "engineer", "architect", "surgeon"],
    INFJ: ["psychiatrist", "therapist", "writer", "advocate"],
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
    {
      question: "You often find yourself in new situations and enjoy the challenge of adapting.",
      options: [
        { text: "Strongly Agree", value: 2 },
        { text: "Agree", value: 1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: -1 },
        { text: "Strongly Disagree", value: -2 },
      ],
    },
    {
      question: "You tend to avoid conflict and try to maintain harmony in your relationships.",
      options: [
        { text: "Strongly Agree", value: -2 },
        { text: "Agree", value: -1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: 1 },
        { text: "Strongly Disagree", value: 2 },
      ],
    },
    {
      question: "You prefer a flexible and spontaneous approach to life rather than a structured one.",
      options: [
        { text: "Strongly Agree", value: 2 },
        { text: "Agree", value: 1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: -1 },
        { text: "Strongly Disagree", value: -2 },
      ],
    },
    {
      question: "You are more interested in ideas and concepts than in facts and details.",
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
  const [hoveredOption, setHoveredOption] = useState(null);
  const [hoveredQuestion, setHoveredQuestion] = useState(false);

  const handleOptionClick = (value) => {
    setResponses([...responses, value]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
      fetchJobSuggestions();
    }
  };


  //fetching job suggestions using API
  const fetchJobSuggestions = async () => {
    setLoading(true);
    const personalityType = calculatePersonalityType();
    const keywords = jobKeywords[personalityType] || [];
    savePersonalityType(personalityType);
    try {
      const keywordQuery = keywords.join(",");
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

  // save personality type
  const savePersonalityType = async (personalityType) => {
    try {
      const username = Cookies.get('username');
      if (!username) {
        console.error("Username not found in cookies.");
        return;
      }
      await axios.post('http://localhost:3001/api/savePersonalityType', {
        username,
        personalityType,
      });
    } catch (error) {
      console.error("Error saving personality type:", error);
    }
  };

  
  const calculatePersonalityType = () => {
    const types = [
      responses[0] >= 0 ? "E" : "I",
      responses[1] >= 0 ? "N" : "S",
      responses[2] >= 0 ? "T" : "F",
      responses[3] >= 0 ? "J" : "P",
    ];
    return types.join("");
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (showResult) {
    return (
      <div style={styles.container}>
        <h2 style={styles.resultTitle}>ESFP</h2>
        {loading ? (
          <p>Loading job suggestions...</p>
        ) : jobSuggestions.length > 0 ? (
          <div style={styles.carouselContainer}>
            {jobSuggestions.map((job, index) => (
              <div key={index} style={styles.jobCard}>
                <h4>{job.title}</h4>
                <p>Company: {job.company.display_name}</p>
                <p>Location: {job.location.display_name}</p>
                <a href={job.redirect_url} target="_blank" rel="noopener noreferrer">
                  View Job
                </a>
              </div>
            ))}
          </div>
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
       <Navbar  />
      <div style={styles.progressBarContainer}>
        <div
          style={{
            ...styles.progressBar,
            width: `${progress}%`,
            transition: "width 0.5s ease-out",
          }}
        ></div>
      </div>
      <div style={styles.questionContainer}>
        <div
          style={{
            ...styles.questionBox,
            borderColor: hoveredQuestion ? "#007BFF" : "white",
            color: hoveredQuestion ? "#007BFF" : "white",
            backgroundColor: hoveredQuestion ? "white" : "transparent",
          }}
          onMouseEnter={() => setHoveredQuestion(true)}
          onMouseLeave={() => setHoveredQuestion(false)}
        >
          <h3 style={styles.questionNumber}>Question {currentQuestionIndex + 1} of {questions.length}</h3>
          <p>{questions[currentQuestionIndex].question}</p>
        </div>
        <div style={styles.optionsContainer}>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <button
              key={index}
              style={{
                ...styles.optionButton,
                borderColor: hoveredOption === index ? "#007BFF" : "#ddd",
                color: hoveredOption === index ? "#007BFF" : "#fff",
              }}
              onClick={() => handleOptionClick(option.value)}
              onMouseEnter={() => setHoveredOption(index)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <span style={styles.optionCircle}>{String.fromCharCode(65 + index)}</span> {option.text}
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
    background: "#FF7518",
    color: "#333",
    textAlign: "center",
    fontFamily: "'San Francisco', 'Helvetica Neue', sans-serif",
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
    width: "80%",
    maxWidth: "700px",
    margin: "20px 0",
  },
  questionBox: {
    border: "2px solid white",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
    transition: "all 0.3s",
  },
  questionNumber: {
    fontSize: "18px",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  optionButton: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    cursor: "pointer",
    background: "transparent",
    fontSize: "18px",
    transition: "all 0.3s",
    textAlign: "left",
  },
  optionCircle: {
    position: "absolute",
    top: "50%",
    left: "-20px",
    transform: "translateY(-50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "30px",
    height: "30px",
    backgroundColor: "#fff",
    color: "#007BFF",
    borderRadius: "50%",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  jobCard: {
    display: "flex",
    flexDirection: "column",
    width: "30%",
    margin: "10px",
    padding: "15px",
    background: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
  },
  carouselContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: "10px 0",
    marginTop: "20px",
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
  resultTitle: {
    fontSize: "36px",
    fontWeight: "bold",
    letterSpacing: "2px",
    color: "#fff",
    textTransform: "uppercase",
    marginBottom: "20px",
    fontFamily: "'Poppins', sans-serif",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)",
  },
  '@media (max-width: 768px)': {
    container: {
      padding: "10px",
    },
    questionContainer: {
      width: "90%",
    },
    questionBox: {
      padding: "15px",
    },
    optionButton: {
      fontSize: "16px",
      padding: "10px 18px",
    },
    jobCard: {
      width: "100%",
      marginBottom: "20px",
    },
  },
};

export default Quiz;