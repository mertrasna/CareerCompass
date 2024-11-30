import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [newDocument, setNewDocument] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const username = Cookies.get('username');

    if (!username) {
      setError('Username not found in cookies');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.post('http://localhost:3001/userdata', { username });
        setUser(response.data.user);
        setProfilePic(response.data.user.pfp || 'default-profile-pic.jpg');
        setLoading(false);
      } catch (err) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const updateProfilePicture = async () => {
    if (!newProfilePic) {
      setError('No file selected for profile picture');
      return;
    }

    const formData = new FormData();
    formData.append('profilePic', newProfilePic);
    formData.append('username', Cookies.get('username'));

    try {
      const response = await axios.post('http://localhost:3001/updateProfilePic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfilePic(response.data.profilePicUrl || 'default-profile-pic.jpg');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError('Failed to upload profile picture');
    }
  };

  const uploadDocument = async () => {
    if (!newDocument) {
      setError('No document selected for upload');
      return;
    }

    const formData = new FormData();
    formData.append('document', newDocument);
    formData.append('username', Cookies.get('username'));

    try {
      const response = await axios.post('http://localhost:3001/uploadDocument', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Document uploaded successfully:', response.data);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document');
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewProfilePic(null);
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
    if (user.skills && user.skills.length > 0) completedFields++;
    if (user.preferredJobType) completedFields++;
    if (user.personalityType) completedFields++;

    return Math.round((completedFields / 9) * 100);
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  const profileCompletion = calculateProfileCompletion();

  return (
    <div style={styles.profileContainer}>
      <div style={styles.header}>
        <h1>{user.firstName} {user.lastName}'s Career Compass Profile</h1>
        <button onClick={() => navigate('/home')} style={styles.backButton}>Back to Home</button>
      </div>

      <div style={styles.profileCard}>
        <div style={styles.profileImage}>
          <img
            src={profilePic}
            alt="Profile"
            style={styles.profilePic}
          />
          <button onClick={openModal} style={styles.uploadButton}>
            Upload New Profile Picture
          </button>
        </div>
        <div style={styles.profileDetails}>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p><strong>Subscription Type:</strong> {user.subscriptionType}</p>
          <p><strong>Skills:</strong> {user.skills && user.skills.join(', ')}</p>
          <p><strong>Preferred Job Type:</strong> {user.preferredJobType}</p>
          <p><strong>Personality Type:</strong> {user.personalityType}</p>
          <button onClick={() => navigate('/editprofile')} style={styles.editProfileButton}>
            Edit Profile
          </button>
        </div>
      </div>

      <div style={styles.profileCompletion}>
        <h2>Profile Completion</h2>
        <div style={styles.completionBar}>
          <div style={{ ...styles.completionProgress, width: `${profileCompletion}%` }}></div>
        </div>
        <p>{profileCompletion}% Complete</p>
        {profileCompletion === 100 && (
          <div style={styles.verificationSection}>
            <h2>Verify Yourself</h2>
            <p>Upload a document to verify your identity</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              onChange={handleDocumentChange}
              style={styles.fileInput}
            />
            <button onClick={uploadDocument} style={styles.confirmButton}>
              Upload Document
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
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
              <button onClick={closeModal} style={styles.cancelButton}>Cancel</button>
              <button onClick={updateProfilePicture} style={styles.confirmButton}>
                Confirm Picture Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  profileContainer: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    background: 'linear-gradient(135deg, #2a2a72, #009ffd)',
    color: 'white',
    borderRadius: '8px',
    maxWidth: '800px',
    margin: 'auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    position: 'absolute', // Position it absolutely
    top: '10px', // Place it at the top
    left: '5px', // Place it to the left
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  profileCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileImage: {
    flex: 1,
    textAlign: 'center',
  },
  profilePic: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid white',
  },
  uploadButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  profileDetails: {
    flex: 2,
    paddingLeft: '20px',
  },
  editProfileButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  profileCompletion: {
    marginBottom: '20px',
  },
  completionBar: {
    background: '#e0e0e0',
    borderRadius: '25px',
    height: '20px',
    marginTop: '10px',
  },
  completionProgress: {
    background: '#4caf50',
    borderRadius: '25px',
    height: '100%',
  },
  loading: {
    textAlign: 'center',
    color: '#fff',
    fontSize: '20px',
    backgroundColor: '#009ffd',
    padding: '20px',
    borderRadius: '8px',
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontSize: '20px',
    backgroundColor: '#ffd9d9',
    padding: '20px',
    borderRadius: '8px',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
    textAlign: 'center',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  cancelButton: {
    backgroundColor: 'red',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  confirmButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  fileInput: {
    marginTop: '10px',
  },
};

export default Profile;
