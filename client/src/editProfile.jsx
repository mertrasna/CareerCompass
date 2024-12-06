import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EditProfile() {
  const [contactNumber, setContactNumber] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState(""); 
  const [preferredJobType, setPreferredJobType] = useState("");
  const [errors, setErrors] = useState({});
  const username = Cookies.get("username");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from backend
    axios
      .post("http://localhost:3003/userdata", { username })
      .then((response) => {
        const userData = response.data.user;
        setContactNumber(userData.contactNumber || "");
        setSkills(userData.skills || []);
        setPreferredJobType(userData.preferredJobType || "");
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [username]);

  const handleSkillInputKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
      const trimmedInput = skillInput.trim();

      // Add the new skill if it's not empty and not already present
      if (trimmedInput && !skills.includes(trimmedInput)) {
        setSkills([...skills, trimmedInput]);
        setSkillInput(""); // Clear input field
      }
    }
  };

  const handleSkillRemove = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleContactNumberChange = (e) => {
    const input = e.target.value.replace(/[^0-9+\- ]/g, ""); // Allow only valid characters
    setContactNumber(input);
  };

  const validateProfile = () => {
    let formErrors = {};

    if (skills.length === 0) formErrors.skills = "Please enter at least one skill";
    if (!preferredJobType) formErrors.preferredJobType = "Preferred Job Type is required";
    if (contactNumber && contactNumber.length < 10)
      formErrors.contactNumber = "Contact Number should be at least 10 digits";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate the form before making the request
    if (!validateProfile()) return;
  
    const updatedData = {
      username,
      contactNumber,
      skills,
      preferredJobType,
    };
  
    console.log("Updated Data Payload:", updatedData);
  
    try {
      await axios.post("http://localhost:3003/complete-profile", updatedData);
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert("An error occurred while updating your profile.");
    }
  };
  

  return (
    <div className="position-relative">
      <button
        type="button"
        className="btn btn-secondary position-absolute top-0 start-0 m-3"
        onClick={() => navigate(-1)} // Go back to the previous page
      >
        Back
      </button>

      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="bg-white p-4 rounded w-50">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>
                <strong>Skills</strong>
              </label>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillInputKeyDown}
                className={`form-control ${errors.skills ? "is-invalid" : ""}`}
                placeholder="Type a skill and press space to add"
              />
              <div className="d-flex flex-wrap mt-2">
                {skills.map((skill, index) => (
                  <span key={index} className="badge bg-primary m-1">
                    {skill}
                    <button
                      type="button"
                      className="btn-close btn-sm ms-2"
                      onClick={() => handleSkillRemove(skill)}
                    ></button>
                  </span>
                ))}
              </div>
              {errors.skills && <div className="text-danger">{errors.skills}</div>}
            </div>
            <div className="mb-3">
              <label>
                <strong>Preferred Job Type</strong>
              </label>
              <select
                value={preferredJobType}
                onChange={(e) => setPreferredJobType(e.target.value)}
                className={`form-control ${errors.preferredJobType ? "is-invalid" : ""}`}
              >
                <option value="">Select Job Type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="remote">Remote</option>
              </select>
              {errors.preferredJobType && <div className="text-danger">{errors.preferredJobType}</div>}
            </div>
            <div className="mb-3">
              <label>
                <strong>Contact Number</strong>
              </label>
              <input
                type="text"
                value={contactNumber}
                onChange={handleContactNumberChange}
                className={`form-control ${errors.contactNumber ? "is-invalid" : ""}`}
                placeholder="e.g., +123456789"
              />
              {errors.contactNumber && <div className="text-danger">{errors.contactNumber}</div>}
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
