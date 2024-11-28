import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [subscriptionFilter, setSubscriptionFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null); // Track the selected user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
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
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesSubscription =
      subscriptionFilter === 'All' || user.subscriptionType === subscriptionFilter;
    return matchesSearch && matchesRole && matchesSubscription;
  });

  const handleRowClick = async (username) => {
    console.log('Row clicked, fetching details for:', username); // Debugging
    try {
      const response = await axios.get(`http://localhost:3001/api/users/${username}`);
      console.log('User details fetched:', response.data); // Debugging
      setSelectedUser(response.data); // Load user details into state
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleBackToList = () => {
    setSelectedUser(null); // Clear the selected user to return to the table
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="filter-container">
        {!selectedUser && ( // Hide filters when user details are visible
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
              <option value="Premium">Premium</option>
            </select>
          </>
        )}
      </div>

      <div className="table-container">
        {selectedUser ? (
          // User Details View inside table container as a table
          <div className="user-details-container">
            <button className="back-button" onClick={handleBackToList}>
              &larr; Back to Users
            </button>

            <table className="user-details-table">
              <tbody>
                <tr>
                  <td><strong>First Name:</strong></td>
                  <td>{selectedUser.firstName}</td>
                </tr>
                <tr>
                  <td><strong>Last Name:</strong></td>
                  <td>{selectedUser.lastName}</td>
                </tr>
                <tr>
                  <td><strong>Username:</strong></td>
                  <td>{selectedUser.username}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>{selectedUser.email}</td>
                </tr>
                <tr>
                  <td><strong>Role:</strong></td>
                  <td>{selectedUser.role}</td>
                </tr>
                <tr>
                  <td><strong>Subscription Type:</strong></td>
                  <td>{selectedUser.subscriptionType}</td>
                </tr>
                <tr>
                  <td><strong>Location:</strong></td>
                  <td>{selectedUser.location || 'Not provided'}</td>
                </tr>
                <tr>
                  <td><strong>Education:</strong></td>
                  <td>{selectedUser.education.length > 0 ? selectedUser.education.map((edu) => (
                    <div key={edu.degree}>
                      <p>{edu.degree} at {edu.institution} ({edu.startDate} - {edu.endDate})</p>
                    </div>
                  )) : 'No education information available.'}</td>
                </tr>
                <tr>
                  <td><strong>Skills:</strong></td>
                  <td>{selectedUser.skills.length > 0 ? selectedUser.skills.join(', ') : 'No skills available.'}</td>
                </tr>
                <tr>
                  <td><strong>Experience:</strong></td>
                  <td>{selectedUser.experience.length > 0 ? selectedUser.experience.map((exp) => (
                    <div key={exp.company}>
                      <p>{exp.role} at {exp.company} ({exp.startDate} - {exp.endDate})</p>
                    </div>
                  )) : 'No experience information available.'}</td>
                </tr>
                <tr>
                  <td><strong>Profile Picture:</strong></td>
                  <td>{selectedUser.pfp ? <img src={selectedUser.pfp} alt="Profile" width="50" /> : 'No picture available.'}</td>
                </tr>
                <tr>
                  <td><strong>Personality Type:</strong></td>
                  <td>{selectedUser.personalityType || 'Not provided'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          // Users Table View
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
                    onClick={() => handleRowClick(user.username)} // Fetch user details
                    style={{ cursor: 'pointer' }}
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
                  <td colSpan="5" className="loading-cell">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Inline Styles */}
      <style jsx>{`
        .admin-container {
          padding: 20px;
        }

        .admin-title {
          font-size: 2rem;
          margin-bottom: 20px;
        }

        .filter-container {
          margin-bottom: 20px;
        }

        .search-bar,
        .role-filter,
        .subscription-filter {
          margin-right: 10px;
        }

        .table-container {
          margin-top: 20px;
        }

        .admin-table,
        .user-details-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .admin-table th,
        .admin-table td,
        .user-details-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }

        .admin-table th {
          background-color: #f4f4f4;
        }

        .loading-cell {
          text-align: center;
        }

        .user-details-container {
          padding: 20px;
          border: 1px solid #ddd;
          background-color: #f9f9f9;
          margin-top: 20px;
        }

        .back-button {
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          cursor: pointer;
        }

        .back-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Admin;