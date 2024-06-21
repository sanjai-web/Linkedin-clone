import React, { useState } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:3001/signup', {
        firstName,
        lastName,
        email,
        password,
        role
      });
      alert(response.data.message);
      window.location.href = '/login'; // Redirect to login page after successful signup
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Failed to sign up');
    }
  };

  return (
    <div style={{ marginTop: 500 }}>
      <h3>Signup</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          /><br />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          /><br />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br />
        </div>
        <div>
          <label>Role</label>
          <input
            type="radio"
            value="teacher"
            checked={role === 'teacher'}
            onChange={() => setRole('teacher')}
          /> Teacher
          <input
            type="radio"
            value="student"
            checked={role === 'student'}
            onChange={() => setRole('student')}
          /> Student
        </div>
        <button type="submit">Signup</button>
      </form>
      <NavLink to="/login">
            <h4 >Already have account,Login</h4>
          </NavLink>
    </div>
  );
}
