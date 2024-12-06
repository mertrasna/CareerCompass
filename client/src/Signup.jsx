import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import axios from "axios";
import Cookies from "js-cookie"; // For saving cookies
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      setErrorMessage("All fields must be filled.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and include uppercase letters, numbers, and special characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    axios
      .post("http://localhost:3002/register", {
        firstName,
        lastName,
        username,
        email,
        password,
      })
      .then((result) => {
        if (result.data.success) {
          Cookies.set("username", result.data.user.username);
          navigate("/completion");
        } else {
          setErrorMessage("Registration failed, please try again.");
        }
      })
      .catch((err) => {
        if (err.response && err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("An error occurred during registration. Please try again.");
        }
      });
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
      {/* Header Section */}
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

      {/* Tagline Above the Form */}
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

      {/* Signup Form Section */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
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
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstName" style={{ color: "#333" }}>
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder="Enter First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" style={{ color: "#333" }}>
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              className="form-control"
              placeholder="Enter Last Name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="username" style={{ color: "#333" }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Enter Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" style={{ color: "#333" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" style={{ color: "#333" }}>
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" style={{ color: "#333" }}>
              Retype Password
            </label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="form-control"
                placeholder="Retype Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ marginTop: "10px" }}
          >
            Register
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "10px", color: "#333" }}>
          Already Have an Account?
        </p>
        <Link
          to="/login"
          className="btn btn-outline-secondary w-100 text-decoration-none"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
