import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { setSessionStorage } from "../../../API methods/AUTH";
import { authenticate } from "../../../API methods/authAdapter";
import LoginLogic from "./LoginLogic";

const Login = () => {
  const navigate = useNavigate();
  const {
    values,
    updateValues,
    handleValidation,
    validateFiled,
    validationFormError,
  } = LoginLogic();
  const [popupAlert, setPopupAlert] = useState({
    open: false,
    type: "",
    msg: "",
  });
  const onSubmit = async() => {
    debugger;
    if (!handleValidation()) {
      return;
    }
    try {
      const result =await authenticate(
        values.txtLoginId,
        values.txtPassword,
        "SPIRAL"
      );
      console.log(result);
      if (result.responseCode === 1) {
        if (
          !(
            result.responseData.ApiToken.ApiToken &&
            result.responseData.ApiToken.ExpiryDate
          )
        ) {
          setPopupAlert({
            open: true,
            type: "error",
            msg: "Token is missing",
          });
          return;
        } else if (!result.responseData.UserData) {
          setPopupAlert({
            open: true,
            type: "error",
            msg: "Information is missing",
          });
          return;
        }
        sessionStorage.clear();
        const user = {
          ...result.responseData,
          BaseURL: result.responseData.UserData.APIURL,
          companyCode: "SPIRAL",
        };
        setSessionStorage("user", user);
        navigate("/home");
      } else {
        setPopupAlert({
          open: true,
          type: "error",
          msg: "Login error",
        });
      }
      setPopupAlert({
        open: true,
        type: "error",
        msg: result.responseMessage,
      });
    } catch (error) {
      setPopupAlert({
        open: true,
        type: "error",
        msg: "error",
      });
    }
  };

  return (
    <div className="main">
      <div className="form_container">
        <h3>SPIRAL</h3>
        <input
          className="form_input"
          name="txtCompanyId"
          type="text"
          placeholder="SPIRAL"
          defaultValue="SPIRAL"
          autoComplete="off"
           readOnly
        />
        <input
          className="form_input"
          name="txtLoginId"
          type="text"
          value={values.txtLoginId}
          onChange={(e) => updateValues(e.target.name, e.target.value)}
          placeholder="Login Id"
        />
        {validationFormError["txtLoginId"]}
        <input
          className="form_input"
          name="txtPassword"
          type="text"
          value={values.txtPassword}
          onChange={(e) => updateValues(e.target.name, e.target.value)}
          placeholder="password"
        />
        {validationFormError["txtPassword"]}
        <button type="submit" onClick={() => onSubmit()}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
