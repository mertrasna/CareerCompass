import React, { useState } from "react";

function Quiz() {
  // Sample questions for the 16 Personalities Quiz
  const questions = [
    {
      question: "You enjoy vibrant social events with lots of people.",
      options: [
        { text: "Strongly Agree", value: 2 },
        { text: "Agree", value: 1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: -1 },
        { text: "Strongly Disagree", value: -2 }
      ],
      category: "E" // Extraversion vs. Introversion
    },
    {
      question: "You often spend time exploring unrealistic yet intriguing ideas.",
      options: [
        { text: "Strongly Agree", value: 2 },
        { text: "Agree", value: 1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: -1 },
        { text: "Strongly Disagree", value: -2 }
      ],
      category: "N" // Intuition vs. Sensing
    },
    {
      question: "You often prefer to spend time with a few close friends rather than in large groups.",
      options: [
        { text: "Strongly Agree", value: -2 },
        { text: "Agree", value: -1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: 1 },
        { text: "Strongly Disagree", value: 2 }
      ],
      category: "E" // Extraversion vs. Introversion
    },
    {
      question: "You enjoy abstract theories and concepts, even if they are not immediately practical.",
      options: [
        { text: "Strongly Agree", value: 2 },
        { text: "Agree", value: 1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: -1 },
        { text: "Strongly Disagree", value: -2 }
      ],
      category: "N" // Intuition vs. Sensing
    },
    {
      question: "You tend to focus on facts and details rather than big-picture ideas.",
      options: [
        { text: "Strongly Agree", value: -2 },
        { text: "Agree", value: -1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: 1 },
        { text: "Strongly Disagree", value: 2 }
      ],
      category: "S" // Sensing vs. Intuition
    },
    {
      question: "You often follow your emotions rather than logic in making decisions.",
      options: [
        { text: "Strongly Agree", value: 2 },
        { text: "Agree", value: 1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: -1 },
        { text: "Strongly Disagree", value: -2 }
      ],
      category: "F" // Feeling vs. Thinking
    },
    {
      question: "You prefer a structured and organized approach to life over a spontaneous one.",
      options: [
        { text: "Strongly Agree", value: 2 },
        { text: "Agree", value: 1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: -1 },
        { text: "Strongly Disagree", value: -2 }
      ],
      category: "J" // Judging vs. Perceiving
    },
    {
      question: "You enjoy having a wide variety of activities and interests.",
      options: [
        { text: "Strongly Agree", value: 2 },
        { text: "Agree", value: 1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: -1 },
        { text: "Strongly Disagree", value: -2 }
      ],
      category: "P" // Perceiving vs. Judging
    },
    {
      question: "You tend to make decisions quickly without overthinking them.",
      options: [
        { text: "Strongly Agree", value: 2 },
        { text: "Agree", value: 1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: -1 },
        { text: "Strongly Disagree", value: -2 }
      ],
      category: "J" // Judging vs. Perceiving
    },
    {
      question: "You find it easy to empathize with others and understand their feelings.",
      options: [
        { text: "Strongly Agree", value: 2 },
        { text: "Agree", value: 1 },
        { text: "Neutral", value: 0 },
        { text: "Disagree", value: -1 },
        { text: "Strongly Disagree", value: -2 }
      ],
      category: "F" // Feeling vs. Thinking
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [personalityType, setPersonalityType] = useState("");

  // Handle option selection
  const handleOptionClick = (value, category) => {
    setResponses({ ...responses, [category]: (responses[category] || 0) + value });

    // Move to the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculatePersonalityType();
      setShowResult(true);
    }
  };

  // Calculate personality type based on responses
  const calculatePersonalityType = () => {
    const types = [
      responses.E >= 0 ? "E" : "I",
      responses.N >= 0 ? "N" : "S",
      responses.F >= 0 ? "F" : "T",
      responses.J >= 0 ? "J" : "P"
    ];
    setPersonalityType(types.join(""));
  };

  // Progress calculation
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (showResult) {
    return (
      <div style={styles.container}>
        <h2>Your Personality Type: {personalityType}</h2>
        <button style={styles.button} onClick={() => window.location.reload()}>
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>16 Personalities Quiz</h2>
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
              onClick={() => handleOptionClick(option.value, questions[currentQuestionIndex].category)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
      <div style={styles.buttonContainer}>
        {currentQuestionIndex > 0 && (
          <button style={styles.button} onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>
            Back
          </button>
        )}
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
  button: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "10px",
    background: "#4A90E2",
    color: "#fff",
    cursor: "pointer",
    fontSize: "18px",
    transition: "background 0.3s",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
};

export default Quiz;