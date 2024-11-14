import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "react-google-login"; // Import Google login
import { gapi } from "gapi-script"; // Required for older versions of react-google-login
import Cookies from 'js-cookie'; // For saving cookies

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const clientId = "205575379291-8vhgu540m1nhrff1erirg4509unntru7.apps.googleusercontent.com"; // Replace with your Google Client ID

  // Initialize Google API
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
  }, [clientId]);

  // Handle form-based login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please provide both username and password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });

      if (response.data.success) {
        // Save the username in cookies
        Cookies.set("username", response.data.user.username);

        if (username.toLowerCase() === "admin") {
          window.location.href = "/admin";
        } else {
          navigate(`/home`);
        }
      } else {
        setError("Login failed. Please check your username and password.");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (response) => {
    try {
      const { tokenId } = response;
      const res = await axios.post("http://localhost:3001/google-login", { tokenId });

      if (res.data.success) {
        // Save user info in cookies
        Cookies.set("username", res.data.user.username);

        navigate(`/home`);
      } else {
        setError("Google login failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during Google login. Please try again.");
    }
  };

  // Handle Google login failure
  const handleGoogleFailure = (response) => {
    setError("Google login failed. Please try again.");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "url(/career-compass-bg.jpg) center center fixed",
        backgroundSize: "cover",
      }}
    >
      <div
        className="p-4 rounded w-25"
        style={{
          position: "absolute",
          zIndex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <h2 className="text-center mb-4">CareerCompass Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              <strong>Username</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              autoComplete="off"
              name="username"
              className="form-control rounded-0"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-success w-100 rounded-0">
            Login
          </button>
        </form>

        <div className="mt-3 text-center">
          <GoogleLogin
            clientId={clientId}
            buttonText="Login with Google"
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleFailure}
            cookiePolicy={"single_host_origin"}
          />
        </div>

        <p className="mt-3 text-center">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-decoration-none text-light"
            style={{ fontWeight: "bold" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
