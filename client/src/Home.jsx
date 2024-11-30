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
    const region = "westeurope"; // Replace with your Azure resource region (e.g., "eastus")

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
      <h1 data-translate="welcomeMessage">Welcome to CareerCompass!</h1>
      <p data-translate="description">Your gateway to a fulfilling career.</p>

      {/* Language Switcher Dropdown */}
      <select id="languageSwitcher" onChange={handleLanguageChange}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>

      {/* Conditional Content Based on User Role */}
      {userRole === "job_seeker" ? (
        <>
          <h2 data-translate="jobSeekerWelcome">Welcome, Job Seeker!</h2>
          <button onClick={() => navigate("/quiz")} data-translate="startQuiz">
            Start Quiz
          </button>
          <button onClick={() => navigate("/builder")} data-translate="goToBuilder">
            Go to Builder
          </button>
          <button onClick={() => navigate("/profile")} data-translate="viewProfile">
            View Profile
          </button>
        </>
      ) : userRole === "employer" ? (
        <>
          <h2 data-translate="employerWelcome">Welcome, Employer!</h2>
          <button onClick={() => navigate("/post-job")} data-translate="postJob">
            Post a Job
          </button>
          <button onClick={() => navigate("/matched-candidates")} data-translate="viewMatchedCandidates">
            View Matched Candidates
          </button>
        </>
      ) : userRole === "admin" ? (
        <>
          <h2 data-translate="adminWelcome">Welcome, Admin!</h2>
          <p>Admin Dashboard</p>
        </>
      ) : (
        <p>Role not found. Please log in again.</p>
      )}

      {/* Upload Document Button */}
      <div>
        <h2 data-translate="uploadDocumentTitle">Upload Document</h2>
        <button onClick={openModal} data-translate="uploadButton">Upload Document</button>
      </div>

      {/* Document Upload Modal */}
      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 data-translate="chooseDocument">Choose a Document to Upload</h2>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            <div style={styles.modalButtons}>
              <button onClick={closeModal} style={styles.cancelButton} data-translate="cancelButton">
                Cancel
              </button>
              <button onClick={uploadDocument} style={styles.confirmButton} data-translate="confirmButton">
                Confirm Upload
              </button>
            </div>
          </div>
        </div>
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
};

export default Home;