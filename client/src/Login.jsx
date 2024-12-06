import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import Cookies from "js-cookie";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
// google login api
  const clientId = "205575379291-8vhgu540m1nhrff1erirg4509unntru7.apps.googleusercontent.com";

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
  }, [clientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please provide both username and password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3002/login", {
        username,
        password,
      });

      if (response.data.success) {
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

  const handleGoogleSuccess = async (response) => {
    try {
      const { tokenId } = response;
      const res = await axios.post("http://localhost:3001/google-login", { tokenId });

      if (res.data.success) {
        Cookies.set("username", res.data.user.username);
        navigate(`/home`);
      } else {
        setError("Google login failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during Google login. Please try again.");
    }
  };

  const handleGoogleFailure = (response) => {
    setError("Google login failed. Please try again.");
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, #007BFF, #FFA500)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
        color: "#fff",
      }}
    >
      <header
        style={{
          width: "100%",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "24px",
            color: "#fff",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          CareerCompass
        </h1>
      </header>

      <h2
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#fff",
          fontSize: "28px",
          padding: "20px",
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: "8px",
          width: "30%",
          marginTop: "20px",
        }}
      >
        Match. Work. Thrive.
      </h2>

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "350px",
          width: "100%",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#333",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" style={{ color: "#333" }}>
              Username
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
            <label htmlFor="password" style={{ color: "#333" }}>
              Password
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "20px 0",
            textAlign: "center",
          }}
        >
          <hr
            style={{
              flex: 1,
              borderColor: "#ddd",
              marginRight: "10px",
            }}
          />
          <span style={{ color: "black" }}>or</span>
          <hr
            style={{
              flex: 1,
              borderColor: "#ddd",
              marginLeft: "10px",
            }}
          />
        </div>

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
          <Link to="/signup">
            <button
              className="btn btn-primary"
              style={{
                fontWeight: "bold",
                borderRadius: "5px",
                padding: "10px 20px",
              }}
            >
              Register now!
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
