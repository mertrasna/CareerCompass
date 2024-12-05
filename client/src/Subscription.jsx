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
        const response = await axios.get("http://localhost:3004/subscription", {
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
      const response = await axios.post("http://localhost:3004/cancel-subscription", {
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
      <div style={styles.page}>
        <h1 style={styles.title}>Subscription</h1>
        <p style={styles.loading}>Loading your subscription status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Subscription</h1>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  if (subscriptionStatus === "basic") {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>Subscription</h1>
          <p style={styles.status}>
            Your current subscription: <strong>BASIC</strong>
          </p>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Upgrade to Premium</h2>
            <p style={styles.cardDescription}>
              Enjoy exclusive benefits and features with our premium plan.
            </p>
            <ul style={styles.featureList}>
              <li>Unlimited job matches</li>
              <li>Unlock priority notifications</li>
              <li>Unlock the advanced filters for job search</li>
            </ul>
            <a href="/payment" style={styles.button}>
              Buy Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (subscriptionStatus === "premium") {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>Subscription</h1>
          <p style={styles.status}>
            Your current subscription: <strong>PREMIUM</strong>
          </p>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Thank you for being a Premium Subscriber!</h2>
            <p style={styles.cardDescription}>
              Enjoy all the exclusive benefits of your plan.
            </p>
            <ul style={styles.featureList}>
              <li>Unlimited job matches</li>
              <li>Priority notifications</li>
              <li>Advanced filters for job search</li>
            </ul>
            <button
              style={styles.cancelButton}
              onClick={handleCancelSubscription}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Cancel Subscription"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Subscription</h1>
      <p style={styles.error}>An error occurred. Please try again later.</p>
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
    backgroundColor: "white", // White box for content
    color: "#333",
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#0056b3",
  },
  status: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    color: "#555",
  },
  card: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "1.8rem",
    marginBottom: "10px",
    color: "#333",
  },
  cardDescription: {
    marginBottom: "15px",
    color: "#555",
  },
  featureList: {
    listStyleType: "disc",
    margin: "10px 0 20px 20px",
    textAlign: "left",
  },
  button: {
    display: "inline-block",
    padding: "10px 20px",
    fontSize: "1rem",
    color: "white",
    backgroundColor: "#4caf50",
    borderRadius: "5px",
    textDecoration: "none",
  },
  cancelButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "white",
    backgroundColor: "#e63946",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  loading: {
    fontSize: "1.2rem",
    color: "#777",
  },
  error: {
    fontSize: "1.2rem",
    color: "#e63946",
  },
};

export default Subscription;