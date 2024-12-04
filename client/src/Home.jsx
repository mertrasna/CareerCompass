import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Home() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDocument, setNewDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [language, setLanguage] = useState("en"); // Default language

  useEffect(() => {
    const username = Cookies.get("username");

    if (!username) {
      setError("Username not found in cookies");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.post("http://localhost:3001/userdata", { username });
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
      const response = await axios.post("http://localhost:3001/uploadDocument", formData, {
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
    setLanguage(e.target.value);
    translatePage(e.target.value); // Call the translation function
  };

  const translatePage = async (language) => {
    const apiKey = "4Iy5N6M88saTRMTKysR1wE1ya4lGvvo4a2WEPscM7f9Fr30Zas5vJQQJ99AKAC5RqLJXJ3w3AAAbACOG72Sn"; // Replace with your Azure Translator API key
    const endpoint = "https://api.cognitive.microsofttranslator.com/translate";
    const region = "westeurope"; 

    const elements = document.querySelectorAll("[data-translate]");
    const texts = Array.from(elements).map((el) => el.textContent);

    try {
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
      console.error("Translation error:", error);
      setError("Failed to translate content");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Navbar userRole={userRole} />
    
      {/* Language Switcher Dropdown */}
      <select id="languageSwitcher" onChange={handleLanguageChange}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>

      {userRole === "job_seeker" ? (
  <>
    <h2 data-translate="jobSeekerWelcome">Welcome, Job Seeker!</h2>
    <div style={styles.container}>
      {/* Left Section */}
      <div style={styles.left}>
      <h2 style={styles.heading}>WHAT'S YOUR PERFECT JOB? FIND OUT NOW</h2>
        <button style={styles.buttonleft} onClick={() => navigate("/quiz")}>
          Take Personality Quiz
        </button>
      </div>

      {/* Right Section */}
      <div style={styles.right}>
      <h2 style={styles.heading}>YOUR DREAM JOB IS WAITING FOR YOU!</h2>
        <button style={styles.buttonright} onClick={() => navigate("/Matchmaking")}>
          Start Matching
        </button>
        <button style={styles.buttonright} onClick={() => navigate("/Builder")}>
          CV
        </button>
      </div>
    </div>
  </>
) : userRole === "employer" ? (
  <>
    <h2 data-translate="employerWelcome">Welcome, Employer!</h2>
  </>
) : userRole === "admin" ? (
  <>
    <h2 data-translate="adminWelcome">Welcome, Admin!</h2>
    <p>Admin Dashboard</p>
  </>
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
  left: {
    position: "fixed", // Fix the left section to the viewport
    top: 0, // Align with the top of the viewport
    left: 0, // Align with the left of the viewport
    width: "50vw", // Take up 50% of the viewport width
    height: "100vh", // Full height of the viewport
    display: "flex",
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    background: "#007BFF", // Gradient background
    color: "white", // White text color for contrast
    padding: "20px", // Add padding around content
    textAlign: "center", // Center the text
    flexDirection: "column",
    
  },
  heading: {
    fontSize: "32px", // Larger, more striking font size
    fontWeight: "bold", // Bold the heading
    textTransform: "uppercase", // Make the heading uppercase for impact
    letterSpacing: "2px", // Add some space between letters for better readability
    marginBottom: "30px", // Increase space between heading and button
    lineHeight: "1.4", // Improve line spacing for better text flow
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
    backgroundColor: "#FF7518", // Orange background
    color: "white", // White text color for contrast
    padding: "20px", // Add padding around content
    textAlign: "center", // Center the text
    flexDirection: "column",
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
};

export default Home;