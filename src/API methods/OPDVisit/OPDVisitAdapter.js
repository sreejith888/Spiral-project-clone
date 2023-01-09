import APIEndpoints from "../../Components/ProcedureAndPackage/APIEndpoints/APIEndpoints";
import { ProcedureAndPackageApiCalling } from "../../Components/ProcedureAndPackage/APIEndpoints/ProcedureAndPackageApiCalling";

export const getHIMSMasterDataBinding = async (action, filterID, filterID1) => {
    const requestData = {
      main: {
        action: action,
        filterID: filterID ? filterID.toString() : "",
        filterID1: filterID1 ? filterID1.toString() : "",
        FilterID6: "#all",
      },
    };
    const response = await ProcedureAndPackageApiCalling(requestData, APIEndpoints.OPDVisit.GetHIMSMasterDataBinding);
    return response;
  };
  
  export const getRegistrationMasterData = async (request) => {
    const requestData = {
      main: {
        filterID: request.filterID ? request.filterID : 0,
        filterID1: request.filterID1 ? request.filterID1 : 0,
        masterName: request.masterName ? request.masterName : "",
        searchText: request.searchText ? request.searchText : "",
        searchCriteria: request.searchCriteria ? request.searchCriteria : "",
      },
    };
    const response = await ProcedureAndPackageApiCalling(requestData, APIEndpoints.OPDVisit.GetMasterDataBinding);
    return response;
  };
  
  
export const getTotalAppointment = async (formData) => {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const response = await ProcedureAndPackageApiCalling(requestData, APIEndpoints.OPDVisit.GetTotalAppointment);
    return response;
  };
  
  export const getOpdAppointmentPatientsList = async (request) => {
    const requestData = {
      main: {
        viewMode: request.viewMode ? request.viewMode : "",
        appointmentDate: request.appointmentDate ? request.appointmentDate : "",
        hospitalMasterID: request.hospitalMasterID ? request.hospitalMasterID : "",
        hospitalDeptID: request.hospitalDeptID ? request.hospitalDeptID : "",
        doctorMasterID: request.doctorID ? request.doctorID : "",
        specialityMasterID: request.specialityID ? request.specialityID : "",
        appointmentType: request.appointmentType ? request.appointmentType : "",
        appointmentStatus: request.appointmentStatus ? request.appointmentStatus : "",
        pmrdNo: request.mrdNo ? request.mrdNo : "",
        pMobileNo: request.mobileNo ? request.mobileNo : "",
      },
    };
    const response = await ProcedureAndPackageApiCalling(requestData, APIEndpoints.OPDVisit.GetPatientAppointment);
    return response;
  };