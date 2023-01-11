import React from 'react'
import "./Header.css";
import clientlogo from "../../Assets/clientlogo.png"
import { Link } from 'react-router-dom';
const Header = () => {
  return (
    <div className='main_Menubar'>
       <Link  className='main_Menubar' to="/home">
       <img  className='clientLogo' src={clientlogo} alt="clientlogo"/>
       </Link> 
        <div className='subMenubar'>
        <Link to="/procedureandpackage" style={{ textDecoration: 'none' ,color:"white"}}>Procedure and Package</Link>
        <Link to="/OPDVisit" style={{ textDecoration: 'none' ,color:"white"}}>OPD Visit</Link>
        <Link to="/patientregister" style={{ textDecoration: 'none' ,color:"white"}}>OPD patient Register</Link>
        </div>
       </div>
  )
}

export default Header