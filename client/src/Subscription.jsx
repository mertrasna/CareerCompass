import React, { useState } from "react";
import { Link } from "react-router-dom";

function Subscription() {
  // Simulate subscription status: "basic" or "premium"
  const [subscriptionStatus, setSubscriptionStatus] = useState("basic");

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Subscription</h1>
      <p style={styles.status}>
        Your current subscription: <strong>{subscriptionStatus.toUpperCase()}</strong>
      </p>

      {subscriptionStatus === "basic" ? (
        <div style={styles.card}>
          <h2>Upgrade to Premium</h2>
          <p>Enjoy exclusive benefits and features with our premium plan.</p>
          <Link to="/payment" style={styles.button}>
            Buy Now
          </Link>
        </div>
      ) : (
        <div style={styles.premiumMessage}>
          <h2>Thank you for being a Premium Subscriber!</h2>
          <p>Enjoy all the exclusive benefits of your plan.</p>
        </div>
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
  },
};

export default Subscription;