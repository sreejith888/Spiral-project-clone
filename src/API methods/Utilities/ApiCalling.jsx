import axios from "axios";
import { checkAuthExist, getSessionStorage } from "../AUTH/Auth";
import { Buffer } from "buffer";
import { CustomMsg } from "./CustomMsg";
const pako = require("pako");
const ApiCalling = async (requestApiData, apiPath) => {
    try {
        if (!checkAuthExist()) {
          return { responseCode: 401, responseData: null, responseMessage: "Session Expired" };
        }
        const ip = "172.225.200.125";
        const user = getSessionStorage("user");
    
        const requestData = {
          ...requestApiData,
          common: {
            insertedUserID: user.UserData.UserID.toString(),
            insertedIPAddress: ip,
            dateShort: user.UserData.DateShort.toString(),
            dateLong: user.UserData.DateLong.toString(),
          },
        };
        if (window.location.href === "https://spiral.mybiznext.in/" || window.location.href === "http://localhost:3000/") {
          console.log(JSON.stringify(requestData), "RequestData");
          console.log(user.BaseURL + apiPath, "Api Url");
        }
        const response = await axios.post(user.BaseURL + apiPath, requestData, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            apiToken: user.ApiToken.ApiToken,
            apiClientName: user.ClientName,
            apiUserName: user.AppAccessUID,
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
        Sentry.captureException(error);
        if (!checkAuthExist() && error && error.response && error.response.status === 401) {
          return { responseCode: 401, responseData: null, responseMessage: CustomMsg.UnAuthorized };
        }
  return {
    responseCode: 0,
    responseData: null,
    responseMessage: error && error.response && error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : CustomMsg.Error,
  };
}
}

export default ApiCalling;