import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [newDocument, setNewDocument] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cardHolderName: "",
    cardType: "",
    cvv: "",
  });

  const resetCardDetails = () => {
    setCardDetails({
      cardNumber: "",
      expiryDate: "",
      cardHolderName: "",
      cardType: "",
      cvv: "",
    });
  };

  const defaultProfilePic = "http://localhost:3001/uploads/pfp.png";

  useEffect(() => {
    const username = Cookies.get("username");

    if (!username) {
      setError("Username not found in cookies");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.post("http://localhost:3001/userdata", {
          username,
        });
        setUser(response.data.user);
        setProfilePic(response.data.user.pfp || defaultProfilePic);
        setLoading(false);
        if (response.data.user.cardDetails) {
            setCardDetails(response.data.user.cardDetails);
          }
      } catch (err) {
        setError("Error fetching user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const updateCardDetails = async (e) => {
    e.preventDefault();
    console.log(cardDetails); // Check cardDetails before sending
    const username = Cookies.get("username");
  
    try {
      const response = await axios.post("http://localhost:3001/updateCardDetails", {
        username,
        cardDetails,
      });
      setUser(response.data.user);
      setError(null);
      alert('Card details updated successfully');
    } catch (err) {
      setError("Failed to update card details");
      console.error(err);
    }
  };
  

  const updateProfilePicture = async () => {
    if (!newProfilePic) {
      setError("No file selected for profile picture");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", newProfilePic);
    formData.append("username", Cookies.get("username"));

    try {
      const response = await axios.post(
        "http://localhost:3001/updateProfilePic",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProfilePic(response.data.profilePicUrl || defaultProfilePic);
      setIsProfileModalOpen(false);
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setError("Failed to upload profile picture");
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
      const response = await axios.post("http://localhost:3001/uploadDocument", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Document uploaded successfully:", response.data);
      setIsVerifyModalOpen(false);
    } catch (err) {
      console.error("Error uploading document:", err);
      setError("Failed to upload document");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewProfilePic(e.target.files[0]);
    }
  };

  const handleDocumentChange = (e) => {
    if (e.target.files[0]) {
      setNewDocument(e.target.files[0]);
    }
  };

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setNewProfilePic(null);
  };

  const openVerifyModal = () => setIsVerifyModalOpen(true);
  const closeVerifyModal = () => {
    setIsVerifyModalOpen(false);
    setNewDocument(null);
  };

  const calculateProfileCompletion = () => {
    if (!user) return 0;

    let completedFields = 0;
    if (user.firstName) completedFields++;
    if (user.lastName) completedFields++;
    if (user.username) completedFields++;
    if (user.email) completedFields++;
    if (user.location) completedFields++;
    if (user.subscriptionType) completedFields++;
    if (user.skills?.length) completedFields++;
    if (user.preferredJobType) completedFields++;
    if (user.personalityType) completedFields++;

    return Math.round((completedFields / 9) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  if (loading)
    return <div style={styles.loading}>Loading...</div>;

  if (error)
    return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/home")} style={styles.backButton}>
        <FiArrowLeft size={24} />
      </button>
      <h1 style={styles.subHeading}>
        {user.firstName} {user.lastName}'s Profile
      </h1>

      <div style={styles.profileCard}>
        <div style={styles.profileImage}>
          <img
            src={profilePic}
            alt="Profile"
            onError={() => setProfilePic(defaultProfilePic)}
            style={styles.profilePic}
          />
          <button onClick={openProfileModal} style={styles.uploadButton}>
            Upload New
          </button>
        </div>
        <div style={styles.profileDetails}>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <hr style={styles.divider} />
          <p>
            <strong>Location:</strong> {user.location}
          </p>
          <hr style={styles.divider} />
          <p>
            <strong>Subscription Type:</strong> {user.subscriptionType}
          </p>
          <hr style={styles.divider} />
          <p>
            <strong>Skills:</strong> {user.skills?.join(", ") || "N/A"}
          </p>
          <hr style={styles.divider} />
          <p>
            <strong>Preferred Job Type:</strong> {user.preferredJobType || "N/A"}
          </p>
          <button
            onClick={() => navigate("/editprofile")}
            style={styles.editButton}
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div style={styles.profileCompletion}>
        <h2 style={styles.subHeading}>Profile Completion</h2>
        <div style={styles.completionBar}>
          <div
            style={{
              ...styles.completionProgress,
              width: `${profileCompletion}%`,
            }}
          ></div>
        </div>
        <p>{profileCompletion}% Complete</p>
        {profileCompletion === 100 && (
          <div style={styles.verificationContainer}>
  <p>
    <strong>Verification Status:</strong>
    {user.verified ? (
      <span style={styles.verifiedContainer}>
        <span style={styles.verifiedTick}>✔</span> VERIFIED
      </span>
    ) : (
      <>
        <span style={styles.notVerified}>Not Verified</span>
        <h3 style={styles.subHeading}>VERIFY YOURSELF</h3>
        <button onClick={openVerifyModal} style={styles.verifyButton}>
          Verify Yourself
        </button>
      </>
    )}
  </p>
</div>


        )}
      </div>

      {isProfileModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Choose a New Profile Picture</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            <div style={styles.modalButtons}>
              <button onClick={closeProfileModal} style={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={updateProfilePicture} style={styles.confirmButton}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {isVerifyModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Verify Yourself</h2>
            <p>Upload a document to verify your identity</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              onChange={handleDocumentChange}
              style={styles.fileInput}
            />
            <div style={styles.modalButtons}>
              <button onClick={closeVerifyModal} style={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={uploadDocument} style={styles.confirmButton}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

<div style={styles.cardDetailsContainer}>
  <h2 style={styles.subHeading}>Card Details</h2>
  <form onSubmit={updateCardDetails} style={styles.cardForm}>
    <label>
      Card Number:
      <input
        type="text"
        name="cardNumber"
        value={cardDetails.cardNumber || ""}  
        onChange={handleCardDetailsChange}
        required
        style={styles.inputField}
      />
    </label>
    <br />
    <label>
      Expiry Date:
      <input
        type="text"
        name="expiryDate"
        value={cardDetails.expiryDate || ""}  
        onChange={handleCardDetailsChange}
        required
        style={styles.inputField}
      />
    </label>
    <br />
    <label>
      Cardholder Name:
      <input
        type="text"
        name="cardHolderName"
        value={cardDetails.cardHolderName || ""}  
        onChange={handleCardDetailsChange}
        required
        style={styles.inputField}
      />
    </label>
    <br />
    <label>
      Card Type:
      <select
        name="cardType"
        value={cardDetails.cardType || "Visa"}  
        onChange={handleCardDetailsChange}
        required
        style={styles.inputField}
      >
        <option value="Visa">Visa</option>
        <option value="MasterCard">MasterCard</option>
        <option value="American Express">American Express</option>
        <option value="Discover">Discover</option>
      </select>
    </label>
    <br />
    <label>
      CVV:
      <input
        type="text"
        name="cvv"
        value={cardDetails.cvv || ""}  
        onChange={handleCardDetailsChange}
        required
        style={styles.inputField}
      />
    </label>
    <br />
    <button type="submit" style={styles.saveButton}>
      Save Card Details
    </button>
    <button
      type="button"
      onClick={resetCardDetails}
      style={styles.resetButton}
    >
      Reset Card Details
    </button>
  </form>
</div>

    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Nunito', sans-serif",
    background: "linear-gradient(to right, #007BFF, #FFA500)",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  header: {
    fontSize: "24px",
    color: "#fff",
    fontWeight: "bold",
    marginBottom: "30px",
    textAlign: "center",
  },
  profileCard: {
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
  },
  profileImage: {
    textAlign: "center",
    marginRight: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  profilePic: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "4px solid #fff",
    objectFit: "cover",
  },
  uploadButton: {
    background: "transparent",
    color: "#FFA500",
    padding: "8px 15px",
    border: "2px solid #FFA500",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "14px",
  },
  profileDetails: {
    flex: 1,
    color: "#fff",
    fontSize: "16px",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  editButton: {
    background: "#007BFF",
    color: "#fff",
    padding: "5px 10px",
    fontSize: "12px",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "8px",
    width: "200px",
    textAlign: "center",
    margin: "8px auto",
    display: "block",
  },
  divider: {
    border: "0",
    height: "1px",
    background: "rgba(255, 255, 255, 0.3)",
    width: "80%",
    margin: "10px auto",
  },
  profileCompletion: {
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    padding: "20px",
    maxWidth: "600px",
    margin: "20px auto",
    textAlign: "center",
  },
  completionBar: {
    background: "#e0e0e0",
    borderRadius: "25px",
    height: "20px",
    marginTop: "10px",
  },
  completionProgress: {
    background: "#4CAF50",
    height: "100%",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  cancelButton: {
    background: "red",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  confirmButton: {
    background: "#4CAF50",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    color: "#fff",
    fontSize: "20px",
    padding: "20px",
  },
  verifyButton: {
    background: "#FFA500",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  verificationContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",  
    justifyContent: "center",  
    textAlign: "center",
    marginTop: "20px",
  },
  verifiedContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#4CAF50",  
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "1.2rem",
  },
  verifiedTick: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#4CAF50",  
  },
  notVerified: {
    color: "#FF0000",  
    fontWeight: "bold",
  },
  error: {
    textAlign: "center",
    color: "red",
    fontSize: "20px",
    padding: "20px",
  },
  subHeading: {
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "0px",
    color: "#fff",
    textAlign: "center", 
    textTransform: "uppercase",  
    textDecoration: "underline",  
  textDecorationThickness: "1px",  
  textUnderlineOffset: "6px",  
  },
  description: {
    fontSize: "14px",
    marginTop: "10px",
    marginBottom: "20px",
    color: "#fff",
  },
  
cardDetailsContainer: {
  background: "rgba(255, 255, 255, 0.2)",
  borderRadius: "12px",
  padding: "20px",
  maxWidth: "600px",
  margin: "20px auto",
  textAlign: "center",
},
inputField: {
  background: "rgba(255, 255, 255, 0.4)",
  border: "1px solid #fff",
  borderRadius: "6px",
  padding: "10px",
  marginBottom: "10px",
  width: "100%",
  color: "#fff",
},
cardForm: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
},
};

export default Profile;