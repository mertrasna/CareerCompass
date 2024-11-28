import React from "react";
import { Link } from "react-router-dom";

function Navbar({ userRole }) {
  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <div style={styles.logo}>
          <Link to="/home" style={styles.link}>
            CareerCompass
          </Link>
        </div>
      </div>

      <ul style={styles.right}>
        <li>
          <Link to="/" style={styles.link}>
            Settings
          </Link>
        </li>
        {userRole === "job_seeker" && (
          <>
            <li>
              <Link to="/profile" style={styles.link}>
                User Profile
              </Link>
            </li>
            <li>
              <Link to="/quiz" style={styles.link}>
                Quiz
              </Link>
            </li>
            <li>
              <Link to="/payment" style={styles.link}>
                Payment
              </Link>
            </li>
          </>
        )}
        {userRole === "employer" && (
          <>
            <li>
              <Link to="/post" style={styles.link}>
                Post a Job
              </Link>
            </li>
            <li>
              <Link to="/matched-candidates" style={styles.link}>
                Matched Candidates
              </Link>
            </li>
            <li>
              <Link to="/viewjob" style={styles.link}>
                View Job Ads
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "#fff",
    zIndex: 10,
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginRight: "20px",
  },
  right: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    marginLeft: "15px",
    fontSize: "1rem",
  },
};

export default Navbar;
