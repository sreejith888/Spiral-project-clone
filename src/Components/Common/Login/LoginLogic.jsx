import React, { useState } from 'react'

const LoginLogic = () => {

    const[values,setValues]=useState({
        txtLoginId:"",
        txtPassword:"",
        txtCompanyId:"SPIRAL"
    });
    const[validationFormError,setValidationFormError]=useState({})

    const validateFiled=(name,value)=>{
let errormsg="";
        if(name==="txtLoginId"){
            if(!value || typeof value=== 'undefined' ){
                errormsg="username cannot be empty"
            }
        }
        if(name==="txtPassword"){
            if(!value || typeof value=== 'undefined' ){
                errormsg="Password cannot be empty"
            }
        }
return errormsg;
    }

const updateValues=(name,value)=>{
    validationFormError[name]=validateFiled(name,value);
    setValues((values)=>({
        ...values,
        [name]:value
    }))
};

const handleValidation = ()=>{
    try{
const errors={};
let formIsValid=true;
errors["txtLoginId"]=validateFiled("txtLoginId",values.txtLoginId);
errors["txtPassword"]=validateFiled("txtPassword",values.txtPassword);
if(Object.values(errors).join("").toString()){
    formIsValid=false;
}
setValidationFormError(errors);
return formIsValid;
    }
    catch(error){
alert("invalid ID")
return false
    }
};

  return {
    values,
    updateValues,
    handleValidation,
    validateFiled,
    validationFormError
  }
   
}

export default LoginLogic