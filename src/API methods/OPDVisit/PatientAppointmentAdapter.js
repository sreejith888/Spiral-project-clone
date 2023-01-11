import APIEndpoints from "../../Components/ProcedureAndPackage/APIEndpoints/APIEndpoints";
import { getSessionStorage } from "../AUTH/Auth";
import ApiCallingOPD from "./APICallingOPD";
export const getPatientsList = async (request) => {
  const requestData = {
    main: {
      viewMode: "LISTVIEW",
      fromDate: request.fromDate ? request.fromDate : "",
      toDate: request.toDate ? request.toDate : "",
      appointmentDate: "",
      hospitalMasterID: request.hospitalID ? request.hospitalID : "",
      hospitalDeptID: request.hospitalDeptID ? request.hospitalDeptID : "",
      doctorMasterID: request.doctorID ? request.doctorID : "",
      specialityMasterID: request.specialityID ? request.specialityID : "",
      appointmentType: request.appointmentType ? request.appointmentType : "",
      appointmentStatus: request.appointmentStatus ? request.appointmentStatus : "",
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetPatientAppointment);
  return response;
};

export const getPatientAppointmentView = async (request) => {
  const requestData = {
    main: {
      viewMode: "CALVIEW",
      hospitalMasterID: request.hospitalID ? request.hospitalID.toString() : "1",
      hospitalDeptID: request.hospitalDeptID ? request.hospitalDeptID.toString() : "1",
      appointmentDate: request.appointmentDate ? request.appointmentDate : "05-02-2022",
      doctorMasterID: request.doctorID ? request.doctorID.toString() : "0",
      specialityMasterID: request.specialityID ? request.specialityID.toString() : "0",
      appointmentType: request.appointmentType ? request.appointmentType.toString() : "0",
      appointmentStatus: request.appointmentStatus ? request.appointmentStatus.toString() : "0",
      // appAccessID: user.UserData.UserID.toString(),
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetPatientAppointment);
  return response;
};

export const getHIMSMasterDataBinding = async (action, filterID, filterID1) => {
  const requestData = {
    main: {
      action: action,
      filterID: filterID ? filterID.toString() : "",
      filterID1: filterID1 ? filterID1.toString() : "",
      filterID6: "#All",
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetHIMSMasterDataBinding);
  return response;
};

export const getAppointmentStatus = async (request) => {
  const requestData = {
    main: {
      action: request.action ? request.action : "",
      relationID: request.relationID ? request.relationID : "",
      relationValueID: request.relationValueID ? request.relationValueID : "",
      firstTable: request.firstTable ? request.firstTable : 0,
      secondTable: request.secondTable ? request.secondTable : 0,
      bMCGCode: request.bMCGCode ? request.bMCGCode : 0,
      firstTableFieldID: request.firstTableFieldID ? request.firstTableFieldID : "",
      secondTableFieldID: request.secondTableFieldID ? request.secondTableFieldID : "",
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.AssignCommonRelationManage);
  return response;
};

export const getAppointTypeList = async (request) => {
  const requestData = {
    main: {
      masterDataCode: request.masterDataCode ? request.masterDataCode : 0,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetMasterDataFile);
  return response;
};

export const getPatientList = async (viewMode, mobileNo) => {
  const requestData = {
    main: {
      viewMode: viewMode ? viewMode.toString() : "",
      mobileNo: mobileNo ? mobileNo.toString().trim() : "",
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetPatientsList);
  return response;
};

export const getPatientWithMrd = async (viewMode, mrdNo) => {
  const requestData = {
    main: {
      viewMode: viewMode ? viewMode.toString() : "",
      mrdNo: mrdNo ? mrdNo.toString() : "",
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetPatientsList);
  return response;
};

export const savePatientAppointment = async (formData) => {
  const requestData = {
    main: {
      ...formData,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.SaveAppointment);
  return response;
};

export const getAppointmentSlotList = async (formData) => {
  const requestData = {
    main: {
      ...formData,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetAppointmentSlotList);
  return response;
};

export const getPatientViewSpeciality = async (action, filterID, filterID1, filterID5) => {
  const user = getSessionStorage("user");
  const requestData = {
    main: {
      action: action,
      filterID: filterID ? filterID.toString() : "",
      filterID1: filterID1 ? filterID1.toString() : "",
      filterID5: filterID5 ? filterID5.toString() : "",
      filterID6: user.UserData.DateShort,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetPatientViewSpeciality);
  return response;
};

export const deleteAppointment = async (formData) => {
  const requestData = {
    main: {
      ...formData,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.OnDeleteAppointment);
  return response;
};

export const getPatientSearchView = async (hospitalID, pMobileNo, pmrdNo) => {
  const requestData = {
    main: {
      viewMode: "ASSINEDAPPOINTMENT",
      hospitalMasterID: hospitalID ? hospitalID.toString() : "0",
      specialityMasterID: "",
      appointmentType: "",
      appointmentStatus: "",
      doctorMasterID: "",
      pMobileNo: pMobileNo ? pMobileNo.toString() : "",
      pmrdNo: pmrdNo ? pmrdNo.toString() : "",
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetPatientAppointment);
  return response;
};

export const getRooms = async (action, filterID, filterID1, filterID6) => {
  const requestData = {
    main: {
      action: action ? action : "",
      SearchText: "#all",
      SearchCriteria: "",
      filterID: filterID ? filterID.toString() : "",
      filterID1: filterID1 ? filterID1.toString() : "",
      filterID5: "",
      FilterID6: filterID6 ? filterID6.toString() : "",
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetHospitalRooms);
  return response;
};

export const rescheduleAppointment = async (formData) => {
  const requestData = {
    main: {
      ...formData,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.ReScheduleAppointment);
  return response;
};

export const getSpecialityDoctors = async (action, filterID, filterID1) => {
  const requestData = {
    main: {
      action: action,
      filterID: filterID ? filterID.toString() : "",
      filterID1: filterID1 ? filterID1.toString() : "",
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetHIMSMasterDataBinding);
  return response;
};

export const getPatientAppointmentHistory = async (formData) => {
  const requestData = {
    main: {
      ...formData,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetPatientAppointmentHistory);
  return response;
};

export const sendSMSToDest = async (formData) => {
  const requestData = {
    main: {
      ...formData,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.SendSMSToDest);
  return response;
};

export const GetPatientAppointmentList = async (formData) => {
  const requestData = {
    main: {
      ...formData,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetPatientAppointmentList);
  return response;
};

export const validateWhatsAppNumber = async (formData) => {
  const requestData = {
    main: {
      ...formData,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.ValidateWhatsAppContact);
  return response;
};

export const sendSMSToWhatsApp = async (formData) => {
  const requestData = {
    main: {
      ...formData,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.SendSMSToDestination);
  return response;
};

export const getDoctorScheduleSummaryData = async (formData) => {
  const requestData = {
    main: {
      ...formData,
    },
  };
  const response = await ApiCallingOPD(requestData, APIEndpoints.PatientAppointment.GetDoctorScheduleSummary);
  return response;
};
