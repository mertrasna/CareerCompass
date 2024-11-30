import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Matched() {
  const [matchedJobSeekers, setMatchedJobSeekers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState(null); // Track interview details
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

  const downloadPDF = (pdfData, fileName) => {
    try {
      const blob = new Blob(
        [Uint8Array.from(atob(pdfData), (c) => c.charCodeAt(0))],
        { type: "application/pdf" }
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download the PDF. Please try again.");
      console.error("Error downloading PDF:", err);
    }
  };

  const handleAccept = (seekerUsername, postId) => {
    setInterviewDetails({ seekerUsername, postId });
  };

  const saveInterviewDate = async () => {
    if (!interviewDetails || !selectedDate) {
      alert("Please select an interview date.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/schedule-interview", {
        employerUsername: username,
        seekerUsername: interviewDetails.seekerUsername,
        postId: interviewDetails.postId,
        interviewDate: selectedDate,
      });

      if (response.data.success) {
        alert("Interview date scheduled successfully!");
        setSelectedDate(null);
        setInterviewDetails(null);
      } else {
        alert("Failed to schedule interview: " + response.data.message);
      }
    } catch (err) {
      console.error("Error scheduling interview:", err);
      alert("An error occurred while scheduling the interview.");
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
        alert(response.data.message);
        setMatchedJobSeekers((prevSeekers) =>
          prevSeekers.filter((seeker) => seeker.username !== seekerUsername)
        );
      } else {
        alert("Failed to process rejection: " + response.data.message);
      }
    } catch (error) {
      console.error("Error rejecting candidate:", error);
      alert("An error occurred while rejecting the candidate.");
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
                <strong>Post ID:</strong> {seeker.postId || "Missing Post ID"}
              </p>
              {seeker.pdfData && (
                <p>
                  <strong>CV:</strong>{" "}
                  <button
                    className="btn btn-link"
                    onClick={() =>
                      downloadPDF(seeker.pdfData, `${seeker.firstName}_${seeker.lastName}_CV.pdf`)
                    }
                  >
                    Download CV
                  </button>
                </p>
              )}
              <div className="mt-3">
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleAccept(seeker.username, seeker.postId)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleReject(seeker.username, seeker.postId)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {interviewDetails && (
        <div className="mt-4">
          <h4>Schedule Interview</h4>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            placeholderText="Select interview date"
          />
          <button className="btn btn-primary mt-3" onClick={saveInterviewDate}>
            Save Interview Date
          </button>
        </div>
      )}
    </div>
  );
}

export default Matched;