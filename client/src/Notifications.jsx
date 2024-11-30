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
        const response = await axios.get("http://localhost:3001/interview-notifications", {
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
            <li key={index} style={styles[notification.type || "info"]}>
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
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#333",
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
  info: {
    color: "#31708f",
    backgroundColor: "#d9edf7",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
    textAlign: "left",
  },
  error: {
    color: "#a94442",
    backgroundColor: "#f2dede",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
    textAlign: "left",
  },
  clearButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#4caf50",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  backButton: {
    marginBottom: "20px",
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Notifications;