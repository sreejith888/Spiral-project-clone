import axios from "axios";
// import { checkAuthExist, getSessionStorage } from "../../Auth/auth";
import APIEndpoints from "../../Components/ProcedureAndPackage/APIEndpoints/APIEndpoints";
import { CustomMsg } from "../../Configuration/customMessage";
import ApiCallingOPD from "./APICallingOPD";

export const getHimsMasterDataBinding = async (action, searchText) => {
  const requestData = {
    main: {
      action: action,
      FilterID6: searchText ? searchText : "#all",
    },
  };
  // const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetHIMSMasterDataBinding);
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientRegistration.GetHIMSMasterDataBinding);
  return response;
  // try {
  //   if (!checkAuthExist()) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }
  //   const user = getSessionStorage('user');
  //   const requestData = {
  //     action: action,
  //     FilterID6: searchText ? searchText : "#all"
  //   };

  //   console.log(user.BaseURL + APIEndpoints.PatientAppointment.GetHIMSMasterDataBinding);
  //   console.log(JSON.stringify(requestData));
  //   const response = await axios.post(user.BaseURL + APIEndpoints.PatientAppointment.GetHIMSMasterDataBinding, requestData, {
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

export const getHimsReferNameBinding = async (action, filterID, FilterID6) => {
  const requestData = {
    main: {
      action: action,
      filterID: filterID ? filterID.toString() : "",
      FilterID6: FilterID6 ? FilterID6 : "#all",
    },
  };
  // const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetHIMSMasterDataBinding);
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientRegistration.GetHIMSMasterDataBinding);
  return response;
  // try {
  //   if (!checkAuthExist()) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }
  //   const user = getSessionStorage('user');
  //   const requestData = {
  //     action: action,
  //     filterID: filterID ? filterID.toString() : "",
  //     FilterID6: FilterID6 ? FilterID6 : "#all"
  //   };
  //   console.log(user.BaseURL + APIEndpoints.PatientAppointment.GetHIMSMasterDataBinding);
  //   console.log(JSON.stringify(requestData));
  //   const response = await axios.post(user.BaseURL + APIEndpoints.PatientAppointment.GetHIMSMasterDataBinding, requestData, {
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

export const getHRMSMasterData = async (MasterName, SearchText) => {
  const requestData = {
    main: {
      MasterName: MasterName ? MasterName : "EMPSALE",
      SearchText: SearchText ? SearchText : "#all",
      SearchCriteria: "",
      filterID1: "103",
      filterID2: "",
      filterID3: "",
    },
  };
  // const response = await ApiCallingOPD(requestData, APIEndpoints.ProjectMaster.GetHRMSMasterData);
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientRegistration.GetHRMSMasterData);
  return response;
  // try {
  //   if (!checkAuthExist()) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }
  //   const user = getSessionStorage('user');
  //   const requestData = {
  //     MasterName: MasterName ? MasterName : "EMPSALE",
  //     SearchText: SearchText ? SearchText : "#all",
  //     SearchCriteria: "",
  //     filterID1: "103",
  //     filterID2: "",
  //     filterID3: "",
  //     objCommon: {
  //       insertedUserID: user.UserData.UserID.toString(),
  //     },
  //   };
  //   console.log(user.BaseURL + APIEndpoints.ProjectMaster.GetHRMSMasterData);
  //   console.log(JSON.stringify(requestData));
  //   const response = await axios.post(user.BaseURL + APIEndpoints.ProjectMaster.GetHRMSMasterData, requestData, {
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

export const addPatientInformation = async (formData) => {
  const requestData = {
    main: {
      ...formData,
    },
  };
  // const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.AddPatientInformation);
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientRegistration.AddPatientInformation);
  return response;
  // try {
  //   if (!checkAuthExist()) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }
  //   const user = getSessionStorage('user');
  //   const ip = await publicIp.v4();
  //   const requestData = {
  //     ...formData,
  //     common: {
  //       insertedUserID: user.UserData.UserID.toString(),
  //       insertedIPAddress: ip,
  //       dateShort: user.UserData.DateShort,
  //       dateLong: user.UserData.DateLong,
  //     },
  //   };
  //   console.log(user.BaseURL + APIEndpoints.PatientAppointment.AddPatientInformation);
  //   console.log(JSON.stringify(requestData));
  //   const response = await axios.post(user.BaseURL + APIEndpoints.PatientAppointment.AddPatientInformation, requestData, {
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

export const getPatientsDataList = async (formData) => {
  const requestData = {
    main: {
      ...formData,
    },
  };
  // const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetPatientsList);
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientRegistration.GetPatientsList);
  return response;
  // try {
  //   if (!checkAuthExist()) {
  //     return {
  //       responseCode: 401,
  //       responseData: null,
  //       responseMessage: CustomMsg.UnAuthorized,
  //     };
  //   }
  //   const user = getSessionStorage('user');
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
  //   console.log(user.BaseURL + APIEndpoints.PatientAppointment.GetPatientsList);
  //   console.log(JSON.stringify(requestData));
  //   const response = await axios.post(user.BaseURL + APIEndpoints.PatientAppointment.GetPatientsList, requestData, {
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
export const getCityBinding = async (request) => {
  const requestData = {
    main: {
      filterID: request.filterID ? request.filterID : 0,
      filterID1: request.filterID1 ? request.filterID1 : 0,
      masterName: request.masterName ? request.masterName : "",
      searchText: request.searchText ? request.searchText : "",
      searchCriteria: request.searchCriteria ? request.searchCriteria : "",
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.Hospital.GetCityBinding);
  return response;
};
