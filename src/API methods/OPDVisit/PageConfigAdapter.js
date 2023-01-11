import axios from "axios";
import APIEndpoints from "../../Components/ProcedureAndPackage/APIEndpoints/APIEndpoints";
import { CustomMsg } from "../../Configuration/customMessage";
import { checkAuthExist, getSessionStorage } from "../AUTH/Auth";
import ApiCallingOPD from "./APICallingOPD";

export const getGetPageConfig = async (request) => {
  const requestData = {
    main: {
      searchText: request.searchText && request.searchText.trim() !== "" ? request.searchText.toString() : "#ALL",
      bizNextPageID: request.bizNextPageID ? Number(request.bizNextPageID) : 0,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.Configuration.GetPageConfig);
  return response;
  // try {
    // if (!checkAuthExist()) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }
    // const user = getSessionStorage('user');
  //   const requestData = {
  //     searchText: request.searchText && request.searchText.trim() !== '' ? request.searchText.toString() : '#ALL',
  //     bizNextPageID: request.bizNextPageID ? Number(request.bizNextPageID) : 0,
  //     objCommon: {
  //       insertedUserID: user.UserData.UserID.toString(),
  //     },
  //   };
  //   console.log(user.BaseURL + APIEndpoints.Configuration.GetPageConfig);
  //   console.log(JSON.stringify(requestData));
  //   const response = await axios.post(user.BaseURL + APIEndpoints.Configuration.GetPageConfig, requestData, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json',
  //       'apiToken': user.ApiToken.ApiToken,
  //       'apiClientName': user.ClientName,
  //       'apiUserName': user.AppAccessUID,
  //     },
  //   });

  //   if (response.status === 200) {
  //     const result = await response.data;
  //     if (result.responseCode === '1' && result.responseDynamic) {
  //       const buff = new Buffer(result.responseDynamic, 'base64');
  //       const decompressedData = await ungzip(buff);
  //       const data = JSON.parse(decompressedData.toString());
  //       return {
  //         responseCode: result.responseCode,
  //         responseData: data,
  //         responseMessage: result.responseMessage,
  //       };
  //     }
  //     return {
  //       responseCode: result.responseCode,
  //       responseData: null,
  //       responseMessage: result.responseMessage,
  //     };
  //   }
  //   return {
  //     responseCode: response.status,
  //     responseData: null,
  //     responseMessage: CustomMsg.Error,
  //   };
  // } catch (error) {
  //   if (!checkAuthExist() && error && error.response && error.response.status && error.response.status === 401) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }
  //   return {
  //     responseCode: 0,
  //     responseData: null,
  //     responseMessage: error && error.response && error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : CustomMsg.Error,
  //   };
  // }
};
export const getGetPageConfigPublish = async (request) => {
  const requestData = {
    main: {
      searchText: request.searchText && request.searchText.trim() !== "" ? request.searchText.toString() : "#ALL",
      bizNextPageID: request.bizNextPageID ? Number(request.bizNextPageID) : 0,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.Configuration.PageConfigPublish);
  return response;
  // try {
  //   if (!checkAuthExist()) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }
  //   const user = getSessionStorage("user");
  //   const requestData = {
  //     searchText: request.searchText && request.searchText.trim() !== "" ? request.searchText.toString() : "#ALL",
  //     bizNextPageID: request.bizNextPageID ? Number(request.bizNextPageID) : 0,
  //     objCommon: {
  //       insertedUserID: user.UserData.UserID.toString(),
  //     },
  //   };
  //   console.log(user.BaseURL + APIEndpoints.Configuration.GetPageConfig);
  //   console.log(JSON.stringify(requestData));
  //   const response = await axios.post(user.BaseURL + APIEndpoints.Configuration.PageConfigPublish, requestData, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       apiToken: user.ApiToken.ApiToken,
  //       apiClientName: user.ClientName,
  //       apiUserName: user.AppAccessUID,
  //     },
  //   });

  //   if (response.status === 200) {
  //     const result = await response.data;
  //     if (result.responseCode === "1" && result.responseDynamic) {
  //       const buff = new Buffer(result.responseDynamic, "base64");
  //       const decompressedData = await ungzip(buff);
  //       const data = JSON.parse(decompressedData.toString());
  //       return {
  //         responseCode: result.responseCode,
  //         responseData: data,
  //         responseMessage: result.responseMessage,
  //       };
  //     }
  //     return {
  //       responseCode: result.responseCode,
  //       responseData: null,
  //       responseMessage: result.responseMessage,
  //     };
  //   }
  //   return {
  //     responseCode: response.status,
  //     responseData: null,
  //     responseMessage: CustomMsg.Error,
  //   };
  // } catch (error) {
  //   if (!checkAuthExist() && error && error.response && error.response.status && error.response.status === 401) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }
  //   return {
  //     responseCode: 0,
  //     responseData: null,
  //     responseMessage: error && error.response && error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : CustomMsg.Error,
  //   };
  // }
};

export const getgetBiznextMaster = async (request) => {
  const requestData = {
    main: {
      searchText: request.searchText ? request.searchText.toString() : "#ALL",
      bizNextPageID: request.bizNextPageID ? Number(request.bizNextPageID) : 0,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.Configuration.GetMasterPage);
  return response;
  // try {
  //   if (!checkAuthExist()) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }

  //   const user = getSessionStorage("user");
  //   const requestData = {
  //     searchText: request.searchText ? request.searchText.toString() : "#ALL",
  //     bizNextPageID: request.bizNextPageID ? Number(request.bizNextPageID) : 0,
  //     objCommon: {
  //       insertedUserID: user.UserData.UserID.toString(),
  //     },
  //   };
  //   console.log("requestData", APIEndpoints.Configuration.GetMasterPage);
  //   console.log(user.BaseURL + APIEndpoints.Configuration.GetMasterPage);
  //   console.log(JSON.stringify(requestData));
  //   const response = await axios.post(user.BaseURL + APIEndpoints.Configuration.GetMasterPage, requestData, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       apiToken: user.ApiToken.ApiToken,
  //       apiClientName: user.ClientName,
  //       apiUserName: user.AppAccessUID,
  //     },
  //   });

  //   if (response.status === 200) {
  //     const result = await response.data;
  //     if (result.responseCode === "1" && result.responseDynamic) {
  //       const buff = new Buffer(result.responseDynamic, "base64");
  //       const decompressedData = await ungzip(buff);
  //       const data = JSON.parse(decompressedData.toString());
  //       return {
  //         responseCode: result.responseCode,
  //         responseData: data,
  //         responseMessage: result.responseMessage,
  //       };
  //     }
  //     return {
  //       responseCode: result.responseCode,
  //       responseData: null,
  //       responseMessage: result.responseMessage,
  //     };
  //   }
  //   return {
  //     responseCode: response.status,
  //     responseData: null,
  //     responseMessage: CustomMsg.Error,
  //   };
  // } catch (error) {
  //   if (!checkAuthExist() && error && error.response && error.response.status && error.response.status === 401) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }
  //   return {
  //     responseCode: 0,
  //     responseData: null,
  //     responseMessage: error && error.response && error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : CustomMsg.Error,
  //   };
  // }
};
export const updateActionPageConfig = async (formData) => {
  const requestData = {
    main: {
      ...formData,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.Configuration.UpdateBiznextPage);
  return response;
  // try {
  //   if (!checkAuthExist()) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }
  //   const user = getSessionStorage("user");
  //   const ip = await publicIp.v4();
  //   const requestData = {
  //     ...formData,
  //     objCommon: {
  //       insertedUserID: user.UserData.UserID.toString(),
  //       insertedIPAddress: ip,
  //       dateShort: user.UserData.DateShort,
  //       dateLong: user.UserData.DateLong,
  //     },
  //   };
  //   console.log(user.BaseURL + APIEndpoints.Configuration.UpdateBiznextPage);
  //   console.log(JSON.stringify(requestData));
  //   const response = await axios.post(
  //     user.BaseURL + APIEndpoints.Configuration.UpdateBiznextPage,

  //     requestData,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         apiToken: user.ApiToken.ApiToken,
  //         apiClientName: user.ClientName,
  //         apiUserName: user.AppAccessUID,
  //       },
  //     },
  //   );

  //   if (response.status === 200) {
  //     const result = await response.data;
  //     if (result.responseCode === "1" && result.responseDynamic) {
  //       const buff = new Buffer(result.responseDynamic, "base64");
  //       const decompressedData = await ungzip(buff);
  //       const data = JSON.parse(decompressedData.toString());
  //       return {
  //         responseCode: result.responseCode,
  //         responseData: data,
  //         responseMessage: result.responseMessage,
  //       };
  //     }
  //     return {
  //       responseCode: result.responseCode,
  //       responseData: null,
  //       responseMessage: result.responseMessage,
  //     };
  //   }
  //   return {
  //     responseCode: response.status,
  //     responseData: null,
  //     responseMessage: response.responseMessage,
  //   };
  // } catch (error) {
  //   if (!checkAuthExist() && error && error.response && error.response.status && error.response.status === 401) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }
  //   return {
  //     responseCode: 0,
  //     responseData: null,
  //     responseMessage: error && error.response && error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : CustomMsg.Error,
  //   };
  // }
};
export const getAppMasterBinding = async (request) => {
  const requestData = {
    main: {
      FilterID: request.ItemfilterID ? request.ItemfilterID : 0,
      FilterID1: request.ItemfilterID1 ? request.ItemfilterID1 : 0,
      masterName: request.ItemMasterName ? request.ItemMasterName : "",
      searchText: request.searchText ? request.searchText.toString() : "#All",
      searchCriteria: request && request.searchCriteria ? request.searchCriteria.toString() : "AW",
    },
  };
  // const response = await ApiCallingOPD(requestData, APIEndpoints.ItemMaster.GetMasterDataBinding);
  const response = await ApiCallingOPD(requestData, APIEndpoints.Configuration.GetMasterDataBinding);
  return response;
  // try {
  //   if (!checkAuthExist()) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }
  //   const user = getSessionStorage("user");
  //   const requestData = {
  //     FilterID: request.ItemfilterID ? request.ItemfilterID : 0,
  //     FilterID1: request.ItemfilterID1 ? request.ItemfilterID1 : 0,
  //     masterName: request.ItemMasterName ? request.ItemMasterName : "",
  //     searchText: request.searchText ? request.searchText.toString() : "#All",
  //     searchCriteria: request && request.searchCriteria ? request.searchCriteria.toString() : "AW",
  //     objCommon: {
  //       insertedUserID: user.UserData.UserID.toString(),
  //     },
  //   };
  //   console.log(user.BaseURL + APIEndpoints.ItemMaster.GetMasterDataBinding);
  //   console.log(JSON.stringify(requestData));
  //   const response = await axios.post(user.BaseURL + APIEndpoints.ItemMaster.GetMasterDataBinding, requestData, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       apiToken: user.ApiToken.ApiToken,
  //       apiClientName: user.ClientName,
  //       apiUserName: user.AppAccessUID,
  //     },
  //   });

  //   if (response.status === 200) {
  //     const result = await response.data;
  //     if (result.responseCode === "1" && result.responseDynamic) {
  //       const buff = new Buffer(result.responseDynamic, "base64");
  //       const decompressedData = await ungzip(buff);
  //       const data = JSON.parse(decompressedData.toString());
  //       return {
  //         responseCode: result.responseCode,
  //         responseData: data,
  //         responseMessage: result.responseMessage,
  //       };
  //     }
  //     return {
  //       responseCode: result.responseCode,
  //       responseData: null,
  //       responseMessage: result.responseMessage,
  //     };
  //   }
  //   return {
  //     responseCode: response.status,
  //     responseData: null,
  //     responseMessage: response.responseMessage,
  //   };
  // } catch (error) {
  //   if (!checkAuthExist() && error && error.response && error.response.status && error.response.status === 401) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }
  //   return {
  //     responseCode: 0,
  //     responseData: null,
  //     responseMessage: error && error.response && error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : CustomMsg.Error,
  //   };
  // }
};
