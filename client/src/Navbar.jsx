import React from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiCalendar, FiBell } from "react-icons/fi";

function Navbar({ userRole }) {
  return (
    <nav style={styles.navbar}>
      {/* Left Section: Logo and Icons */}
      <div style={styles.left}>
        <div style={styles.logo}>
          <Link to="/home" style={styles.logoLink}>
            CareerCompass
          </Link>
        </div>
        <div style={styles.icons}>
          {userRole === "job_seeker" && (
            <Link to="/search" style={styles.iconLink}>
              <FiSearch style={styles.icon} />
            </Link>
          )}
          <Link to="/calendar" style={styles.iconLink}>
            <FiCalendar style={styles.icon} />
          </Link>
          <Link to="/notifications" style={styles.iconLink}>
            <FiBell style={styles.icon} />
          </Link>
        </div>
      </div>

      {/* Right Section: Navigation Words */}
      <div style={styles.right}>
        <Link to="/settings" style={styles.navLink}>
          Settings
        </Link>
        {userRole === "job_seeker" && (
          <>
            <Link to="/subscription" style={styles.navLink}>
              Subscription
            </Link>
            <Link to="/profile" style={styles.navLink}>
              User Profile
            </Link>
            <Link to="/matchmaking" style={styles.navLink}>
              Matchmaking
            </Link>
          </>
        )}
        {userRole === "employer" && (
          <>
            <Link to="/post" style={styles.navLink}>
              Post a Job
            </Link>
            <Link to="/matchedcandidates" style={styles.navLink}>
              Matched Candidates
            </Link>
            <Link to="/viewjob" style={styles.navLink}>
              View Job Ads
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "transparent", // Fully transparent background
    color: "#fff",
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 1000,
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    marginRight: "20px",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  logoLink: {
    color: "#fff",
    textDecoration: "none",
  },
  icons: {
    display: "flex",
    gap: "15px",
  },
  iconLink: {
    color: "inherit",
    textDecoration: "none",
  },
  icon: {
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
    padding: "8px 12px", // Add padding for the rounded box
    borderRadius: "20px", // Rounded corners
    transition: "background-color 0.3s ease", // Smooth transition
  },
  navLinkHover: {
    backgroundColor: "#E0D7FF", // Light purple on hover
    color: "#7C4DFF", // Text color on hover
  },
};

export default Navbar;