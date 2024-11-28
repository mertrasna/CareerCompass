import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiCheck, FiX, FiArrowLeft } from "react-icons/fi";

function Matchmaking() {
  const [jobs, setJobs] = useState([]); // List of all jobs
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current job index
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation

  const username = document.cookie
    .split("; ")
    .find((row) => row.startsWith("username="))
    ?.split("=")[1];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!username) {
          setError("Username not found in cookies.");
          return;
        }

        // Fetch jobs and user skills concurrently
        const [jobsResponse, userResponse] = await Promise.all([
          axios.get(`http://localhost:3001/all-jobs?username=${username}`),
          axios.get(`http://localhost:3001/user-skills?username=${username}`),
        ]);

        if (jobsResponse.data.success && userResponse.data.success) {
          const allJobs = jobsResponse.data.jobs;
          const userSkills = userResponse.data.skills;
          const alreadySwiped = jobsResponse.data.alreadySwiped;

          // Filter out jobs that have already been swiped
          const filteredJobs = allJobs.filter(
            (job) => !alreadySwiped.includes(job._id)
          );

          // Prioritize jobs with matching skills
          const sortedJobs = filteredJobs.sort((a, b) => {
            const aMatches = a.skills.filter((skill) => userSkills.includes(skill)).length;
            const bMatches = b.skills.filter((skill) => userSkills.includes(skill)).length;
            return bMatches - aMatches; // Higher matches come first
          });

          setJobs(sortedJobs);
        } else {
          setError("Failed to load jobs or user skills.");
        }
      } catch (err) {
        console.error("Error fetching jobs or user skills:", err);
        setError("Failed to load jobs. Please try again.");
      }
    };

    fetchJobs();
  }, [username]);

  const handleSwipe = async (status) => {
    if (!username || !jobs[currentIndex]) return;

    try {
      const jobId = jobs[currentIndex]._id;

      console.log("Sending swipe data:", { username, jobId, status });

      const response = await axios.post("http://localhost:3001/swipe", {
        username,
        jobId,
        status,
      });

      console.log("Swipe response:", response.data);

      if (response.data.success) {
        // Move to the next job only if the swipe was successful
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        alert(response.data.message || "Failed to save your swipe.");
      }
    } catch (err) {
      console.error("Error saving swipe:", err.response?.data || err.message);
      alert("Failed to save your swipe. Please try again.");
    }
  };

  if (error)
    return (
      <div className="alert alert-danger mt-4">
        <button className="btn btn-link" onClick={() => navigate("/home")}>
          <FiArrowLeft size={20} /> Back to Home
        </button>
        {error}
      </div>
    );

  if (currentIndex >= jobs.length)
    return (
      <div className="text-center mt-4">
        <h4>No more jobs to display.</h4>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/home")}
        >
          <FiArrowLeft size={20} /> Back to Home
        </button>
      </div>
    );

  const currentJob = jobs[currentIndex];

  return (
    <div className="container mt-4">
      {/* Back to Home Button */}
      <button className="btn btn-link mb-4" onClick={() => navigate("/home")}>
        <FiArrowLeft size={20} /> Back to Home
      </button>

      <h2>Matchmaking</h2>
      {currentJob && (
        <div className="card p-4">
          <h5>{currentJob.title}</h5>
          <p>
            <strong>Location:</strong> {currentJob.location}
          </p>
          <p>
            <strong>Type:</strong> {currentJob.jobType}
          </p>
          <p>
            <strong>Description:</strong> {currentJob.description}
          </p>
          <p>
            <strong>Company Name:</strong> {currentJob.companyName}
          </p>
          {currentJob.companyLogo && (
            <img
              src={currentJob.companyLogo}
              alt={`${currentJob.companyName} Logo`}
              style={{ maxWidth: "150px", marginTop: "10px" }}
            />
          )}
          <p>
            <strong>Application Deadline:</strong>{" "}
            {new Date(currentJob.applicationDeadline).toLocaleDateString()}
          </p>
          <p>
            <strong>Skills:</strong>{" "}
            {currentJob.skills && currentJob.skills.length > 0
              ? currentJob.skills.join(", ")
              : "No specific skills mentioned"}
          </p>

          {/* Swipe Buttons */}
          <div className="d-flex justify-content-around mt-4">
            <button
              className="btn btn-danger"
              onClick={() => handleSwipe("no")}
            >
              <FiX size={24} /> No
            </button>
            <button
              className="btn btn-success"
              onClick={() => handleSwipe("yes")}
            >
              <FiCheck size={24} /> Yes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Matchmaking;
