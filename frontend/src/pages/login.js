import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "../styles/login.css";
import "../styles/navbar.css";
import logo from "../images/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      setMessage("Login failed");
    }
  };

  return (
    <div>
      <div className="Topnav">
        <img src={logo} alt="Company Logo" className="logo" style={{ maxWidth: '35px', maxHeight: '35px' }} />
        <input className="input1" placeholder="Search" style={{ marginLeft: '20px' }} />
      </div>
      <center>
        <form className="form1" onSubmit={handleLogin}>
          <h2 className="form-title">Sign in to your account</h2>
          <input
            className="input-container"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
          <input
            className="input-container"
            type="password" // Fixed input type
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button className="submit" type="submit">
            Login
          </button>
          {message && <p>{message}</p>}
          <p className="signup-link">
            No account?
            <NavLink to="/signup">
              <p>Sign Up</p>
            </NavLink>
          </p>
        </form>
      </center>
    </div>
  );
};

export default Login;
