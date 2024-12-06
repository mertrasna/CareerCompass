//importing necessary modules
import axios from "axios"; 
import React, { useEffect, useState } from "react";
import { FiBell, FiCalendar, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar = ({ userRole = "job_seeker" }) => {
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("en"); 
  const [profilePicture, setProfilePicture] = useState("");

  // Fetch the username and language from localStorage when the component mounts
  useEffect(() => {
    const loggedInUsername = localStorage.getItem("username");
    const storedLanguage = loggedInUsername ? localStorage.getItem(`language_${loggedInUsername}`) : null;
    
    if (loggedInUsername) {
      setUsername(loggedInUsername);
    }

    if (storedLanguage) {
      setLanguage(storedLanguage); 
    }
  }, []);

  
  useEffect(() => {
    if (username) {
      localStorage.setItem(`language_${username}`, language); 
    }
  }, [language, username]); 

  // Handle language change
  const handleLanguageChange = async (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    await translatePage(selectedLanguage); // Call the translation function
  };

  // Translation function (same as before)
  const translatePage = async (language) => {
    const apiKey = "4Iy5N6M88saTRMTKysR1wE1ya4lGvvo4a2WEPscM7f9Fr30Zas5vJQQJ99AKAC5RqLJXJ3w3AAAbACOG72Sn"; // Replace with your Azure Translator API key
    const endpoint = "https://api.cognitive.microsofttranslator.com/translate";
    const region = "westeurope";

    const elements = document.querySelectorAll("[data-translate]");
    const texts = Array.from(elements).map((el) => ({ text: el.textContent }));

    try {
      const response = await axios.post(
        `${endpoint}?api-version=3.0&to=${language}`,
        texts,
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
    }
  };

  return (
    <nav style={styles.navbar}>
      {/* Left Section: Logo and Icons */}
      <div style={styles.left}>
        <div style={styles.logo}>
          <Link to="/home" style={styles.logoLink} data-translate="careerCompassText">
            CareerCompass
          </Link>
        </div>
        <div style={styles.icons}>
          {userRole === "job_seeker" && (
            <Link to="/search" style={styles.iconLink}>
              <FiSearch style={styles.icon} />
            </Link>
          )}
          <Link to="/calendar" style={styles.iconLink}>
            <FiCalendar style={styles.icon} />
          </Link>
          <Link to="/notifications" style={styles.iconLink}>
            <FiBell style={styles.icon} />
          </Link>
        </div>
      </div>

      {/* Right Section: Username, Profile Picture, and Navigation Links */}
      <div style={styles.right}>
        <Link to="/settings" style={styles.navLink} data-translate="settingsText">
          Settings
        </Link>
        {userRole === "job_seeker" && (
          <>
            <Link to="/subscription" style={styles.navLink} data-translate="subscriptionText">
              Subscription
            </Link>
            <Link to="/profile" style={styles.navLink} data-translate="userProfileText">
              User Profile
            </Link>
            <Link to="/matchmaking" style={styles.navLink} data-translate="matchmakingText">
              Matchmaking
            </Link>
          </>
        )}
        {userRole === "employer" && (
          <Link to="/matchedcandidates" style={styles.navLink} data-translate="matchedCandidatesText">
            Matched Candidates
          </Link>
        )}
        {userRole === "job_seeker" && profilePicture && (
          <img src={profilePicture} alt="Profile" style={styles.profilePicture} />
        )}
        {username && (
          <span style={styles.username} data-translate="usernameText">

          </span>
        )}
      </div>

      {/* Language Selector */}
      <div style={styles.languageSelector}>
        <select onChange={handleLanguageChange} value={language}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "transparent", // Fully transparent background
    color: "#fff",
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 1000,
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    marginRight: "20px",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  logoLink: {
    color: "#fff",
    textDecoration: "none",
  },
  icons: {
    display: "flex",
    gap: "15px",
  },
  iconLink: {
    color: "inherit",
    textDecoration: "none",
  },
  icon: {
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginLeft: "auto", 
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
    padding: "8px 12px", 
    borderRadius: "20px", 
    transition: "background-color 0.3s ease", 
  },
  username: {
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "bold",
    marginRight: "20px",
  },
  profilePicture: {
    width: "30px",
    height: "30px",
    borderRadius: "50%", 
    marginRight: "10px", 
  },
  languageSelector: {
    paddingLeft: "20px", 
  },
};

export default Navbar;