import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Home() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDocument, setNewDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const username = Cookies.get("username");

    if (!username) {
      setError("Username not found in cookies");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.post("http://localhost:3001/userdata", { username });
        const user = response.data.user;
        setUserRole(user.role);
        setLoading(false);
      } catch (err) {
        setError("Error fetching user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewDocument(e.target.files[0]);
    }
  };

  const uploadDocument = async () => {
    if (!newDocument) {
      setError("No document selected for upload");
      return;
    }

    const formData = new FormData();
    formData.append("document", newDocument);
    formData.append("username", Cookies.get("username"));

    try {
      // Example endpoint for document upload
      const response = await axios.post("http://localhost:3001/uploadDocument", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Handle the response as needed (e.g., save document URL or display success message)
      console.log(response.data);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error uploading document:", err);
      setError("Failed to upload document");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewDocument(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Navbar userRole={userRole} />
      <h1>Welcome to the Home Page</h1>

      {userRole === "job_seeker" ? (
        <>
          <h2>Welcome, Job Seeker!</h2>
          <button onClick={() => navigate("/quiz")}>Start Quiz</button>
          <button onClick={() => navigate("/builder")}>Go to Builder</button>
          <button onClick={() => navigate("/profile")}>View Profile</button>
        </>
      ) : userRole === "employer" ? (
        <>
          <h2>Welcome, Employer!</h2>
          <button onClick={() => navigate("/post-job")}>Post a Job</button>
          <button onClick={() => navigate("/matched-candidates")}>View Matched Candidates</button>
        </>
      ) : userRole === "admin" ? (
        <>
          <h2>Welcome, Admin!</h2>
          <p>Admin Dashboard</p>
        </>
      ) : (
        <p>Role not found. Please log in again.</p>
      )}

      {/* Upload Document Button */}
      <div>
        <h2>Upload Document</h2>
        <button onClick={openModal}>Upload Document</button>
      </div>

      {/* Document upload modal */}
      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Choose a Document to Upload</h2>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            <div style={styles.modalButtons}>
              <button onClick={closeModal} style={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={uploadDocument} style={styles.confirmButton}>
                Confirm Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  cancelButton: {
    backgroundColor: "red",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  confirmButton: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  fileInput: {
    marginTop: "10px",
  },
};

export default Home;