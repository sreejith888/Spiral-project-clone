const  APIEndpoints = {
    ProcedureAndPackage: {
        getServiceCategoryList: "HIMS/CMN/GetHIMSMasterDataBinding",
        getProcedureAndPackageList: "HIMS/CMN/GetBNItem",
        updateProcedureAndPackageStatus: "HIMS/CMN/StatusUpdateBNItem",
        getDiseaseList: "HIMS/CMN/GetHIMSMasterDataBinding",
        addProcedureAndPackage: "HIMS/CMN/SaveBNItem",
        getItemGroupList: "Setup/IMM/GetInventoryMasterBinding",
        getItemMasterList: "Setup/IMM/GetInventoryBNItemNo",
      },
      OPDVisit: {
        GetHIMSMasterDataBinding: "HIMS/CMN/GetHIMSMasterDataBinding",
        GetMasterDataBinding: "Setup/Common/GetMasterDataBinding",
        GetHRMSMasterData: "HRMS/GetHRMSMasterDataBinding",
        GetPatientAppointment: "HIMS/Appointment/GetPatientAppointment",
        GetOpdVistList: "HIMS/OPD/GetPatientVisit",
        GetMasterDataFile: "HIMS/CMN/GetMasterDataFile",
        AddOpdPatientVisitData: "HIMS/OPD/AddPatientVisit",
        AddPatientInformation: "HIMS/Appointment/AddPatient",
        GetPatientsList: "HIMS/OPD/GetPatientList",
        GetTotalAppointment: "HIMS/Appointment/PatientAppointmentVisitCount",
        CancelAppointments: "HIMS/Appointment/RemovePatientAppointment",
      },
    
}
export default APIEndpoints;