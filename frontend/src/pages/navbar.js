import React from 'react';
import "../styles/navbar.css";
import logo from "../images/logo.png";
import { FaHome } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { AiOutlineMessage } from "react-icons/ai";
import { FaBell } from "react-icons/fa";
import { MdAccountBox } from "react-icons/md";
function Navbar() {  
  return (
    <>
      <div className="Topnav">
      <img src={logo} alt="Company Logo" className='logo' style={{ maxWidth: '35px', maxHeight: '35px' }} />
      <input class="input" placeholder="Search"></input>
      <div className='icons'>
        <span className='homei'><NavLink to="/">
      <FaHome /> </NavLink> </span>
      <span className='message'><NavLink to="/message">
      <AiOutlineMessage /> </NavLink></span>
      
      <span className='noti'>
      <FaBell /></span>

      <span className='acc'>
      <MdAccountBox /></span>
      
      </div>
      </div>
    </>
  );
}

export default Navbar;
