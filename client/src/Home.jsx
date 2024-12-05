import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Cookies from "js-cookie";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDocument, setNewDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize language state from localStorage or default to "en"
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  

  useEffect(() => {
    const username = Cookies.get("username");

    if (!username) {
      setError("Username not found in cookies");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.post("http://localhost:3003/userdata", { username });
        const user = response.data.user;
        setUserRole(user.role);
        setLoading(false);
      } catch (err) {
        setError("Error fetching user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Apply saved language translation on component mount
  useEffect(() => {
    translatePage(language);
  }, [language]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewDocument(e.target.files[0]);
    }
  };

  const uploadDocument = async () => {
    if (!newDocument) {
      setError("No document selected for upload");
      return;
    }

    const formData = new FormData();
    formData.append("document", newDocument);
    formData.append("username", Cookies.get("username"));

    try {
      const response = await axios.post("http://localhost:3003/uploadDocument", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error uploading document:", err);
      setError("Failed to upload document");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewDocument(null);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    console.log("Selected language:", selectedLanguage);
    setLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage); // Save to localStorage
    translatePage(selectedLanguage);
  };
  

  const translatePage = async (language) => {
    const apiKey = "4Iy5N6M88saTRMTKysR1wE1ya4lGvvo4a2WEPscM7f9Fr30Zas5vJQQJ99AKAC5RqLJXJ3w3AAAbACOG72Sn"; // Replace with your Azure Translator API key
    const endpoint = "https://api.cognitive.microsofttranslator.com/translate";
    const region = "westeurope";

    try {
      const elements = document.querySelectorAll("[data-translate]");
      const texts = Array.from(elements).map((el) => el.textContent);

      if (texts.length === 0) {
        console.warn("No elements found for translation.");
        return;
      }

      const response = await axios.post(
        `${endpoint}?api-version=3.0&to=${language}`,
        texts.map((text) => ({ text })),
        {
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
            "Ocp-Apim-Subscription-Region": region,
            "Content-Type": "application/json",
          },
        }
      );

      const translations = response.data.map((item) => item.translations[0].text);
      elements.forEach((el, index) => {
        el.textContent = translations[index];
      });
    } catch (error) {
      console.error("Translation error:", error.response?.data || error.message);
      setError("Failed to translate content");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div>
      <Navbar userRole={userRole} />

      {/* Language Switcher Dropdown */}
      <div style={{ textAlign: "right", margin: "10px" }}>
        <label htmlFor="languageSwitcher" style={{ marginRight: "10px" }}>
          Select Language:
        </label>
        <select
          id="languageSwitcher"
          onChange={handleLanguageChange}
          value={language}
          style={{
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
          }}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>

      {userRole === "job_seeker" ? (
        <div style={styles.container}>
          <div style={styles.left}>
            <h2 style={styles.heading} data-translate="jobSeekerHeadingLeft">
              What's your perfect job? Find out now!
            </h2>
            <button style={styles.button} onClick={() => navigate("/quiz")}>
              Take Personality Quiz
            </button>
          </div>

          <div style={styles.right}>
            <h2 style={styles.heading} data-translate="jobSeekerHeadingRight">
              Your dream job is waiting for you!
            </h2>
            <button style={styles.button} onClick={() => navigate("/Matchmaking")}>
              Start Matching
            </button>
            <button style={styles.button} onClick={() => navigate("/Builder")}>
              Build Your CV
            </button>
          </div>
        </div>
      ) : userRole === "employer" ? (
        <div style={styles.container}>
          <div style={styles.left}>
            <h2 style={styles.heading} data-translate="employerHeadingLeft">
              Find the perfect candidates!
            </h2>
            <button style={styles.button} onClick={() => navigate("/post")}>
              Post a Job
            </button>
          </div>

          <div style={styles.right}>
            <h2 style={styles.heading} data-translate="employerHeadingRight">
              Build your dream team!
            </h2>
            <button style={styles.button} onClick={() => navigate("/viewjob")}>
              Manage Job Listings
            </button>
          </div>
        </div>
      ) : userRole === "admin" ? (
        <div>
          <h2 data-translate="adminWelcome">Welcome, Admin!</h2>
          <p data-translate="adminDashboard">Admin Dashboard</p>
        </div>
      ) : (
        <p>Role not found. Please log in again.</p>
      )}
    </div>
  );
}

const styles = {
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    
  },
  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  cancelButton: {
    backgroundColor: "red",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  confirmButton: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  fileInput: {
    marginTop: "10px",
  },
  container: {
    display: "flex",
    height: "100vh", // Full height of the viewport
    width: "100vw",  // Full width of the viewport
    position: "relative", // Positioning for the fixed elements
    overflow: "hidden", // Prevent scrolling within the container
  },
  
  heading: {
    fontSize: "80px", // Larger, more striking font size
    fontWeight: "bold", // Bold the heading
    textTransform: "uppercase", // Make the heading uppercase for impact
    letterSpacing: "2px", // Add some space between letters for better readability
    marginBottom: "30px", // Increase space between heading and button
    lineHeight: "1.4", // Improve line spacing for better text flow
    fontStyle: "italic", // Make the text italic
  },
  
  left: {
    position: "fixed", // Fix the left section to the viewport
    top: 0, // Align with the top of the viewport
    left: 0, // Align with the left of the viewport
    width: "50vw", // Take up 50% of the viewport width
    height: "100vh", // Full height of the viewport
    display: "flex",
    justifyContent: "center", // Center content horizontally
    alignItems: "center", // Center content vertically
    background: "linear-gradient(135deg, #007BFF, #4CA1AF)", // Blue gradient
    color: "white", // White text color for contrast
    padding: "20px", // Add padding around content
    textAlign: "center", // Center the text
    flexDirection: "column", // Stack content vertically
    boxSizing: "border-box", // Include padding in the width/height
  },
  
  right: {
    position: "fixed", // Fix the right section to the viewport
    top: 0, // Align with the top of the viewport
    right: 0, // Align with the right of the viewport
    width: "50vw", // Take up 50% of the viewport width
    height: "100vh", // Full height of the viewport
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #FF7518, #FFB347)", // Orange gradient
    color: "white", // White text color for contrast
    padding: "20px", // Add padding around content
    textAlign: "center", // Center the text
    flexDirection: "column", // Stack content vertically
    boxSizing: "border-box", // Include padding in the width/height
  },
  
  buttonleft: {
    padding: "15px 30px",
    fontSize: "18px",
    backgroundColor:"#007BFF", // Make the button color stand out
    color: "white", // White text color
    border: "2px solid white",
    borderRadius: "30px", // Make the button more rounded
    cursor: "pointer",
    fontWeight: "bold", // Bold text on the button for emphasis
    transition: "all 0.3s ease", // Smooth transition for hover effect
    marginTop: "20px", // Add margin to move the button away from the heading
  },
  buttonright: {
    padding: "15px 30px",
    fontSize: "18px",
    backgroundColor:"#FF7518", // Make the button color stand out
    color: "white", // White text color
    border: "2px solid white",
    borderRadius: "30px", // Make the button more rounded
    cursor: "pointer",
    fontWeight: "bold", // Bold text on the button for emphasis
    transition: "all 0.3s ease", // Smooth transition for hover effect
    marginTop: "20px", // Add margin to move the button away from the heading
  },
  button: {
  padding: "15px 30px",
  fontSize: "18px",
  backgroundColor: "transparent", // Transparent background for a hollow effect
  color: "white", // Text color
  border: "2px solid white", // Visible border
  borderRadius: "30px", // Rounded corners
  cursor: "pointer",
  fontWeight: "bold", // Bold text
  transition: "all 0.3s ease", // Smooth transitions
  marginTop: "20px",
  fontFamily: "'Roboto', sans-serif", // Font for the button text
},

};

export default Home;
