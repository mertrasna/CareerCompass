import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Matched() {
  const [matchedJobSeekers, setMatchedJobSeekers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // To navigate back to home

  // Helper function to get a specific cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Retrieve the employer's username from cookies
  const username = getCookie("username");

  useEffect(() => {
    const fetchMatchedJobSeekers = async () => {
      if (!username) {
        setError("Username is missing. Please log in again.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/matched-job-seekers`, {
          params: { username },
        });

        if (response.data.success) {
          setMatchedJobSeekers(response.data.matchedJobSeekers);
        } else {
          setError(response.data.message || "Failed to load matched job seekers.");
        }
      } catch (err) {
        console.error("Error fetching matched job seekers:", err);
        setError("Failed to load matched job seekers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchedJobSeekers();
  }, [username]);

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Loading matched job seekers...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-4" onClick={() => navigate("/home")}>
        Back to Home
      </button>

      <h2>Matched Job Seekers</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {matchedJobSeekers.length === 0 && !error ? (
        <p>No job seekers have matched with your job posts yet.</p>
      ) : (
        <div className="list-group">
          {matchedJobSeekers.map((seeker) => (
            <div key={seeker._id} className="list-group-item">
              <h5>
                {seeker.firstName} {seeker.lastName}
              </h5>
              <p>
                <strong>Email:</strong> {seeker.email}
              </p>
              <p>
                <strong>Skills:</strong> {seeker.skills.join(", ") || "Not provided"}
              </p>
              <p>
                <strong>Preferred Job Type:</strong> {seeker.preferredJobType || "Not specified"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Matched;
