import React, { useState } from 'react';
import axios from 'axios';
import "../styles/navbar.css";
import "../styles/signup.css";
import logo from "../images/logo.png";

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
      window.location.href = '/'; // Redirect to login page after successful signup
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Failed to sign up');
    }
  };

  return (
    <div >
       <div className="Topnav">
     <img src={logo} alt="Company Logo" className='logo' style={{ maxWidth: '35px', maxHeight: '35px', left: '40%' } } />
  <input className="input1" placeholder="Search" style={{ left: '45%' }} />
  
  <form className="form6" onSubmit={handleSubmit}>
      
   <h3 className="title6" >Signup</h3>
   <p class="message6">Signup now and get full access to our app. </p>
     <div className="flex6">
          <label> <span>First Name </span></label>
          <input
          className="input-container"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          /><br />
        </div>
        <div>
          <label> <span>Last Name</span></label>
          <input
          className="input-container"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          /><br />
        </div>
        <div>
          <label> <span>Email</span></label>
          <input
          className="input-container"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br />
        </div>
        <div>
          <label> <span>Password</span></label>
          <input
          className="input-container"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br />
        </div>
        <div>
          <label>Role</label>
          <label className="radio-button">
          <input
            type="radio"
            value="teacher"
            checked={role === 'teacher'}
            onChange={() => setRole('teacher')}
          /> 
           <span className="radio"></span>
          
          Teacher
          </label>

          <label className="radio-button">
          <input
            type="radio"
            value="student"
            checked={role === 'student'}
            onChange={() => setRole('student')}
            
          /> 
          <span className="radio"></span>
          Student

</label>

        </div>
        <button className="submit6" type="submit">Signup</button>
        <p className="signin">Already have an acount ? <NavLink to="/">
            Signin
          </NavLink> </p>
      </form>
      
    </div></div>
  );
}
