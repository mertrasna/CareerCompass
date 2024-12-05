import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import notificationManager from "./NotificationManager";

const fontSizeMap = {
  Small: "14px",
  Medium: "18px",
  Large: "24px",
};

const Settings = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => JSON.parse(Cookies.get("darkMode") || "false"));
  const [language, setLanguage] = useState(() => Cookies.get("language") || "English");
  const [fontSize, setFontSize] = useState(() => Cookies.get("fontSize") || "Medium");

  useEffect(() => {
    document.body.style.fontSize = fontSizeMap[fontSize];
  }, [fontSize]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--table-bg-color", darkMode ? "#121212" : "#ffffff");
    root.style.setProperty("--table-text-color", darkMode ? "#ffffff" : "#000000");
  }, [darkMode]);

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    Cookies.set("darkMode", JSON.stringify(newMode), { expires: 7 });
    notificationManager.addNotification({
      message: `Dark mode has been ${newMode ? "enabled" : "disabled"}.`,
      type: "settings",
    });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    Cookies.set("language", newLanguage, { expires: 7 });
    notificationManager.addNotification({
      message: `Language changed to ${newLanguage}.`,
      type: "settings",
    });
  };

  const handleFontSizeChange = (e) => {
    const selectedFontSize = e.target.value;
    setFontSize(selectedFontSize);
    Cookies.set("fontSize", selectedFontSize, { expires: 7 });
    notificationManager.addNotification({
      message: `Font size changed to ${selectedFontSize}.`,
      type: "settings",
    });
  };

  const handleLogOut = () => {
    Cookies.remove("username");
    notificationManager.addNotification({
      message: "You have successfully logged out.",
      type: "info",
    });
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      const username = Cookies.get("username");
      try {
        const response = await fetch("http://localhost:3003/delete-account", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        const result = await response.json();
        if (result.success) {
          Cookies.remove("username");
          notificationManager.addNotification({
            message: "Your account has been deleted successfully.",
            type: "info",
          });
          navigate("/login");
        } else {
          notificationManager.addNotification({
            message: result.message,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        notificationManager.addNotification({
          message: "An error occurred while deleting your account.",
          type: "error",
        });
      }
    }
  };

  return (
    <div style={styles.page}>
      {/* Arrow Button */}
      <div style={styles.arrowContainer} onClick={() => navigate("/home")}>
        ←
      </div>
      <div style={styles.container}>
        <h1 style={styles.title}>Settings</h1>
        <hr style={styles.divider} />
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Appearance</h2>
          <div style={styles.switchContainer}>
            <span style={styles.switchLabel}>Enable Dark Mode</span>
            <label htmlFor="darkModeToggle" style={styles.switch}>
              <input
                id="darkModeToggle"
                type="checkbox"
                checked={darkMode}
                onChange={handleDarkModeToggle}
                style={styles.switchInput}
              />
              <span style={styles.slider}></span>
            </label>
          </div>
        </div>
        <hr style={styles.divider} />
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Language</h2>
          <label htmlFor="languageSelect" style={styles.label}>Choose a language:</label>
          <select
            id="languageSelect"
            value={language}
            onChange={handleLanguageChange}
            style={styles.select}
          >
            <option value="English">English</option>
            <option value="German">German</option>
            <option value="Turkish">Turkish</option>
          </select>
        </div>
        <hr style={styles.divider} />
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Font Size</h2>
          <label htmlFor="fontSizeSelect" style={styles.label}>Choose font size:</label>
          <select
            id="fontSizeSelect"
            value={fontSize}
            onChange={handleFontSizeChange}
            style={styles.select}
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>
        <hr style={styles.divider} />
        <button onClick={handleLogOut} style={styles.logoutButton}>
          Log Out
        </button>
        <button onClick={handleDeleteAccount} style={styles.deleteButton}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #FFA500, #0056b3)",
    position: "relative",
  },
  arrowContainer: {
    position: "absolute",
    top: "20px",
    left: "20px",
    fontSize: "1.5rem",
    cursor: "pointer",
    background: "none",
    border: "none",
    color: "#ffffff",
    fontWeight: "bold",
  },
  container: {
    width: "500px",
    backgroundColor: "var(--table-bg-color)",
    color: "var(--table-text-color)",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    marginBottom: "10px",
  },
  switchContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: {
    fontSize: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "5px",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  logoutButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#e63946",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  divider: {
    border: "0",
    height: "1px",
    background: "linear-gradient(to right, #ccc, transparent)",
    margin: "20px 0",
  },
};

export default Settings;
