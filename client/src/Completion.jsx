import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to access cookies
import React, { useState } from "react";

function Completion() {
  const [dob, setDob] = useState("");
  const [role, setRole] = useState("employer");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [skills, setSkills] = useState([]);
  const [preferredJobType, setPreferredJobType] = useState(""); // New state for Preferred Job Type
  const [errors, setErrors] = useState({ dob: "", location: "", companyName: "", contactNumber: "", skills: "", preferredJobType: "" });

  const geoapifyApiKey = "21e751dc4d7a4a12a21c8501d6c70d8f";

  const skillOptions = [
    "Microsoft Office", "Excel", "Accounting", "JavaScript", "React", 
    "Data Analysis", "Project Management", "Python", "Java", 
    "C++", "Machine Learning", "Marketing", "Sales", "Communication",
    "Team Leadership", "Problem Solving", "Time Management", "SQL",
    "Cybersecurity", "Network Administration"
  ];

  // Retrieve the username from cookies
  const username = Cookies.get("username");

  const handleLocationChange = (e) => {
    setLocationQuery(e.target.value);

    if (e.target.value.length > 3) {
      axios
        .get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(e.target.value)}&apiKey=${geoapifyApiKey}`)
        .then((response) => {
          setLocationResults(response.data.features);
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
        });
    } else {
      setLocationResults([]);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.properties.formatted);
    setLocationResults([]);
    setLocationQuery(location.properties.formatted);
  };

  const handleSkillSelect = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    } else {
      setSkills(skills.filter((s) => s !== skill));
    }
  };

  const handleContactNumberChange = (e) => {
    const input = e.target.value;
    const filteredInput = input.replace(/[^0-9+\- ]/g, ""); // Allows only numbers, +, -, and spaces
    setContactNumber(filteredInput);
  };

  const validateFirstStep = () => {
    let formErrors = {};

    if (!dob) formErrors.dob = "Date of Birth is required";
    if (!selectedLocation) formErrors.location = "Location is required";
    if (role === "job_seeker" && !skills.length) formErrors.skills = "Please select at least one skill";
    if (role === "job_seeker" && !preferredJobType) formErrors.preferredJobType = "Preferred Job Type is required"; // Validation for Preferred Job Type

    setErrors(formErrors);
    console.log("First step errors:", formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const validateSecondStep = () => {
    let formErrors = {};

    if (role === "employer" && !companyName) formErrors.companyName = "Company Name is required";
    if (role === "employer" && !contactNumber) formErrors.contactNumber = "Contact Number is required";

    setErrors(formErrors);
    console.log("Second step errors:", formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateFirstStep() || !validateSecondStep()) return; // Validate both steps
  
    const profileData = {
      username,  // Add the username from cookies to the profile data
      dob,
      location: selectedLocation,
      role,
      preferredJobType, // Send the preferred job type
      companyName: role === "employer" ? companyName : undefined,
      contactNumber: role === "employer" ? contactNumber : undefined,
      skills: role === "job_seeker" ? skills : undefined,
    };
    
    console.log("Selected role:", role);

  
    try {
      // Send the data to the backend to update the user's profile
      const response = await axios.post("http://localhost:3001/complete-profile", profileData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`  // Assuming JWT token for auth
        }
      });
  
      console.log(response.data);
      window.location.href = "/home";
    } catch (error) {
      console.error("Error completing profile:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="bg-white p-4 rounded w-50">
        <h2>Complete Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label><strong>Date of Birth</strong></label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
              max="2020-12-31"
            />
            {errors.dob && <div className="text-danger">{errors.dob}</div>}
          </div>

          <div className="mb-3">
            <label><strong>Location</strong></label>
            <div className="position-relative">
              <input
                type="text"
                value={locationQuery}
                onChange={handleLocationChange}
                className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                placeholder="Enter location or address"
              />
              {locationResults.length > 0 && (
                <ul className="list-group position-absolute w-100 mt-1" style={{ zIndex: 100 }}>
                  {locationResults.map((location, index) => (
                    <li
                      key={index}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleLocationSelect(location)}
                    >
                      {location.properties.formatted}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {errors.location && <div className="text-danger">{errors.location}</div>}
          </div>

          <div className="mb-3">
            <label><strong>Role</strong></label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-control"
            >
              <option value="job_seeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {role === "job_seeker" && (
            <>
              <div className="mb-3">
                <label><strong>Preferred Job Type</strong></label>
                <select
                  value={preferredJobType}
                  onChange={(e) => setPreferredJobType(e.target.value)}
                  className={`form-control ${errors.preferredJobType ? 'is-invalid' : ''}`}
                >
                  <option value="">Select Preferred Job Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="remote">Remote</option>
                  <option value="mini-job">Mini-job</option>
                </select>
                {errors.preferredJobType && <div className="text-danger">{errors.preferredJobType}</div>}
              </div>

              <div className="mb-3">
                <label><strong>Skills</strong></label>
                <div className="d-flex flex-wrap">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className={`btn btn-sm m-1 ${skills.includes(skill) ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleSkillSelect(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                {errors.skills && <div className="text-danger">{errors.skills}</div>}
              </div>
            </>
          )}

          {role === "employer" && (
            <>
              <div className="mb-3">
                <label><strong>Company Name</strong></label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                />
                {errors.companyName && <div className="text-danger">{errors.companyName}</div>}
              </div>

              <div className="mb-3">
                <label><strong>Contact Number</strong></label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={handleContactNumberChange}
                  className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
                />
                {errors.contactNumber && <div className="text-danger">{errors.contactNumber}</div>}
              </div>
            </>
          )}

          <button type="submit" className="btn btn-success w-100">
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Completion;