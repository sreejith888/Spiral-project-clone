import React from 'react'
import "./Login.css";
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaLinkedinIn, FaTwitter, FaGlobe, FaBuilding, FaExclamationTriangle, FaUser, } from "react-icons/fa";
import { useState } from 'react';
import company_icon from "../../Assets/Screenshot 2022-12-20 170959.png";
import { useNavigate } from 'react-router-dom';
import LoginLogic from './LoginLogic';
const Login = () => {
    const  {
        values,
        onchange,
        handleValidation,
        validateField,
        isLoading,
        validationFormError}=LoginLogic();
    const navigate=useNavigate();


const handleclick= async(e)=> {
    e.preventDefault();
    if (!handleValidation()) {
        return;
      }
    if (
        values.txtLoginId.length &&
        values.txtPassword.length > 0
      )
    navigate("/home")
    
}


    return (
        <div className='main'>
            <div className='logo_area'>
                <div className='logo_header'>
                    <a className='supportext'>
                        Support<span>24</span>
                    </a>
                    <a className='supporicon' href="tel:9541414155">
                        <FaPhoneAlt className='Icon' />
                        +91 9541414155
                    </a>
                    <a className='supporicon' href="mailto:support@3slogics.com">
                        <FaEnvelope className='Icon' />
                        support@3slogics.com
                    </a>
                </div>
                    <img className='handyman_img' src="https://media.istockphoto.com/id/1442646392/vector/plumbing-round-illustration.jpg?s=612x612&w=0&k=20&c=WXJrNQCEVxSzXqZ8n9KJpjQcdbINQaIDl1s6KaSPd40=" alt='logo image' />
                    <div className="socialbtns">
                        <p className="socialbtntxt">Visit us on our Social Accounts</p>
                        <a className='socialbtn' href="https://www.facebook.com/BIZNEXT3S/" target="blank" rel="noreferrer">
                            <FaFacebookF className='Icon' />
                        </a>
                        <a className='socialbtn' href="https://twitter.com/Biznext2" target="blank" rel="noreferrer">
                            <FaTwitter className='Icon' />
                        </a>
                        <a className='socialbtn' href="https://www.linkedin.com/showcase/biznextbeyonderp/" target="blank" rel="noreferrer">
                            <FaLinkedinIn className='Icon' />
                        </a>
                        <a className='socialbtn' href="https://www.mybiznext.in/" target="_blank" rel="noreferrer">
                            <FaGlobe className='Icon' />
                        </a>
                    </div>
            </div>
            <div className='form_div'>
                <div className='login_mainform'>
                    <div>
                        <img className='company_image' src={company_icon} alt='company icon'/>
                    </div>
                    <div className='form_container' >
                <div className='input_icon'>
                <span>
                  <FaBuilding className='Icon'/>
                </span>
                <input className='form_input' type="text"placeholder="SPIRAL"defaultValue="SPIRAL"autoComplete="off" readOnly/><br/><br/>
                </div>
                <div className='input_icon'>
                <span>
                  <FaUser className='Icon'/>
                </span>
                <input className='form_input' 
                type="text" 
                name='txtLoginId'
                value={values.txtLoginId} 
                onChange={(e) => onchange(e.target.name, e.target.value)}
                placeholder='Login Id'/> 
                </div>
                {validationFormError["txtLoginId"]}
                <div className='input_icon'>
                <span>
                  <FaExclamationTriangle className='Icon'/>
                </span>
                <input className='form_input' 
                type="text" 
                name='txtpassword'
                value={values.txtPassword} 
                onChange={(e) => onchange(e.target.name, e.target.value)}
                 placeholder='password'/>
                </div>
                {validationFormError["txtpassword"]}
                <div className='login_btn_align'>
                <button type='submit'  onClick={() => handleclick()} className='login_btn'>
                    Login</button>
                </div>  
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login