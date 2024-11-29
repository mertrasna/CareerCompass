import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Settings = () => {
  const navigate = useNavigate(); // Initialize navigate

  // Initialize dark mode from localStorage or default to false
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("darkMode")) || false
  );

  // Initialize language from localStorage or default to English
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "English"
  );

  // Initialize font size from localStorage or default to Medium
  const [fontSize, setFontSize] = useState(
    () => localStorage.getItem("fontSize") || "Medium"
  );

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode)); // Save to localStorage
      return newMode;
    });
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage); // Save to localStorage
  };

  // Handle font size change
  const handleFontSizeChange = (e) => {
    const selectedFontSize = e.target.value;
    setFontSize(selectedFontSize);
    localStorage.setItem("fontSize", selectedFontSize); // Save to localStorage
  };

  // Apply dark mode class to the body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Apply font size to the body element
  useEffect(() => {
    document.body.style.fontSize =
      fontSize === "Small" ? "14px" : fontSize === "Large" ? "18px" : "16px";
  }, [fontSize]);

  return (
    <>
      <style>
        {`
          body.dark-mode {
            background-color: #121212;
            color: #ffffff;
          }

          .settings-container {
            padding: 20px;
            max-width: 600px;
            margin: auto;
          }
        `}
      </style>
      <div className="settings-container">
        <h1>Settings</h1>
        <button
          onClick={() => navigate('/home')}
          style={styles.backButton}
        >
          Back to Home
        </button>
        <hr />
        <section>
          <h2>Appearance</h2>
          <label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={handleDarkModeToggle}
            />
            Enable Dark Mode
          </label>
        </section>
        <hr />
        <section>
          <h2>Language</h2>
          <label htmlFor="language-select">Choose a language:</label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="English">English</option>
            <option value="German">German</option>
            <option value="Turkish">Turkish</option>
          </select>
        </section>
        <hr />
        <section>
          <h2>Font Size</h2>
          <label htmlFor="font-size-select">Choose font size:</label>
          <select
            id="font-size-select"
            value={fontSize}
            onChange={handleFontSizeChange}
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </section>
      </div>
    </>
  );
};

const styles = {
  backButton: {
    position: 'absolute',
    top: '10px',
    left: '5px',
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Settings;