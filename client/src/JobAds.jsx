import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiMoreHorizontal } from "react-icons/fi";

function JobAds() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPost, setSelectedPost] = useState(null); // For modal actions

  const username = document.cookie
    .split("; ")
    .find((row) => row.startsWith("username="))
    ?.split("=")[1];

  useEffect(() => {
    const fetchEmployerPosts = async () => {
      if (!username) {
        setError("Username not found in cookies.");
        setLoading(false);
        return;
      }

      try {
        console.log("Requesting job ads for username:", username);
        const response = await axios.post("http://localhost:3001/employer-posts", {
          username,
        });

        if (response.data.success && response.data.posts.length > 0) {
          console.log("Jobs fetched from backend:", response.data.posts);
          setPosts(response.data.posts);
        } else {
          console.log("No posts found for this employer.");
          setPosts([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching employer posts:", err);
        setError("Failed to load job ads. Please try again.");
        setLoading(false);
      }
    };

    fetchEmployerPosts();
  }, [username]);

  const handleDelete = async () => {
    if (!selectedPost) return;

    try {
      const response = await axios.delete(`http://localhost:3001/posts/${selectedPost}`);
      if (response.data.success) {
        alert("Job ad deleted successfully!");
        setPosts(posts.filter((post) => post._id !== selectedPost)); // Remove deleted post
        setSelectedPost(null); // Close the modal and go back to the main page
      } else {
        alert("Failed to delete the job ad. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting job ad:", err);
      alert("An error occurred. Please try again.");
    }
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Your Job Ads</h2>
      {posts.length === 0 ? (
        <p>
          No job ads found. Create one <a href="/post">here</a>.
        </p>
      ) : (
        <div className="list-group">
          {posts.map((post) => (
            <div key={post._id} className="list-group-item position-relative">
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
              {/* Three-dot menu */}
              <FiMoreHorizontal
                size={24}
                style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer" }}
                onClick={() => setSelectedPost(post._id)} // Open the modal for the selected post
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal for Delete Action */}
      {selectedPost && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Job Ad</h5>
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={() => setSelectedPost(null)} // Close modal
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this job ad?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedPost(null)} // Close modal
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete} // Perform delete action
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
