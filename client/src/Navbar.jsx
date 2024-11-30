import React from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiCalendar, FiBell } from "react-icons/fi"; // Import icons from react-icons

function Navbar({ userRole }) {
  return (
    <nav style={styles.navbar}>
      {/* Left Section */}
      <div style={styles.left}>
        <div style={styles.logo}>
          <Link to="/home" style={styles.link}>
            CareerCompass
          </Link>
        </div>
      </div>

      {/* Middle Section */}
      <ul style={styles.middle}>
        {/* Conditionally render the search icon for job_seekers only */}
        {userRole === "job_seeker" && (
          <li>
            <Link to="/search" style={styles.searchLink}>
              <FiSearch style={styles.icon} />
            </Link>
          </li>
        )}
        <li>
          <Link to="/calendar" style={styles.searchLink}>
            <FiCalendar style={styles.icon} />
          </Link>
        </li>
        <li>
          <Link to="/notifications" style={styles.searchLink}>
            <FiBell style={styles.icon} />
          </Link>
        </li>
      </ul>

      {/* Right Section */}
      <ul style={styles.right}>
        <li>
          <Link to="/settings" style={styles.link}>
            Settings
          </Link>
        </li>
        {userRole === "job_seeker" && (
          <>
            <li>
              <Link to="/subscription" style={styles.link}>
                Subscription
              </Link>
            </li>
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
            <li>
              <Link to="/matchmaking" style={styles.link}>
                Matchmaking
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
              <Link to="/matchedcandidates" style={styles.link}>
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
  middle: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    alignItems: "center",
  },
  right: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  searchLink: {
    textDecoration: "none",
    color: "inherit",
    margin: "0 15px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    marginLeft: "15px",
    fontSize: "1rem",
  },
  icon: {
    fontSize: "1.5rem", // Adjust icon size
    color: "#fff", // Icon color
    cursor: "pointer",
  },
};

export default Navbar;
