import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

function Builder() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    skills: "",
    profession: "", // Add profession field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF();
  };

  // Function to call the generative API to get profession-based content
  const generateContent = async (profession) => {
    if (profession) {
      try {
        const response = await fetch("http://localhost:5000/api/generateContent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profession }),
        });
        const data = await response.json();
        if (data.content) {
          const [experience, skills] = data.content.split("\n");
          setFormData((prevState) => ({
            ...prevState,
            experience: experience.replace("Experience:", "").trim(),
            skills: skills.replace("Skills:", "").trim(),
          }));
        }
      } catch (error) {
        console.error("Error fetching generative content:", error);
      }
    }
  };

  useEffect(() => {
    if (formData.profession) {
      generateContent(formData.profession); // Call the API when the profession changes
    }
  }, [formData.profession]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Name: ${formData.name}`, 10, 10);
    doc.text(`Email: ${formData.email}`, 10, 20);
    doc.text(`Phone: ${formData.phone}`, 10, 30);
    doc.text(`Education: ${formData.education}`, 10, 40);
    doc.text(`Experience: ${formData.experience}`, 10, 50);
    doc.text(`Skills: ${formData.skills}`, 10, 60);
    doc.save("cv.pdf");
  };

  return (
    <div style={{ width: "60%", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f7f7f7", borderRadius: "10px" }}>
      <h1 style={{ textAlign: "center" }}>CV Builder</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone:</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <label>Education:</label>
          <textarea name="education" value={formData.education} onChange={handleChange} required />
        </div>
        <div>
          <label>Profession:</label>
          <select name="profession" value={formData.profession} onChange={handleChange} required>
            <option value="">Select Profession</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Teacher">Teacher</option>
            <option value="Graphic Designer">Graphic Designer</option>
            <option value="Project Manager">Project Manager</option>
          </select>
        </div>
        <div>
          <label>Experience:</label>
          <textarea name="experience" value={formData.experience} onChange={handleChange} required />
        </div>
        <div>
          <label>Skills:</label>
          <textarea name="skills" value={formData.skills} onChange={handleChange} required />
        </div>
        <button type="submit">Generate PDF</button>
      </form>
    </div>
  );
}

export default Builder;