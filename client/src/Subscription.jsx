import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function Subscription() {
  const [subscriptionStatus, setSubscriptionStatus] = useState("loading");
  const [error, setError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchSubscriptionType = async () => {
      const username = Cookies.get("username");
      if (!username) {
        setError("User not logged in. Please log in to view subscription.");
        setSubscriptionStatus("basic");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/subscription", {
          params: { username },
        });

        if (response.data.success) {
          setSubscriptionStatus(response.data.subscriptionType || "basic");
        } else {
          setError(response.data.message || "Failed to fetch subscription type.");
        }
      } catch (err) {
        console.error("Error fetching subscription type:", err);
        setError("An error occurred while fetching your subscription type.");
        setSubscriptionStatus("basic");
      }
    };

    fetchSubscriptionType();
  }, []);

  const handleCancelSubscription = async () => {
    const username = Cookies.get("username");
    if (!username) {
      alert("User not logged in. Please log in to continue.");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    setIsCancelling(true);

    try {
      const response = await axios.post("http://localhost:3001/cancel-subscription", {
        username,
      });

      if (response.data.success) {
        alert("Subscription successfully cancelled.");
        setSubscriptionStatus("basic");
      } else {
        alert(response.data.message || "Failed to cancel subscription.");
      }
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      alert("An error occurred while cancelling your subscription.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (subscriptionStatus === "loading") {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Subscription</h1>
        <p>Loading your subscription status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Subscription</h1>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  if (subscriptionStatus === "basic") {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Subscription</h1>
        <p style={styles.status}>
          Your current subscription: <strong>BASIC</strong>
        </p>
        <div style={styles.card}>
          <h2>Upgrade to Premium</h2>
          <p>Enjoy exclusive benefits and features with our premium plan.</p>
          <a href="/payment" style={styles.button}>
            Buy Now
          </a>
        </div>
      </div>
    );
  }

  if (subscriptionStatus === "premium") {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Subscription</h1>
        <p style={styles.status}>
          Your current subscription: <strong>PREMIUM</strong>
        </p>
        <div style={styles.premiumMessage}>
          <h2>Thank you for being a Premium Subscriber!</h2>
          <p>Enjoy all the exclusive benefits of your plan.</p>
          <div style={styles.features}>
            <h3>Premium Features:</h3>
            <ul style={styles.featureList}>
              <li>Unlimited job matches</li>
              <li>Priority notifications</li>
              <li>Access to exclusive job listings</li>
              <li>Advanced filters for job search</li>
            </ul>
          </div>
        </div>
        <button
          style={styles.cancelButton}
          onClick={handleCancelSubscription}
          disabled={isCancelling}
        >
          {isCancelling ? "Cancelling..." : "Cancel Subscription"}
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Subscription</h1>
      <p style={styles.error}>An error occurred. Please try again later.</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#333",
  },
  status: {
    fontSize: "1.5rem",
    marginBottom: "30px",
    color: "#555",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  button: {
    display: "inline-block",
    marginTop: "15px",
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#4caf50",
    borderRadius: "5px",
    textDecoration: "none",
    cursor: "pointer",
  },
  premiumMessage: {
    padding: "20px",
    backgroundColor: "#e8f5e9",
    borderRadius: "8px",
    color: "#388e3c",
    textAlign: "left",
  },
  features: {
    marginTop: "20px",
    textAlign: "left",
  },
  featureList: {
    listStyleType: "disc",
    marginLeft: "20px",
  },
  error: {
    color: "red",
    fontSize: "1.2rem",
  },
  cancelButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#ff5722",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
};

export default Subscription;