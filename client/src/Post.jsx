import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi"; 
function Post() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    jobType: "",
    description: "",
    requirements: [""],
    skills: [""],
    companyName: "",
    salaryMin: "",
    salaryMax: "",
    applicationDeadline: ""
  });

  const [companyLogo, setCompanyLogo] = useState(null); 

  const navigate = useNavigate(); 

  const employerId = document.cookie
  .split("; ")
  .find((row) => row.startsWith("employerId="))
  ?.split("=")[1];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (e, index, key) => {
    const updatedArray = [...formData[key]];
    updatedArray[index] = e.target.value;
    setFormData({ ...formData, [key]: updatedArray });
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ""] });
  };

  const addSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, ""] });
  };

  const handleFileChange = (e) => {
    setCompanyLogo(e.target.files[0]); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const filteredRequirements = formData.requirements.filter((req) => req.trim() !== "");
    const filteredSkills = formData.skills.filter((skill) => skill.trim() !== "");
  
    try {
    
      const cookies = document.cookie
        .split("; ")
        .find((row) => row.startsWith("username="));
      const username = cookies ? cookies.split("=")[1] : null;
  
      if (!username) {
        alert("Username not found in cookies. Please log in.");
        return;
      }
  
      //  the form data
      const data = new FormData();
      Object.entries({
        ...formData,
        requirements: filteredRequirements,
        skills: filteredSkills,
      }).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => data.append(key, v));
        } else {
          data.append(key, value);
        }
      });
      if (companyLogo) data.append("companyLogo", companyLogo);
  
      const response = await axios.post("http://localhost:3001/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          username, // 
        },
      });
      console.log(response.data);
      alert("Job post created successfully!");
      navigate("/home"); // Redirect to home page after successful post
    } catch (error) {
      console.error("Error posting job:", error.response?.data || error.message);
      alert("Failed to create job post. Please try again.");
    }
  };
  
  

  return (
    <div
      style={{
        background: "linear-gradient(to right, #007BFF, #FFA500)",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      
      <button
        onClick={() => navigate("/home")}
        style={{
          background: "none",
          border: "none",
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        <FiArrowLeft size={24} />
      </button>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#333",
          }}
        >
          Create Job Post
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label
              htmlFor="title"
              style={{
                color: "#333", // Black titles
              }}
            >
              Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="location"
              style={{
                color: "#333", // Black titles
              }}
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="jobType"
              style={{
                color: "#333", 
              }}
            >
              Job Type
            </label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Job Type</option>
              <option value="Remote">Remote</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Mini Job">Mini Job</option>
            </select>
          </div>
          <div className="form-group">
            <label
              htmlFor="description"
              style={{
                color: "#333", 
              }}
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label
              style={{
                color: "#333", // Black titles
              }}
            >
              Requirements
            </label>
            {formData.requirements.map((req, index) => (
              <input
                key={index}
                type="text"
                value={req}
                onChange={(e) => handleArrayChange(e, index, "requirements")}
                className="form-control mb-2"
                placeholder={`Requirement ${index + 1}`}
              />
            ))}
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={addRequirement}
            >
              Add Requirement
            </button>
          </div>
          <div className="form-group">
            <label
              style={{
                color: "#333", 
              }}
            >
              Skills
            </label>
            {formData.skills.map((skill, index) => (
              <input
                key={index}
                type="text"
                value={skill}
                onChange={(e) => handleArrayChange(e, index, "skills")}
                className="form-control mb-2"
                placeholder={`Skill ${index + 1}`}
              />
            ))}
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={addSkill}
            >
              Add Skill
            </button>
          </div>
          <div className="form-group">
            <label
              htmlFor="companyName"
              style={{
                color: "#333", 
              }}
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="companyLogo"
              style={{
                color: "#333", 
              }}
            >
              Company Logo
            </label>
            <input
              type="file"
              id="companyLogo"
              name="companyLogo"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label
              style={{
                color: "#333", 
              }}
            >
              Salary Range
            </label>
            <div className="d-flex">
              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                className="form-control mr-2"
                placeholder="Min"
              />
              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                className="form-control"
                placeholder="Max"
              />
            </div>
          </div>
          <div className="form-group">
            <label
              htmlFor="applicationDeadline"
              style={{
                color: "#333", 
              }}
            >
              Application Deadline
            </label>
            <input
              type="date"
              id="applicationDeadline"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className="form-control"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default Post;
