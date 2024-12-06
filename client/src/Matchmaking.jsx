import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Matchmaking() {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("loading");
  const [swipesLeft, setSwipesLeft] = useState(5);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  const username = document.cookie
    .split("; ")
    .find((row) => row.startsWith("username="))
    ?.split("=")[1];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) {
        setError("Username not found in cookies.");
        return;
      }

      try {
        const subscriptionResponse = await axios.get(
          "http://localhost:3001/subscription",
          { params: { username } }
        );

        if (subscriptionResponse.data.success) {
          const type = subscriptionResponse.data.subscriptionType;
          setSubscriptionType(type);
          if (type === "premium") {
            setSwipesLeft(Infinity);
          }
        } else {
          setError(
            subscriptionResponse.data.message || "Failed to fetch subscription type."
          );
          setSubscriptionType("basic");
        }

        const [jobsResponse, userResponse] = await Promise.all([
          axios.get(`http://localhost:3001/all-jobs?username=${username}`),
          axios.get(`http://localhost:3001/user-skills?username=${username}`),
        ]);

        if (jobsResponse.data.success && userResponse.data.success) {
          const allJobs = jobsResponse.data.jobs || [];
          const userSkills = userResponse.data.skills || [];
          const alreadySwiped = jobsResponse.data.alreadySwiped || [];

          const filteredJobs = allJobs.filter(
            (job) => !alreadySwiped.includes(job._id)
          );

          const jobsWithSuitability = filteredJobs.map((job) => {
            const totalSkills = job.skills?.length || 0;
            const matchingSkills = (job.skills || []).filter((skill) =>
              userSkills.includes(skill)
            ).length;

            let suitabilityPercentage = 0;

            if (matchingSkills > 0) {
              suitabilityPercentage =
                60 + Math.round((40 * matchingSkills) / totalSkills);
            }

            return { ...job, suitabilityPercentage };
          });

          const sortedJobs = jobsWithSuitability.sort(
            (a, b) => b.suitabilityPercentage - a.suitabilityPercentage
          );

          setJobs(sortedJobs);
        } else {
          setError("Failed to load jobs or user skills.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      }
    };

    fetchUserData();
  }, [username]);

  const handleSwipe = async (swipeDirection) => {
    if (!username || !jobs[currentIndex]) return;

    setDirection(swipeDirection);

    setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 300);

    if (subscriptionType === "basic" && swipesLeft <= 0) {
      alert("You have reached your daily swipe limit. Upgrade to Premium!");
      return;
    }

    try {
      const jobId = jobs[currentIndex]._id;
      const status = swipeDirection === 1 ? "yes" : "no";

      await axios.post("http://localhost:3001/swipe", {
        username,
        jobId,
        status,
      });

      if (subscriptionType === "basic") {
        setSwipesLeft((prev) => prev - 1);
      }
    } catch (err) {
      console.error("Error saving swipe:", err.response?.data || err.message);
      alert("Failed to save your swipe. Please try again.");
    }
  };

  const skipJob = () => {
    setDirection(0);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const currentJob = jobs[currentIndex];

  if (error)
    return (
      <div
        style={{
          background: "linear-gradient(to right, #007BFF, #FFA500)",
          minHeight: "100vh",
          padding: "20px",
          color: "#fff",
        }}
        className="alert alert-danger mt-4"
      >
        <button
          className="btn btn-link"
          onClick={() => navigate("/home")}
          style={{ color: "#fff" }}
        >
          <FiArrowLeft size={20} /> Back to Home
        </button>
        {error}
      </div>
    );

  if (!currentJob || (subscriptionType === "basic" && swipesLeft <= 0))
    return (
      <div
        style={{
          background: "linear-gradient(to right, #007BFF, #FFA500)",
          minHeight: "100vh",
          padding: "20px",
          color: "#fff",
        }}
        className="text-center mt-4"
      >
        <h4>No more jobs to display.</h4>
        <p>
          {subscriptionType === "basic" && swipesLeft <= 0
            ? "You have reached your daily swipe limit. Upgrade to Premium for unlimited matches!"
            : ""}
        </p>
        <button
          className="btn btn-light mt-3"
          onClick={() => navigate("/home")}
          style={{ color: "#007BFF" }}
        >
          <FiArrowLeft size={20} /> Back to Home
        </button>
      </div>
    );

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
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: "24px",
          cursor: "pointer",
        }}
      >
        <FiArrowLeft size={30} />
      </button>

      <h2 style={{ textAlign: "center", fontWeight: "bold" }}>Matchmaking</h2>
      {subscriptionType === "basic" && (
        <p className="text-danger">
          Daily swipe limit: {swipesLeft} remaining. Upgrade to Premium for
          unlimited swipes!
        </p>
      )}

      <div className="card-container">
        <AnimatePresence>
          <motion.div
            key={currentJob._id}
            className="card p-4 shadow-lg"
            initial={{ x: direction === 1 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === 1 ? 300 : -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              maxWidth: "450px", // Adjusted width to make the box thinner
              margin: "0 auto",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#fff",
              padding: "20px",
              color: "#333",
              position: "relative",
            }}
          >
            {currentJob.suitabilityPercentage > 0 && ( // Only show if percentage is greater than 0
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  width: "80px",
                  height: "80px",
                }}
              >
                <CircularProgressbar
                  value={currentJob.suitabilityPercentage}
                  text={`${currentJob.suitabilityPercentage}%`}
                  styles={buildStyles({
                    textSize: "16px",
                    textColor: "#333",
                    pathColor: "#007BFF",
                    trailColor: "#E5E5E5",
                  })}
                />
              </div>
            )}
            <div className="d-flex flex-column">
              <div
                className="d-flex align-items-start"
                style={{
                  marginBottom: "1rem",
                  flexWrap: "wrap", // Allow wrapping for long titles
                }}
              >
                {currentJob.companyLogo && (
                  <img
                    src={currentJob.companyLogo}
                    alt="Company Logo"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                )}
                <h5
                  className="m-0"
                  style={{
                    fontWeight: "600",
                    wordBreak: "break-word",
                    maxWidth: "250px",
                    overflowWrap: "break-word",
                    textAlign: "left",
                  }}
                >
                  {currentJob.title}
                </h5>
              </div>
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
                <strong>Application Deadline:</strong>{" "}
                {new Date(currentJob.applicationDeadline).toLocaleDateString()}
              </p>
              <p>
                <strong>Skills:</strong>{" "}
                {currentJob.skills && currentJob.skills.length > 0
                  ? currentJob.skills.join(", ")
                  : "No specific skills mentioned"}
              </p>
            </div>
            <div className="text-center mt-3">
              <button
                className="btn btn-danger me-2"
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}
                onClick={() => handleSwipe(-1)}
              >
                Reject
              </button>
              <button
                className="btn btn-warning me-2"
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}
                onClick={skipJob}
              >
                Skip
              </button>
              <button
                className="btn btn-success"
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}
                onClick={() => handleSwipe(1)}
              >
                Accept
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Matchmaking;