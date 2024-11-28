import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

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

  const [companyLogo, setCompanyLogo] = useState(null); // For logo upload

  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Get the logged-in employer ID (Assuming it's stored in localStorage after login)
  const employerId = localStorage.getItem("employerId"); // Replace with your actual auth logic

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
    setCompanyLogo(e.target.files[0]); // Store the uploaded file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Filter out empty requirements and skills
    const filteredRequirements = formData.requirements.filter((req) => req.trim() !== "");
    const filteredSkills = formData.skills.filter((skill) => skill.trim() !== "");
  
    try {
      // Prepare the form data
      const data = new FormData();
      Object.entries({
        ...formData,
        requirements: filteredRequirements,
        skills: filteredSkills,
      }).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => data.append(key, v)); // Append array elements separately
        } else {
          data.append(key, value);
        }
      });
      if (companyLogo) data.append("companyLogo", companyLogo);
  
      const username = "Barreett57"; // Replace with the actual logged-in username
  
      const response = await axios.post("http://localhost:3001/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          username, // Pass username in headers
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
    <div className="container">
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Job Post</h5>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Job Type</label>
                  <select
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
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Requirements</label>
                  {formData.requirements.map((req, index) => (
                    <input
                      key={index}
                      type="text"
                      value={req}
                      onChange={(e) => handleArrayChange(e, index, "requirements")}
                      className="form-control mb-2"
                      placeholder={`Requirement ${index + 1}`}
                      required
                    />
                  ))}
                  <button type="button" className="btn btn-secondary" onClick={addRequirement}>
                    Add Requirement
                  </button>
                </div>
                <div className="form-group">
                  <label>Skills</label>
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
                  <button type="button" className="btn btn-secondary" onClick={addSkill}>
                    Add Skill
                  </button>
                </div>
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Company Logo</label>
                  <input
                    type="file"
                    name="companyLogo"
                    onChange={handleFileChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Salary Range</label>
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
                  <label>Application Deadline</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Post Job
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
