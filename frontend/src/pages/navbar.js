import React from 'react';
import "../styles/navbar.css";
import logo from "../images/logo.png";
import { FaHome, FaBell } from "react-icons/fa"
import { NavLink } from "react-router-dom";
import { AiOutlineMessage } from "react-icons/ai";
import { MdAccountBox } from "react-icons/md";

function Navbar() {  
  return (
    <div className="Topnav">
      <img src={logo} alt="Company Logo" className='logo' style={{ maxWidth: '35px', maxHeight: '35px' }} />
      <input className="input" placeholder="Search" />
      <div className='icons'>
        <span className='homei'>
          <NavLink to="/">
            <FaHome />
          </NavLink>
        </span>
        <span className='message'>
          <NavLink to="/message">
            <AiOutlineMessage />
          </NavLink>
        </span>
        <span className='noti'>
          <NavLink to="/notification">
            <FaBell />
          </NavLink>
        </span>
        <span className='acc'>
          <NavLink to="/account">
            <MdAccountBox />
          </NavLink>
        </span>
      </div>
    </div>
  );
}

export default Navbar;
