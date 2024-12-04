import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import DatePicker from "react-datepicker";
import { motion, AnimatePresence } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";

function Matched() {
  const [matchedJobSeekers, setMatchedJobSeekers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const username = document.cookie
    .split("; ")
    .find((row) => row.startsWith("username="))
    ?.split("=")[1];

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

        if (response.data.success) {
          setMatchedJobSeekers(response.data.matchedJobSeekers);
        } else {
          setError(response.data.message || "Failed to load matched job seekers.");
        }
      } catch (err) {
        setError("Error fetching matched job seekers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchedJobSeekers();
  }, [username]);

  const handleAccept = async (seekerUsername, postId) => {
    try {
      const response = await axios.post("http://localhost:3001/process-decision", {
        employerUsername: username,
        seekerUsername,
        postId,
        decision: "yes",
      });

      if (response.data.success) {
        alert(response.data.message);
        setSelectedCandidate({ seekerUsername, postId });
      } else {
        alert("Failed to accept candidate: " + response.data.message);
      }
    } catch (err) {
      alert("Error processing acceptance. Please try again.");
    }
  };

  const handleSaveInterviewDate = async () => {
    if (!selectedCandidate || !selectedDate) {
      alert("Please select an interview date.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/process-decision", {
        employerUsername: username,
        seekerUsername: selectedCandidate.seekerUsername,
        postId: selectedCandidate.postId,
        decision: "yes",
        interviewDate: selectedDate,
      });

      if (response.data.success) {
        alert("Interview scheduled successfully!");
        setMatchedJobSeekers((prev) =>
          prev.filter((seeker) => seeker.username !== selectedCandidate.seekerUsername)
        );
        setSelectedCandidate(null);
        setSelectedDate(null);
      } else {
        alert("Failed to schedule interview: " + response.data.message);
      }
    } catch (err) {
      alert("Error scheduling interview. Please try again.");
    }
  };

  const handleReject = async (seekerUsername, postId) => {
    try {
      const response = await axios.post("http://localhost:3001/process-decision", {
        employerUsername: username,
        seekerUsername,
        postId,
        decision: "no",
      });

      if (response.data.success) {
        setMatchedJobSeekers((prev) =>
          prev.filter((seeker) => seeker.username !== seekerUsername)
        );
        alert(response.data.message);
      } else {
        alert("Failed to reject candidate: " + response.data.message);
      }
    } catch (err) {
      alert("Error rejecting candidate. Please try again.");
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, #007BFF, #FFA500)",
        minHeight: "100vh",
        padding: "20px",
        color: "#fff",
      }}
    >
      <button
        className="btn btn-link mb-4"
        onClick={() => navigate("/home")}
        style={{
          color: "#fff",
          fontSize: "1.5rem",
          border: "none",
          background: "none",
        }}
      >
        <FiArrowLeft />
      </button>

      <h2
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "30px",
          color: "#fff",
        }}
      >
        Matched Job Seekers
      </h2>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : matchedJobSeekers.length === 0 ? (
        <p className="text-center">No matched job seekers at the moment.</p>
      ) : (
        <div>
          <AnimatePresence>
            {matchedJobSeekers.map((seeker) => (
              <motion.div
                key={seeker._id}
                className="card shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{
                  maxWidth: "500px",
                  margin: "20px auto",
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "20px",
                  color: "#333",
                }}
              >
                <h5>
                  {seeker.firstName} {seeker.lastName}{" "}
                  {seeker.verified && (
                    <span
                      style={{
                        marginLeft: "8px",
                        color: "#ffc107",
                        fontSize: "1.2em",
                      }}
                    >
                      ★
                    </span>
                  )}
                </h5>
                <p>
                  <strong>Email:</strong> {seeker.email}
                </p>
                <p>
                  <strong>Skills:</strong> {seeker.skills?.join(", ") || "N/A"}
                </p>
                <p>
                  <strong>Preferred Job Type:</strong> {seeker.preferredJobType || "N/A"}
                </p>
                <div className="text-center mt-3">
                  <button
                    className="btn btn-outline-success me-2"
                    onClick={() => handleAccept(seeker.username, seeker.postId)}
                    style={{
                      borderRadius: "8px",
                      padding: "8px 16px",
                      borderColor: "#28a745",
                      color: "#28a745",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleReject(seeker.username, seeker.postId)}
                    style={{
                      borderRadius: "8px",
                      padding: "8px 16px",
                      borderColor: "#dc3545",
                      color: "#dc3545",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Reject
                  </button>
                </div>

                {selectedCandidate &&
                  selectedCandidate.seekerUsername === seeker.username &&
                  selectedCandidate.postId === seeker.postId && (
                    <div
                      style={{
                        marginTop: "20px",
                        padding: "15px",
                        borderRadius: "12px",
                        background: "#f9f9f9",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <h5 style={{ color: "#007BFF", textAlign: "center" }}>
                        Schedule Interview
                      </h5>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        minDate={new Date()}
                        placeholderText="Select interview date"
                        style={{
                          margin: "10px auto",
                          display: "block",
                        }}
                      />
                      <button
                        className="btn btn-primary mt-3"
                        onClick={handleSaveInterviewDate}
                        style={{
                          width: "100%",
                          borderRadius: "8px",
                          padding: "10px",
                        }}
                      >
                        Save Interview Date
                      </button>
                    </div>
                  )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default Matched;
