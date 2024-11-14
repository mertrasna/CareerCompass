// Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleQuizClick = () => {
    navigate("/quiz"); // Navigate to the Quiz page
  };

  const handleBuilderClick = () => {
    navigate("/builder"); // Navigate to the Builder page
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button onClick={handleQuizClick}>Start Quiz</button>
      <button onClick={handleBuilderClick}>Go to Builder</button>
    </div>
  );
}

export default Home;