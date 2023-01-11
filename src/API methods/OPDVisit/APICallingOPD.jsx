import axios from "axios";
import { checkAuthExist, getSessionStorage } from "../AUTH/Auth";
import { CustomMsg } from "../../API methods/Utilities/CustomMsg";
import { Buffer } from "buffer";
import APIEndpoints from "../../Components/ProcedureAndPackage/APIEndpoints/APIEndpoints";
import { Success } from "../../Configuration/Constants";
import * as Sentry from "@sentry/react";

const pako = require("pako");

export const ApiCallingOPD = async (requestApiData, apiPath, commonName, header) => {
  debugger;
  const ip = "172.225.200.125";
  const user = getSessionStorage("user");
  const requestData = {
    ...requestApiData.main,
    objCommon: {
      ...requestApiData.objCommon,
      insertedUserID: user.UserData.UserID.toString(),
      insertedIPAddress: ip ? ip : "0",
      dateShort: user.UserData.DateShort.toString(),
      dateLong: user.UserData.DateLong.toString(),
    },
  };
  const requestData2 = {
    ...requestApiData.main,
    common: {
      ...requestApiData.objCommon,
      insertedUserID: user.UserData.UserID.toString(),
      insertedIPAddress: ip,
      dateShort: user.UserData.DateShort.toString(),
      dateLong: user.UserData.DateLong.toString(),
    },
  };
  let requestData1 = {};
  try {
    if (!checkAuthExist()) {
      return { responseCode: 401, responseData: null, responseMessage: "Session Expired" };
    }
    requestData1 = commonName && commonName === true ? requestData2 : requestData;

    if (window.location.href === "https://spiral.mybiznext.in/" || window.location.href === "http://localhost:3000/") {
      console.log(JSON.stringify(requestData), "RequestData");
      console.log(user.BaseURL + apiPath, "Api Url");
    }
    const response = await axios.post(user.BaseURL + apiPath, requestData1, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        apiToken: user.ApiToken.ApiToken,
        apiClientName: user.ClientName,
        apiUserName: user.AppAccessUID,
        // apiaccesscode: apiPath.accessCode,
        ...header,
      },
    });

    if (response && response.status === 200) {
      const result = await response.data;
      if (result.responseCode.toString() === "1") {
        if (result.responseDynamic === "" || result.responseDynamic === null) {
          return {
            responseCode: result.responseCode,
            responseData: [],
            responseMessage: result.responseMessage,
          };
        } else if (result.responseByte !== "" && result.responseByte !== null && result.responseByte !== undefined) {
          const buff = Buffer.from(result.responseByte ? result.responseByte : "", "base64");
         
          if (buff.length !== 0) {
            const Data = JSON.parse(pako.inflate(buff, { to: "string" }));
            console.log(Data,"Data");
            return { responseCode: result.responseCode.toString(), responseData: Data, responseMessage: result.responseMessage };

          }
          
          return { responseCode: result.responseCode, responseData: [], responseMessage: result.responseMessage };
          
        } else {
          const buff = Buffer.from(result.responseDynamic ? result.responseDynamic : "", "base64");
          if (buff.length !== 0) {
            const Data = JSON.parse(pako.inflate(buff, { to: "string" }));
            console.log(result.responseDynamic , "ResponseByte**********");
            console.log(buff,"******Buff*****");
            console.log(Data,"Data");
            return { responseCode: result.responseCode.toString(), responseData: Data, responseMessage: result.responseMessage };
          }
        
          return { responseCode: result.responseCode, responseData: [], responseMessage: result.responseMessage };
        }
      } else if (result.responseCode.toString() === "2") {
        if (result.responseDynamic === "" || result.responseDynamic === null) {
          return {
            responseCode: result.responseCode,
            responseData: [],
            responseMessage: result.responseMessage,
          };
        } else if (result.responseByte !== "" && result.responseByte !== null && result.responseByte !== undefined) {
          const buff = Buffer.from(result.responseByte ? result.responseByte : "", "base64");
          if (buff.length !== 0) {
            const Data = JSON.parse(pako.inflate(buff, { to: "string" }));
           
            return { responseCode: result.responseCode.toString(), responseData: Data, responseMessage: result.responseMessage };
          }
          return { responseCode: result.responseCode, responseData: [], responseMessage: result.responseMessage };
        } else {
          const buff = Buffer.from(result.responseDynamic ? result.responseDynamic : "", "base64");
          if (buff.length !== 0) {
            const Data = JSON.parse(pako.inflate(buff, { to: "string" }));
           
            return { responseCode: result.responseCode.toString(), responseData: Data, responseMessage: result.responseMessage };
          }
          return { responseCode: result.responseCode, responseData: [], responseMessage: result.responseMessage };
        }
      }
      return { responseCode: result.responseCode, responseData: null, responseMessage: result.responseMessage };
    }
    return { responseCode: 0, responseData: null, responseMessage: CustomMsg.Error };
  } catch (error) {
    if (!checkAuthExist() && error && error.response && error.response.status === 401) {
      return { responseCode: 401, responseData: null, responseMessage: CustomMsg.UnAuthorized };
    } else if (error && error.response && error.response.status === 400) {
      const er = { error: error, request: requestData1 };
      Sentry.captureException(er);
      console.log("error", error);
      console.log("requestdata", requestData1);
      return {
        responseCode: 0,
        responseData: null,
        responseMessage: error && error.response && error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : CustomMsg.Error,
      };
    }
    Sentry.captureException(error);
    return {
      responseCode: 0,
      responseData: null,
      responseMessage: error && error.response && error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : CustomMsg.Error,
    };
  }
};
export default ApiCallingOPD;
