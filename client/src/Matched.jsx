import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Matched() {
  const [matchedJobSeekers, setMatchedJobSeekers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to get a specific cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const username = getCookie("username");

  useEffect(() => {
    const fetchMatchedJobSeekers = async () => {
      if (!username) {
        setError("Username is missing. Please log in again.");
        setIsLoading(false);
        return;
      }
  
      try {
        const response = await axios.get("http://localhost:3001/matched-job-seekers", {
          params: { username },
        });
  
        console.log("Matched Job Seekers Data:", response.data.matchedJobSeekers); // Debugging
  
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
  

  // Handle accept or reject decision
  const handleDecision = async (seekerUsername, postId, decision) => {
    try {
      const employerUsername = getCookie("username");
  
      console.log("Employer Username:", employerUsername);
      console.log("Seeker Username:", seekerUsername);
      console.log("Post ID:", postId);
      console.log("Decision:", decision);
  
      if (!employerUsername || !seekerUsername || !postId || !decision) {
        console.error("Missing required fields!");
        alert("Missing required fields. Please check the data.");
        return;
      }
  
      const response = await axios.post("http://localhost:3001/process-decision", {
        employerUsername,
        seekerUsername,
        postId,
        decision,
      });
  
      if (response.data.success) {
        alert(response.data.message);
  
        // Remove rejected candidates from the list
        if (decision === "no") {
          setMatchedJobSeekers((prevSeekers) =>
            prevSeekers.filter((seeker) => seeker.username !== seekerUsername)
          );
        }
      } else {
        alert("Failed to process decision: " + response.data.message);
      }
    } catch (error) {
      console.error("Error processing decision:", error);
      alert("An error occurred while processing the decision. Please try again.");
    }
  };
  

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-4" onClick={() => navigate("/home")}>
        Back to Home
      </button>

      <h2>Matched Job Seekers</h2>
      {isLoading && <div className="text-center mt-4">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {matchedJobSeekers.length === 0 && !error && !isLoading ? (
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
                <strong>Skills:</strong>{" "}
                {seeker.skills && seeker.skills.length > 0
                  ? seeker.skills.join(", ")
                  : "Not provided"}
              </p>
              <p>
                <strong>Preferred Job Type:</strong>{" "}
                {seeker.preferredJobType || "Not specified"}
              </p>
              <p>
                <strong>Post ID:</strong> {seeker.postId || "Missing Post ID"} {/* Debugging */}
              </p>
              <div className="mt-3">
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleDecision(seeker.username, seeker.postId, "yes")}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDecision(seeker.username, seeker.postId, "no")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div> 
      )}
    </div>
  );
}

export default Matched;
