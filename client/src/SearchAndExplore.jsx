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

    // Fetch swiped "yes" jobs for the user
    const fetchSwipedJobs = async () => {
      try {
        const response = await axios.get("http://localhost:3001/swiped-jobs", {
          params: { username },
        });

        if (response.data.success) {
          setJobs(response.data.jobs);
          setFilteredJobs(response.data.jobs); // Initially show all jobs
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

    // Filter jobs based on search term
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(value.toLowerCase()) ||
      job.location.toLowerCase().includes(value.toLowerCase()) ||
      job.companyName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  return (
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
              <p style={styles.jobCompany}>Company: {job.companyName}</p>
              <p style={styles.jobLocation}>Location: {job.location}</p>
              <p style={styles.jobDescription}>{job.description}</p>
              <p style={styles.jobSalary}>
                Salary: ${job.salaryRange.min} - ${job.salaryRange.max}
              </p>
              <p style={styles.jobStatus}>
                <strong>Application Status:</strong> {job.status || "Pending"}
              </p>
            </div>
          ))
        ) : (
          <p style={styles.noJobs}>No saved jobs found</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#333",
  },
  searchBar: {
    marginBottom: "20px",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  jobList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  jobCard: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    textAlign: "left",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  jobTitle: {
    fontSize: "1.5rem",
    marginBottom: "10px",
    color: "#333",
  },
  jobCompany: {
    marginBottom: "5px",
    color: "#555",
  },
  jobLocation: {
    marginBottom: "5px",
    color: "#555",
  },
  jobDescription: {
    marginBottom: "10px",
    color: "#777",
  },
  jobSalary: {
    fontWeight: "bold",
    color: "#333",
  },
  jobStatus: {
    fontSize: "1rem",
    color: "#007bff",
  },
  noJobs: {
    color: "#999",
    fontSize: "1.2rem",
  },
};

export default SearchAndExplore;
