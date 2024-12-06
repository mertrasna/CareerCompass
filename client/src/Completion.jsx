import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie to access cookies
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
  const [errors, setErrors] = useState({
    dob: "",
    location: "",
    companyName: "",
    contactNumber: "",
    skills: "",
    preferredJobType: "",
  });
// api for location fir user to put in
  const geoapifyApiKey = "21e751dc4d7a4a12a21c8501d6c70d8f";

  const skillOptions = [
    "Microsoft Office",
    "Excel",
    "Accounting",
    "JavaScript",
    "React",
    "Data Analysis",
    "Project Management",
    "Python",
    "Java",
    "C++",
    "Machine Learning",
    "Marketing",
    "Sales",
    "Communication",
    "Team Leadership",
    "Problem Solving",
    "Time Management",
    "SQL",
    "Cybersecurity",
    "Network Administration",
  ];

  const username = Cookies.get("username");

  const handleLocationChange = (e) => {
    setLocationQuery(e.target.value);

    if (e.target.value.length > 3) {
      axios
        .get(
          `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
            e.target.value
          )}&apiKey=${geoapifyApiKey}`
        )
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
// if job seeker = 
  const validateFirstStep = () => {
    let formErrors = {};

    if (!dob) formErrors.dob = "Date of Birth is required";
    if (!selectedLocation) formErrors.location = "Location is required";
    if (role === "job_seeker" && !skills.length)
      formErrors.skills = "Please select at least one skill";
    if (
      role === "job_seeker" &&
      !preferredJobType
    )
      formErrors.preferredJobType = "Preferred Job Type is required";

    setErrors(formErrors);
    console.log("First step errors:", formErrors);
    return Object.keys(formErrors).length === 0;
  };
// if employer
  const validateSecondStep = () => {
    let formErrors = {};

    if (role === "employer" && !companyName)
      formErrors.companyName = "Company Name is required";
    if (role === "employer" && !contactNumber)
      formErrors.contactNumber = "Contact Number is required";

    setErrors(formErrors);
    console.log("Second step errors:", formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFirstStep() || !validateSecondStep()) return;

    const profileData = {
      username,
      dob,
      location: selectedLocation,
      role,
      preferredJobType,
      companyName: role === "employer" ? companyName : undefined,
      contactNumber: role === "employer" ? contactNumber : undefined,
      skills: role === "job_seeker" ? skills : undefined,
    };

    console.log("Selected role:", role);

    try {
      const response = await axios.post(
        "http://localhost:3003/complete-profile",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      console.log(response.data);
      window.location.href = "/home";
    } catch (error) {
      console.error("Error completing profile:", error);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #007BFF, #FFA500)",
        fontFamily: "'Nunito Sans', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          padding: "30px",
          maxWidth: "600px",
          width: "90%",
        }}
      >
        <h2
          style={{
            background:
              "linear-gradient(to right, #007BFF, #FFA500)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textAlign: "center",
          }}
        >
          Complete Your Profile
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Date of Birth */}
          <div className="mb-3">
            <label>Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={`form-control ${
                errors.dob ? "is-invalid" : ""
              }`}
              max="2020-12-31"
            />
            {errors.dob && <div className="text-danger">{errors.dob}</div>}
          </div>

          {/* Location */}
          <div className="mb-3">
            <label>Location</label>
            <div className="position-relative">
              <input
                type="text"
                value={locationQuery}
                onChange={handleLocationChange}
                className={`form-control ${
                  errors.location ? "is-invalid" : ""
                }`}
                placeholder="Enter location"
              />
              {locationResults.length > 0 && (
                <ul
                  className="list-group position-absolute w-100 mt-1"
                  style={{ zIndex: 100 }}
                >
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
            {errors.location && (
              <div className="text-danger">{errors.location}</div>
            )}
          </div>

          {/* Role */}
          <div className="mb-3">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-control"
            >
              <option value="job_seeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {/* Conditional  */}
          {role === "job_seeker" && (
            <>
              <div className="mb-3">
                <label>Preferred Job Type</label>
                <select
                  value={preferredJobType}
                  onChange={(e) => setPreferredJobType(e.target.value)}
                  className={`form-control ${
                    errors.preferredJobType ? "is-invalid" : ""
                  }`}
                >
                  <option value="">Select Job Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="remote">Remote</option>
                  <option value="mini-job">Mini-job</option>
                </select>
                {errors.preferredJobType && (
                  <div className="text-danger">{errors.preferredJobType}</div>
                )}
              </div>

              <div className="mb-3">
                <label>Skills</label>
                <div className="d-flex flex-wrap">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className={`btn btn-sm m-1 ${
                        skills.includes(skill)
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => handleSkillSelect(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                {errors.skills && (
                  <div className="text-danger">{errors.skills}</div>
                )}
              </div>
            </>
          )}

          {role === "employer" && (
            <>
              <div className="mb-3">
                <label>Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={`form-control ${
                    errors.companyName ? "is-invalid" : ""
                  }`}
                />
                {errors.companyName && (
                  <div className="text-danger">{errors.companyName}</div>
                )}
              </div>

              <div className="mb-3">
                <label>Contact Number</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={handleContactNumberChange}
                  className={`form-control ${
                    errors.contactNumber ? "is-invalid" : ""
                  }`}
                />
                {errors.contactNumber && (
                  <div className="text-danger">{errors.contactNumber}</div>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-success w-100"
            style={{
              borderRadius: "8px",
              background:
                "linear-gradient(to right, #007BFF, #FFA500)",
              color: "#ffffff",
            }}
          >
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Completion;
