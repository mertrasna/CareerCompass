import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiArrowLeft, FiMoreHorizontal } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function JobAds() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPost, setSelectedPost] = useState(null); 
  const username = document.cookie
    .split("; ")
    .find((row) => row.startsWith("username="))
    ?.split("=")[1];
// ftech all posts ONLY employer has posted
  useEffect(() => {
    const fetchEmployerPosts = async () => {
      if (!username) {
        setError("Username not found in cookies.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post("http://localhost:3006/employer-posts", {
          username,
        });

        if (response.data.success && response.data.posts.length > 0) {
          setPosts(response.data.posts);
        } else {
          setPosts([]);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load job ads. Please try again.");
        setLoading(false);
      }
    };

    fetchEmployerPosts();
  }, [username]);
// delete the job ad for the employer
  const handleDelete = async () => {
    if (!selectedPost) return;

    try {
      const response = await axios.delete(`http://localhost:3001/posts/${selectedPost}`);
      if (response.data.success) {
        alert("Job ad deleted successfully!");
        setPosts(posts.filter((post) => post._id !== selectedPost));
        setSelectedPost(null);
      } else {
        alert("Failed to delete the job ad. Please try again.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
  };

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
        onClick={() => window.history.back()}
        style={{
          color: "#fff",
          fontSize: "1.5rem",
          border: "none",
          background: "none",
        }}
      >
        <FiArrowLeft />
      </button>

      <h2
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "30px",
          color: "#fff",
        }}
      >
        Your Job Ads
      </h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : posts.length === 0 ? (
        <p className="text-center">No job ads found. Create one <a href="/post" style={{ color: "#FFD700" }}>here</a>.</p>
      ) : (
        <div>
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post._id}
                className="card shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{
                  maxWidth: "500px",
                  margin: "20px auto",
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "20px",
                  color: "#333",
                  position: "relative",
                }}
              >
                <h5>{post.title}</h5>
                <p>
                  <strong>Location:</strong> {post.location}
                </p>
                <p>
                  <strong>Type:</strong> {post.jobType}
                </p>
                <p>
                  <strong>Description:</strong> {post.description}
                </p>
                <p>
                  <strong>Company Name:</strong> {post.companyName}
                </p>
                {post.companyLogo && (
                  <div>
                    <img
                      src={post.companyLogo}
                      alt={`${post.companyName} Logo`}
                      style={{ maxWidth: "150px", marginTop: "10px" }}
                    />
                  </div>
                )}
                <p>
                  <strong>Application Deadline:</strong>{" "}
                  {new Date(post.applicationDeadline).toLocaleDateString()}
                </p>
                <FiMoreHorizontal
                  size={24}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedPost(post._id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {selectedPost && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="modal-dialog"
            role="document"
            style={{
              maxWidth: "400px",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "12px",
                padding: "20px",
                background: "#fff",
                textAlign: "center",
              }}
            >
              <h5 style={{ marginBottom: "20px", fontWeight: "bold", color: "#007BFF" }}>
                Delete Job Ad
              </h5>
              <p style={{ marginBottom: "30px", color: "#555" }}>
                Are you sure you want to delete this job ad?
              </p>
              <div className="modal-footer" style={{ display: "flex", justifyContent: "space-around" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedPost(null)}
                  style={{
                    background: "#6c757d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  style={{
                    background: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobAds;
