import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Cookies from "js-cookie";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const username = Cookies.get("username");

    if (!username) {
      setError("Username not found in cookies");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.post("http://localhost:3001/userdata", { username });
        const user = response.data.user;

        setUserRole(user.role);
        setLoading(false);
      } catch (err) {
        setError("Error fetching user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar userRole={userRole} />
      <h1>Welcome to the Home Page</h1>
      {userRole === "job_seeker" ? (
        <>
          <h2>Welcome, Job Seeker!</h2>
          <button onClick={() => navigate("/quiz")}>Start Quiz</button>
          <button onClick={() => navigate("/builder")}>Go to Builder</button>
          <button onClick={() => navigate("/profile")}>View Profile</button>
        </>
      ) : userRole === "employer" ? (
        <>
          <h2>Welcome, Employer!</h2>
          <button onClick={() => navigate("/post-job")}>Post a Job</button>
          <button onClick={() => navigate("/matched-candidates")}>View Matched Candidates</button>
        </>
      ) : userRole === "admin" ? (
        <>
          <h2>Welcome, Admin!</h2>
          <p>Admin Dashboard</p>
        </>
      ) : (
        <p>Role not found. Please log in again.</p>
      )}
    </div>
  );
}

export default Home;
