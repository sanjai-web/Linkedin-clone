import "../styles/dashbord.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const handlePasswordChange = async () => {
    // Display confirmation dialog
    const confirmed = window.confirm('Are you sure you want to update your password?');
    if (!confirmed) {
      return; // Do nothing if user cancels
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3001/user/password', {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage('Error updating password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <div className='dashcontainer'>
        <h1 className="dash-title">Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
        <center>
          <MdAccountCircle style={{ width: '150px', height: '150px' }} />
        </center>
        <p><span>First Name: </span> {user.firstName}</p>
        <p> <span>Last Name: </span>{user.lastName}</p>
        <p><span>Email: </span>{user.email}</p>
      </div>
      <div className="changepass">
        <h2 className="change-title">Change Password</h2>
        <input className="input-container"
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input className="input-container"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button className="submit" onClick={handlePasswordChange}>Update Password</button>
        {message && <p>{message}</p>}
      </div>
    </>
  );
};

export default Dashboard;
