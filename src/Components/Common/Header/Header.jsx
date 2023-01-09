import React from 'react'
import "./Header.css";
import clientlogo from "../../Assets/clientlogo.png"
import { Link } from 'react-router-dom';
const Header = () => {
  return (
    <div className='main_Menubar'>
        <img  className='clientLogo' src={clientlogo} alt="clientlogo"/>
        <div className='subMenubar'>
        <Link to="/procedureandpackage" style={{ textDecoration: 'none' ,color:"white"}}>Procedure and Package</Link>
        <Link to="/OPDVisit" style={{ textDecoration: 'none' ,color:"white"}}>OPD Visit</Link>
        </div>
       </div>
  )
}

export default Header