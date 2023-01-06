import axios from "axios";
import { Buffer } from "buffer";

export const authenticate = async (userName, password, companyCode) => {
  try {
    const ip = "172.225.200.125"
    const buff = Buffer.from(`${userName}:${password}`)
    const base64String = buff.toString("base64");
    const requestData = {
      UserIP: ip,
      UserAppType: "1",
      UserIMEI: "testimeinumber",
      UserPhone: "9911491058",
      UserMacAddress: "testmacaddress",
    };

    console.log(JSON.stringify(requestData));
    console.log(base64String);
    const response = await axios.post("https://identity.spiral.bmcontroller.com/users/authenticate", requestData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        CompanyCode: companyCode,
        Authorization: "Basic " + base64String,
        MenuType: "101",
      },
    });

    console.log(response);
    if (response.status === 200) {
      const result = await response.data
      return {
        responseData: result,
        responseCode: 1,
        responseMessage: "success"
      }
    }
    if (response.status === 401 &&
      response &&
      response.Unauthorized &&
      response.Unauthorized.Errors &&
      response.Unauthorized.Errors[0] &&
      response.Unauthorized.Errors[0].ErrorMessage
    ) {
      return {
        responseCode: 0,
        responseData: null,
        responseMessage: response.Unauthorized.Errors[0].ErrorMessage,
      };
    }
    return {
      responseCode: 0,
      responseData: null,
      responseMessage: "Login Error",
    };
  }
  catch (error) {
    if (
      error.response.status === 401 &&
      error &&
      error.response &&
      error.response.data &&
      error.response.data.Unauthorized &&
      error.response.data.Unauthorized.Errors &&
      error.response.data.Unauthorized.Errors[0] &&
      error.response.data.Unauthorized.Errors[0].ErrorMessage
    ) {
      return {
        responseCode: 0,
        responseData: null,
        responseMessage: error.response.data.Unauthorized.Errors[0].ErrorMessage,
      };
    }
    return {
      responseCode: 0,
      responseData: null,
      responseMessage: "Login Error",
    };
  }

}
