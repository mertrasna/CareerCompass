import React, { useEffect, useState } from "react";
import notificationManager from "./NotificationManager";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const username = Cookies.get("username");

  useEffect(() => {
    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    notificationManager.addObserver(handleNewNotification);

    // Load initial notifications
    setNotifications(notificationManager.getNotifications());

    return () => {
      notificationManager.removeObserver(handleNewNotification);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!username) {
        setError("You are not logged in. Please log in to view notifications.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3007/interview-notifications", {
          params: { username },
        });

        if (response.data.success) {
          const existingMessages = new Set(
            notificationManager.getNotifications().map((notif) => notif.message)
          );

          response.data.interviews.forEach((interview) => {
            const message = `You have an upcoming interview for Post ID: ${interview.postId} on ${new Date(
              interview.interviewDate
            ).toLocaleString()}.`;

            if (!existingMessages.has(message)) {
              notificationManager.addNotification({
                message,
                type: "info",
              });
            }
          });
        } else {
          setError(response.data.message || "Failed to fetch interview notifications.");
        }
      } catch (err) {
        console.error("Error fetching interview notifications:", err);
        setError("An error occurred while fetching your notifications.");
      }
    };

    fetchNotifications();
  }, [username]);

  const clearNotifications = () => {
    notificationManager.clearNotifications();
    setNotifications([]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Notifications</h1>
        <button onClick={() => navigate("/home")} style={styles.backButton}>
          Back to Home
        </button>

        {error ? (
          <div style={styles.error}>{error}</div>
        ) : notifications.length === 0 ? (
          <p style={styles.message}>You have no notifications at the moment.</p>
        ) : (
          <ul style={styles.list}>
            {notifications.map((notification, index) => (
              <li
                key={index}
                style={notification.type === "error" ? styles.errorItem : styles.infoItem}
              >
                {notification.message}
              </li>
            ))}
          </ul>
        )}

        {notifications.length > 0 && (
          <button onClick={clearNotifications} style={styles.clearButton}>
            Clear Notifications
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #FFA500, #0056b3)", // Fading orange-to-blue gradient
    fontFamily: "'Poppins', sans-serif", // Modern font
  },
  container: {
    width: "600px",
    backgroundColor: "white", // White notifications table
    color: "#333",
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#0056b3", // Deep blue title
  },
  backButton: {
    marginBottom: "20px",
    padding: "10px 20px",
    backgroundColor: "#4caf50", // Green
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    fontSize: "1.2rem",
    color: "#555",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: "20px 0",
  },
  infoItem: {
    backgroundColor: "#e7f3fe",
    color: "#31708f",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
    textAlign: "left",
  },
  errorItem: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
    textAlign: "left",
  },
  clearButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1rem",
    color: "white",
    backgroundColor: "#e63946", // Red for clear button
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    fontSize: "1.2rem",
    color: "#e63946", // Red for errors
  },
};

export default Notifications;