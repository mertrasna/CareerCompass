import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function SearchAndExplore() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const username = Cookies.get("username");

  useEffect(() => {
    if (!username) {
      console.log("User not logged in. Please log in to proceed.");
      return;
    }

    const fetchSwipedJobs = async () => {
      try {
        const response = await axios.get("http://localhost:3001/swiped-jobs", {
          params: { username },
        });

        if (response.data.success) {
          setJobs(response.data.jobs);
          setFilteredJobs(response.data.jobs);
        } else {
          console.error("Error fetching swiped jobs:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching swiped jobs:", error);
      }
    };

    fetchSwipedJobs();
  }, [username]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(value.toLowerCase()) ||
      job.location.toLowerCase().includes(value.toLowerCase()) ||
      job.companyName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Your Saved Jobs</h1>

        {/* Search Bar */}
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Search jobs by title, location, or company..."
            value={searchTerm}
            onChange={handleSearch}
            style={styles.searchInput}
          />
        </div>

        {/* Job List */}
        <div style={styles.jobList}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job._id} style={styles.jobCard}>
                <h2 style={styles.jobTitle}>{job.title}</h2>
                <p style={styles.jobCompany}>{job.companyName}</p>
                <p style={styles.jobLocation}>{job.location}</p>
                <p
                  style={
                    job.status === "Accepted"
                      ? styles.statusAccepted
                      : job.status === "Rejected"
                      ? styles.statusRejected
                      : styles.statusPending
                  }
                >
                  {job.status || "Pending"}
                </p>
              </div>
            ))
          ) : (
            <p style={styles.noJobs}>No saved jobs found</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #FFA500, #0056b3)", // Fading orange-to-blue gradient
    fontFamily: "'Poppins', sans-serif", // Modern font
    padding: "20px",
  },
  container: {
    width: "90%",
    maxWidth: "1000px",
    backgroundColor: "white",
    color: "#333",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "15px",
    color: "#0056b3",
  },
  searchBar: {
    marginBottom: "15px",
  },
  searchInput: {
    width: "100%",
    padding: "8px",
    fontSize: "1rem",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  jobList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Smaller, compact two-column layout
    gap: "15px",
  },
  jobCard: {
    border: "1px solid orange",
    borderRadius: "10px",
    padding: "15px",
    backgroundColor: "#fefefe", // Subtle white background
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
  },
  jobTitle: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#333",
  },
  jobCompany: {
    fontSize: "0.9rem",
    marginBottom: "5px",
    color: "#555",
  },
  jobLocation: {
    fontSize: "0.9rem",
    marginBottom: "5px",
    color: "#777",
  },
  statusAccepted: {
    fontSize: "0.85rem",
    color: "green",
    fontWeight: "bold",
  },
  statusRejected: {
    fontSize: "0.85rem",
    color: "red",
    fontWeight: "bold",
  },
  statusPending: {
    fontSize: "0.85rem",
    color: "grey",
    fontWeight: "bold",
  },
  noJobs: {
    color: "#999",
    fontSize: "1.2rem",
  },
};

export default SearchAndExplore;