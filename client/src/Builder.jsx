//importing necessary modules
import axios from "axios";
import Cookies from "js-cookie";
import { jsPDF } from "jspdf"; // Import jsPDF for making PDF
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";


function Builder() {
  const [formData, setFormData] = useState(null); 
  const [originalData, setOriginalData] = useState(null); 
  const [error, setError] = useState(null); 
  const [currentSection, setCurrentSection] = useState(0); 
  const sections = [
    { id: "personalInfo", label: "Personal Info" },
    { id: "skills", label: "Skills" },
    { id: "workExperience", label: "Work Experience" },
    { id: "education", label: "Education & Achievements" },
  ];

  // Retrieve the username from cookies
  const username = Cookies.get("username");

  useEffect(() => {
    if (!username) {
      setError("User not logged in. Please log in to access your profile.");
      return;
    }

    // Fetch user data 
    axios
      .post("http://localhost:3001/userdata", { username })
      .then((res) => {
        if (res.data.success) {
          setFormData(res.data.user);
          setOriginalData(res.data.user); 
        } else {
          setError(res.data.message || "Failed to fetch user data.");
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError("An error occurred while fetching user data.");
      });
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); y
  };

  const handleReset = () => {
    setFormData(originalData); // Reset the form to the original data
  };

  const handlePreview = () => {
    console.log("Preview Updated Data:", formData);
    alert("Data has been updated locally. Check the console for details.");
  };

  //list of skills
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

  //downloading pdf
 const handleDownloadPDF = () => {
  const margin = 20; // Margin on all sides
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const sectionWidth = pageWidth - 2 * margin;
  let yOffset = margin;

  // Title Section
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text("Curriculum Vitae", pageWidth / 2, yOffset, { align: "center" });
  yOffset += 20;

  // Personal Info Section
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Personal Information", margin, yOffset);
  yOffset += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  
  const personalInfoText = [
    `Name: ${formData.firstName || "Lorem Ipsum"} ${formData.lastName || "Lorem Ipsum"}`,
    `Username: ${formData.username || "LoremIpsum123"}`,
    `Email: ${formData.email || "lorem.ipsum@example.com"}`,
    `Phone: ${formData.phone || "(123) 456-7890"}`,
    `Address: ${formData.address || "123 Lorem Street, Ipsum City"}`,
    `LinkedIn: ${formData.linkedin || "https://linkedin.com/in/lorem"}`
  ];
  
  personalInfoText.forEach((text, index) => {
    doc.text(text, margin, yOffset);
    yOffset += 7;

    // Check if yOffset exceeds the page height and add a new page if necessary
    if (yOffset > pageHeight - margin) {
      doc.addPage();
      yOffset = margin; // Reset yOffset to top of the page
    }
  });

  yOffset += 20;

  // Horizontal Line after Personal Info
  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, yOffset, pageWidth - margin, yOffset); 
  yOffset += 10;

  // Skills Section
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Skills", margin, yOffset);
  yOffset += 10;

  doc.setFont("helvetica", "normal");
  const skillsList = formData.skills?.length > 0 ? formData.skills : ["JavaScript", "React", "CSS", "Node.js", "Teamwork"];
  const skillLineHeight = 7;
  skillsList.forEach((skill, index) => {
    doc.text(`• ${skill}`, margin + 10, yOffset); 
    yOffset += skillLineHeight;

    // Check if yOffset exceeds the page height and add a new page if necessary
    if (yOffset > pageHeight - margin) {
      doc.addPage();
      yOffset = margin; // Reset yOffset to top of the page
    }
  });

  yOffset += 20;

  // Horizontal Line after Skills
  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, yOffset, pageWidth - margin, yOffset); 
  yOffset += 10;

  // Work Experience Section
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Work Experience", margin, yOffset);
  yOffset += 10;

  doc.setFont("helvetica", "normal");
  const workExperienceList = formData.workExperience?.length > 0 
    ? formData.workExperience 
    : [{ jobTitle: "Software Developer", company: "ABC Corp", period: "Jan 2020 - Dec 2022", description: "Developed web applications..." }];

  workExperienceList.forEach((work, index) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${work.jobTitle || "Job Title"}`, margin, yOffset);
    yOffset += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`${work.company || "Company Name"}`, margin, yOffset);
    yOffset += 7;
    doc.text(`${work.period || "Employment Period"}`, margin, yOffset);
    yOffset += 7;
    doc.text(work.description || "Job description here.", margin, yOffset);
    yOffset += 10;

    // Check if yOffset exceeds the page height and add a new page if necessary
    if (yOffset > pageHeight - margin) {
      doc.addPage();
      yOffset = margin; // Reset yOffset to top of the page
    }
  });

  yOffset += 20;

  // Horizontal Line after Work Experience
  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, yOffset, pageWidth - margin, yOffset); 
  yOffset += 10;

  // Education Section
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Education", margin, yOffset);
  yOffset += 10;

  doc.setFont("helvetica", "normal");
  const educationList = formData.education?.length > 0 
    ? formData.education 
    : [{ degree: "Bachelor of Science", institution: "XYZ University", period: "2016 - 2020", description: "Studied Computer Science..." }];

  educationList.forEach((education, index) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${education.degree || "Degree"}`, margin, yOffset);
    yOffset += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`${education.institution || "Institution Name"}`, margin, yOffset);
    yOffset += 7;
    doc.text(`${education.period || "Study Period"}`, margin, yOffset);
    yOffset += 7;
    doc.text(education.description || "Education description here.", margin, yOffset);
    yOffset += 10;

    // Check if yOffset exceeds the page height and add a new page if necessary
    if (yOffset > pageHeight - margin) {
      doc.addPage();
      yOffset = margin; // Reset yOffset to top of the page
    }
  });

  // Download PDF after generating content
  doc.save("user_profile_cv.pdf");
};

  
  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  if (!username) return <p>Please log in to access this page.</p>;
  if (error) return <p>{error}</p>; // Show error message if data fetching fails
  if (!formData) return <p>Loading...</p>; // Show a loading message until data is fetched

  return (
    <div style={styles.pageContainer}>
      <Navbar userRole="job_seeker" />

      {/* Progress Bar (non-clickable now) */}
      <div style={styles.progressBar}>
        {sections.map((section, index) => (
          <div
            key={section.id}
            style={{
              ...styles.progressItem,
              backgroundColor: index === currentSection ? "#007BFF" : "#FF7518", 
            }}
          >
            {section.label}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div style={styles.content}>
        {currentSection === 0 && (
          <div style={styles.section}>
            <label>FIRST NAME</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
            />
            <label>LAST NAME</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
            />
            <label>EMAIL</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
            />
            <label>PHONE NUMBER</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
            />
            <label>ADDRESS</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
            />
            <label>LINKEDIN PROFILE</label>
            <input
              type="url"
              name="linkedin"
              placeholder="https://linkedin.com/in/your-profile"
              value={formData.linkedin || ""}
              onChange={handleChange}
            />
          </div>
        )}

        {currentSection === 1 && (
          <div style={styles.section}>
            <label htmlFor="skillsInput">Skills:</label>
            <input
              id="skillsInput"
              type="text"
              name="skills"
              placeholder="Type skills and press Enter"
              value={formData.skillsInput || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  skillsInput: e.target.value, // Temporary input state for user-typed skills
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && formData.skillsInput.trim()) {
                  // Prevent duplicate entries
                  if (!formData.skills?.includes(formData.skillsInput.trim())) {
                    setFormData({
                      ...formData,
                      skills: [
                        ...(formData.skills || []),
                        formData.skillsInput.trim(),
                      ],
                      skillsInput: "", // Clear input after adding
                    });
                  }
                  e.preventDefault(); // Prevent form submission on Enter
                }
              }}
            />

            <label htmlFor="skillSelect">Or select from the list:</label>
            <select
              id="skillSelect"
              value=""
              onChange={(e) => {
                const selectedSkill = e.target.value;
                if (
                  selectedSkill &&
                  !formData.skills?.includes(selectedSkill)
                ) {
                  setFormData({
                    ...formData,
                    skills: [...(formData.skills || []), selectedSkill],
                  });
                }
              }}
            >
              <option value="">-- Select a skill --</option>
              {skillOptions.map((skill, index) => (
                <option key={index} value={skill}>
                  {skill}
                </option>
              ))}
            </select>

            {/* Display the selected skills */}
            {formData.skills?.length > 0 && (
              <div style={styles.skillsList}>
                <h4>Selected Skills:</h4>
                <ul style={styles.skillItems}>
                  {formData.skills.map((skill, index) => (
                    <li key={index} style={styles.skillItem}>
                      {skill}{" "}
                      <button
                        type="button"
                        style={styles.removeButton}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            skills: formData.skills.filter((s) => s !== skill),
                          })
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {currentSection === 2 && (
          <div style={styles.section}>
            <label>Role:</label>
            <select
              name="role"
              value={formData.role || ""}
              onChange={handleChange}
            >
              <option value="job_seeker">Job Seeker</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>

            <label>Company:</label>
            <input
              type="text"
              name="company"
              value={formData.company || ""}
              onChange={handleChange}
            />
          </div>
        )}

{currentSection === 3 && (
  <div style={styles.section}>
    <h3>Education</h3>
    {formData.education.map((educationItem, index) => (
      <div key={index} style={{ marginBottom: "10px" }}>
        <label>Degree:</label>
        <input
          type="text"
          name={`degree-${index}`}
          value={educationItem.degree || ""}
          onChange={(e) => {
            const updatedEducation = [...formData.education];
            updatedEducation[index] = { ...updatedEducation[index], degree: e.target.value };
            setFormData({ ...formData, education: updatedEducation });
          }}
        />
        <label>Institution:</label>
        <input
          type="text"
          name={`institution-${index}`}
          value={educationItem.institution || ""}
          onChange={(e) => {
            const updatedEducation = [...formData.education];
            updatedEducation[index] = { ...updatedEducation[index], institution: e.target.value };
            setFormData({ ...formData, education: updatedEducation });
          }}
        />
        <label>Year:</label>
        <input
          type="text"
          name={`year-${index}`}
          value={educationItem.year || ""}
          onChange={(e) => {
            const updatedEducation = [...formData.education];
            updatedEducation[index] = { ...updatedEducation[index], year: e.target.value };
            setFormData({ ...formData, education: updatedEducation });
          }}
        />
        <button
          type="button"
          onClick={() => {
            const updatedEducation = formData.education.filter((_, idx) => idx !== index);
            setFormData({ ...formData, education: updatedEducation });
          }}
        >
          Remove
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={() => {
        const newEducationRow = { degree: "", institution: "", year: "" };
        setFormData({ ...formData, education: [...formData.education, newEducationRow] });
      }}
    >
      Add Education Row
    </button>
  </div>
)}



        {/* Navigation Buttons inside the content */}
        <div style={styles.buttonContainer}>
          <button
            onClick={goToPreviousSection}
            disabled={currentSection === 0}
            style={{
              ...styles.button,
              borderRadius: "50%",
              border: "2px solid #007bff",
              backgroundColor: "transparent",
              padding: "10px 20px",
              cursor: currentSection === 0 ? "not-allowed" : "pointer",
            }}
          >
            <span style={{ fontSize: "18px" }}>&#8592;</span> {/* Left arrow */}
          </button>

          <button
            onClick={goToNextSection}
            disabled={currentSection === sections.length - 1}
            style={{
              ...styles.button,
              borderRadius: "50%",
              border: "2px solid #007bff",
              backgroundColor: "transparent",
              padding: "10px 20px",
              cursor:
                currentSection === sections.length - 1
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            <span style={{ fontSize: "18px" }}>&#8594;</span>{" "}
            {/* Right arrow */}
          </button>
        </div>

        {/* Actions inside the content */}
        <div style={styles.buttonContainer}>
          <button onClick={handleDownloadPDF}>Download PDF</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: "#FF7518",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    paddingTop: "70px",
    overflow: "hidden",
    position: "fixed",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  progressBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: "10px",
    marginTop: "16px",
    position: "fixed",
    top: "60px",
    left: 0,
    right: 0,
    zIndex: 500,
  },
  progressItem: {
    flex: 1,
    textAlign: "center",
    padding: "10px",
    borderRadius: "10px",
    margin: "0 5px",
    cursor: "pointer",
    border: "2px solid white",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
    color: "white",
    backgroundColor: "transparent",
  },
  progressItemActive: {
    color: "#fff",
    backgroundColor: "#FF7518",
    borderColor: "#FF7518",
  },
  content: {
    width: "500px",
    height: "600px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "20px",
    marginTop: "120px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",
    color: "#FF7518", // This will set all text inside content to orange
  },
  section: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    borderRadius: "30px",
  },
  actions: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
  },
  skillsList: {
    marginTop: "10px",
  },
  skillItems: {
    listStyleType: "none",
    padding: 0,
  },
  skillItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px 0",
    color: "#FF7518", // Orange text for individual skills
  },
  removeButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "red",
    cursor: "pointer",
    fontSize: "12px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    alignItems: "center",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
    padding: "15px",
    borderRadius: "50%",
    backgroundColor: "transparent",
    border: "2px solid #007bff",
    color: "#007bff",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  buttonDisabled: {
    cursor: "not-allowed",
    opacity: 0.5,
  },
};

export default Builder;