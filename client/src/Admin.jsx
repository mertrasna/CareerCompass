import axios from "axios";
import React, { useEffect, useState } from "react";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [subscriptionFilter, setSubscriptionFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    const matchesSubscription =
      subscriptionFilter === "All" ||
      user.subscriptionType === subscriptionFilter;
    return matchesSearch && matchesRole && matchesSubscription;
  });

  const handleRowClick = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/users/${username}`
      );
      setSelectedUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleVerifyUser = async (username) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/verify",
        {
          username, // Send username in the request body
        }
      );
      if (response.data.success) {
        alert("User verified successfully!");
        // Update the local state to reflect the change
        setSelectedUser({ ...selectedUser, verified: true });
        // Optionally update the users list if needed
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.username === username ? { ...user, verified: true } : user
          )
        );
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      alert("Failed to verify user.");
    }
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="filter-container">
        {!selectedUser && (
          <>
            <input
              type="text"
              className="search-bar"
              placeholder="Search by name, email, or username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="employer">Employer</option>
              <option value="job_seeker">Job Seeker</option>
            </select>
            <select
              className="subscription-filter"
              value={subscriptionFilter}
              onChange={(e) => setSubscriptionFilter(e.target.value)}
            >
              <option value="All">All Subscription Types</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
            </select>
          </>
        )}
      </div>

      <div className="table-container">
        {selectedUser ? (
          <div className="user-details-container">
            <button className="back-button" onClick={handleBackToList}>
              &larr; Back to Users
            </button>

            <table className="user-details-table">
              <tbody>
                {/* Dynamic content based on role */}
                {selectedUser.role === "employer" ? (
                  <>
                    <tr>
                      <td>
                        <strong>First Name:</strong>
                      </td>
                      <td>{selectedUser.firstName}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Last Name:</strong>
                      </td>
                      <td>{selectedUser.lastName}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Username:</strong>
                      </td>
                      <td>{selectedUser.username}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Email:</strong>
                      </td>
                      <td>{selectedUser.email}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Role:</strong>
                      </td>
                      <td>{selectedUser.role}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Location:</strong>
                      </td>
                      <td>{selectedUser.location || "Not provided"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Company Name:</strong>
                      </td>
                      <td>{selectedUser.companyName || "Not provided"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Contact Number:</strong>
                      </td>
                      <td>{selectedUser.contactNumber || "Not provided"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Posts:</strong>
                      </td>
                      <td>
                        {selectedUser.posts.length > 0
                          ? selectedUser.posts.join(", ")
                          : "No posts available."}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Appointments:</strong>
                      </td>
                      <td>{selectedUser.appointments || "Not available"}</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td>
                        <strong>First Name:</strong>
                      </td>
                      <td>{selectedUser.firstName}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Last Name:</strong>
                      </td>
                      <td>{selectedUser.lastName}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Username:</strong>
                      </td>
                      <td>{selectedUser.username}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Email:</strong>
                      </td>
                      <td>{selectedUser.email}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Role:</strong>
                      </td>
                      <td>{selectedUser.role}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Profile Picture:</strong>
                      </td>
                      <td>
                        {selectedUser.pfp ? (
                          <img
                            src={selectedUser.pfp}
                            alt="Profile"
                            width="50"
                          />
                        ) : (
                          "No picture available."
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <strong>Preferred Job Type:</strong>
                      </td>
                      <td>{selectedUser.preferredJobType || "Not provided"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Verified:</strong>
                      </td>
                      <td>{selectedUser.verified ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Location:</strong>
                      </td>
                      <td>{selectedUser.location || "Not provided"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Subscription Type:</strong>
                      </td>
                      <td>{selectedUser.subscriptionType}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Education:</strong>
                      </td>
                      <td>
                        {selectedUser.education.length > 0
                          ? selectedUser.education.map((edu) => (
                              <div key={edu.degree}>
                                <p>
                                  {edu.degree} at {edu.institution} (
                                  {edu.startDate} - {edu.endDate})
                                </p>
                              </div>
                            ))
                          : "No education information available."}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Experience:</strong>
                      </td>
                      <td>
                        {selectedUser.experience.length > 0
                          ? selectedUser.experience.map((exp) => (
                              <div key={exp.company}>
                                <p>
                                  {exp.role} at {exp.company} ({exp.startDate} -{" "}
                                  {exp.endDate})
                                </p>
                              </div>
                            ))
                          : "No experience information available."}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Skills:</strong>
                      </td>
                      <td>
                        {selectedUser.skills.length > 0
                          ? selectedUser.skills.join(", ")
                          : "No skills available."}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Wallet Balance:</strong>
                      </td>
                      <td>${selectedUser.wallet.balance}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Personality Type:</strong>
                      </td>
                      <td>{selectedUser.personalityType || "Not provided"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Documents:</strong>
                      </td>
                      <td>
                        {selectedUser.documents ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <img
                              src={selectedUser.documents}
                              alt="Document"
                              width="50"
                            />
                            <button
                              style={{
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleVerifyUser(selectedUser.username)
                              } // Add this
                            >
                              Accept
                            </button>
                            <button
                              style={{
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer",
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          "No documents uploaded."
                        )}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Subscription Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.username}
                    onClick={() => handleRowClick(user.username)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{user.lastName}</td>
                    <td>{user.firstName}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>{user.subscriptionType}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="loading-cell">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .admin-container {
          padding: 20px;
        }
        .admin-title {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .filter-container {
          margin-bottom: 20px;
        }
        .search-bar,
        .role-filter,
        .subscription-filter {
          margin-right: 10px;
          padding: 10px;
          font-size: 16px;
        }
        .admin-table,
        .user-details-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-table th,
        .user-details-table th,
        .admin-table td,
        .user-details-table td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }
        .loading-cell {
          text-align: center;
        }
        .back-button {
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          padding: 8px 12px;
          cursor: pointer;
          margin-bottom: 10px;
        }
        .back-button:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default Admin;