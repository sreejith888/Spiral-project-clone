import { useState } from 'react';

const LoginLogic = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [validationFormError, setValidationFormError] = useState({});
    const [values, setValues] = useState({
        txtLoginId: "",
        txtPassword: "",
        txtCompanyCode:"SPIRAL"
      });

    const validateField = (name, value) => {
      let errorsMsg = "";
      if (name === "txtLoginId") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Username Cannot be empty";
        }
      } else if (name === "txtPassword") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Password Cannot be empty";
        }
      }
      return errorsMsg;
    };

    const handleValidation = () => {
      try {
        const errors = {};
        let formIsValid = true;
        errors["txtLoginId"] = validateField("txtLoginId", values.txtLoginId);
        errors["txtPassword"] = validateField("txtPassword", values.txtPassword);
        if (Object.values(errors).join("").toString()) {
          formIsValid = false;
        }
        setValidationFormError(errors);
        return formIsValid;
      } catch (error) {
     alert("error invalid ID")
        return false;
      }
    };


    const updateValues =(name, value) => {
      console.log(name,value)
          validationFormError[name] = validateField(name, value);
          setValues((values) => ({
            ...values,
            [name]: value,
          }));
  
      };
    
  return {
    values,
    updateValues,
    handleValidation,
    validateField,
    isLoading,
    validationFormError


  };
}

export default LoginLogic