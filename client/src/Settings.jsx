import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import notificationManager from "./NotificationManager";

const Settings = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => JSON.parse(Cookies.get("darkMode") || "false"));
  const [language, setLanguage] = useState(() => Cookies.get("language") || "English");
  const [fontSize, setFontSize] = useState(() => Cookies.get("fontSize") || "Medium");

  // Sync state with styles
  useEffect(() => {
    document.body.style.fontSize = fontSize === "Small" ? "14px" : fontSize === "Large" ? "18px" : "16px";
    document.body.style.backgroundColor = darkMode ? "#121212" : "#ffffff";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";
  }, [darkMode, fontSize]);

  // Handle appearance settings
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

  // Logout handler
  const handleLogOut = () => {
    Cookies.remove("username");
    notificationManager.addNotification({
      message: "You have successfully logged out.",
      type: "info",
    });
    navigate("/login");
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (confirmDelete) {
      const username = Cookies.get("username");
      try {
        const response = await fetch("http://localhost:3001/delete-account", {
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
          alert(result.message);
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
    <div className="settings-container">
      <h1>Settings</h1>
      <button onClick={() => navigate("/home")} className="back-button">
        Back to Home
      </button>
      <section>
        <h2>Appearance</h2>
        <label>
          Enable Dark Mode
          <input type="checkbox" checked={darkMode} onChange={handleDarkModeToggle} />
        </label>
      </section>
      <section>
        <h2>Language</h2>
        <label>Choose a language:</label>
        <select value={language} onChange={handleLanguageChange}>
          <option value="English">English</option>
          <option value="German">German</option>
          <option value="Turkish">Turkish</option>
        </select>
      </section>
      <section>
        <h2>Font Size</h2>
        <label>Choose font size:</label>
        <select value={fontSize} onChange={handleFontSizeChange}>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
      </section>
      <button onClick={handleLogOut} className="logout-button">
        Log Out
      </button>
      <button onClick={handleDeleteAccount} className="delete-button">
        Delete Account
      </button>
    </div>
  );
};

export default Settings;