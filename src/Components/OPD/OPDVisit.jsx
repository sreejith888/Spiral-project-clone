import React, { useEffect, useRef, useState } from "react";
import { getSessionStorage } from "../../API methods/AUTH/Auth";
import { getHIMSMasterDataBinding, getOpdAppointmentPatientsList, getTotalAppointment } from "../../API methods/OPDVisit/OPDVisitAdapter";
import { Success } from "../../Configuration/Constants";
import  {CustomMsg}  from "../../API methods/Utilities/CustomMsg";
import * as Sentry from "@sentry/react";
import { dateToCompanyFormat, dateToSpecificFormat } from "../../Configuration/dateFormat";
import moment from "moment";
import PageTitle, { PageButton, PageInput, PageSearch, PageSearchButton, PageSelect } from "../../Framework/PageTitle/PageTitle";
import CreateInvoice from "./OPDVisit/OPDBilling/CreateInvoice/CreateInvoice";
import PageHeader from "../Common/Header/PageHeader";

const OPDVisit = () => {
  const userData = getSessionStorage("user");
  const departmentSelect = useRef();
  const hospitalSelect = useRef();
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoadingHospital, setIsLoadingHospital] = useState(false);
  const [hospitalList, setHospitalList] = useState([]);
  const [hospitalDeptList, setHospitalDeptList] = useState([]);
  const [isLoadingHospitalDept, setIsLoadingHospitalDept] = useState(false);
  const [isLoadingAppointmentPatient, setIsLoadingAppointmentPatient] = useState(false);
  const [appointmentPatientList, setAppointmentPatientList] = useState([]);
  const [filterAppointmentPatientList, setFilterAppointmentPatientList] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState([]);  
  const [appointmentsCount, setAppointmentsCount] = useState(false);
  const [msgAlert, setMsgAlert] = useState({ open: false, type: "", msg: "" });
  const [confirmAlert, setConfirmAlert] = useState({
    open: false,
    title: "",
    msg: "",
    onConfirm: null,
    button: { confirmText: "", abortText: "", Color: "" },
  });
  const [enableControlValue, setEnableControlValue] = useState(false);
  useEffect(() => {
    getHospitalList();
  }, []);
  const [opdVisitList, setOpdVisitList] = useState([]);
  const [isLoadingOpdVisitList, setIsLoadingOpdVisitList] = useState(false);
  const [filteredAppointmentListStatus, setFilteredAppointmentListStatus] = useState([]);
  const searchByoptions = [
    { value: "MobileNo", label: "Mobile No" },
    { value: "MRD", label: "MRD" },
    { value: "OPNo", label: "OPNo" },
  ];

  const [filterValues, setFilterValues] = useState({
    dateFilter: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
    hospitalFilter: null,
    DepartmentFilter: null,
    SearchByFilter: null,
    txtSearchFilter: "",
  });

  const getHospitalList = async () => {
    try {
      setIsLoadingHospital(true);
      let result = await getHIMSMasterDataBinding(
        "GETHOSP",
        "",
        userData && userData.UserData && userData.UserData.UserID
      );
      setIsLoadingHospital(false);
      console.log(result);
      if (result.responseCode === Success) {
        if (result.responseData && result.responseData.HIMSMasterDataBinding) {
          setHospitalList(result.responseData.HIMSMasterDataBinding);
        } else {
          setHospitalList([]);
        }
      } else {
        setHospitalList([]);
        setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
      }
    } catch (error) {
      Sentry.captureException(error);
      setMsgAlert({ open: true, type: "error", msg: CustomMsg.Error });
      console.log(error);
    }
  };

  const getHospitalDepartmentList = async (hospitalId) => {
    try {
      setIsLoadingHospitalDept(true);
      let result = await getHIMSMasterDataBinding("GETHOSPDEPT", hospitalId);
      setIsLoadingHospitalDept(false);
      if (result.responseCode === Success) {
        if (result.responseData && result.responseData.HIMSMasterDataBinding) {
          if (result.responseData.HIMSMasterDataBinding.length === 1) {
            setHospitalDeptList(result.responseData.HIMSMasterDataBinding);
            setFilterValues((values) => ({
              ...values,
              DepartmentFilter: result.responseData.HIMSMasterDataBinding[0],
            }));
            console.log(result.responseData.HIMSMasterDataBinding);
          } else {
            setHospitalDeptList(result.responseData.HIMSMasterDataBinding);
          }
        } else {
          setHospitalDeptList([]);
        }
      } else {
        setHospitalDeptList([]);
        setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
      }
    } catch (error) {
      Sentry.captureException(error);
      setMsgAlert({ open: true, type: "error", msg: CustomMsg.Error });
      console.log(error);
    }
  };

  const getAppointmentPatientList = async () => {
    debugger;
    try {
      if (!filterValues.SearchByFilter) {
        if (filterValues.hospitalFilter && filterValues.DepartmentFilter) {
          setTotalRecords(0);
          setIsLoadingAppointmentPatient(true);

          let mrdNoVal = "";
          let mobileNoVal = "";

          if (filterValues.SearchByFilter != null) {
            if (filterValues.SearchByFilter.value === "MobileNo") {
              mobileNoVal = filterValues.txtSearchFilter;
            } else if (filterValues.SearchByFilter.value === "MRD") {
              mrdNoVal = filterValues.txtSearchFilter;
            }
          }
          let requestAppointmentPatient = {
            viewMode: "OPDAPPOINTMENT",
            appointmentDate: dateToCompanyFormat(moment().subtract(0, "days")),
            hospitalMasterID: filterValues.hospitalFilter.HospitalMasterID.toString(),
            hospitalDeptID: filterValues.DepartmentFilter.HospitalDeptID.toString(),
            doctorMasterID: "",
            specialityMasterID: "",
            appointmentType: "",
            appointmentStatus: "",
            mrdNo: mrdNoVal,
            mobileNo: mobileNoVal,
          };
          let result = await getOpdAppointmentPatientsList(requestAppointmentPatient);
          console.log("Appointment List data", result);
          setIsLoadingAppointmentPatient(false);

          if (result.responseCode === Success) {
            if (result.responseData && result.responseData.GetPatientAppointment) {
              setAppointmentPatientList(result.responseData.GetPatientAppointment);
              setFilterAppointmentPatientList(result.responseData.GetPatientAppointment);
              setTotalRecords(result.responseData.GetPatientAppointment.length);
              getTotalAppointments();
            } else {
              setAppointmentPatientList([]);
              setTotalRecords(0);
              setFilterAppointmentPatientList([]);
            }
          } else {
            setAppointmentPatientList([]);
            setTotalRecords(0);
            setFilterAppointmentPatientList([]);
            setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
          }
        } else if (!filterValues.hospitalFilter) {
          setMsgAlert({ open: true, type: "warning", msg: "Select Hospital" });
          if (hospitalSelect.current) {
            hospitalSelect.current.focus();
          }
        } else if (!filterValues.DepartmentFilter) {
          setMsgAlert({ open: true, type: "warning", msg: "Select Department" });
          if (departmentSelect.current) {
            departmentSelect.current.focus();
          }
        }
      } else {
        setMsgAlert({ open: true, type: "warning", msg: "Clear Search By Filter" });
      }
    } catch (error) {
      setIsLoadingAppointmentPatient(false);
      Sentry.captureException(error);
      setMsgAlert({ open: true, type: "error", msg: CustomMsg.Error });
      console.log(error);
    }
  };

  const toggleTotalAppointmentsPopup = (isOpen, data) => {
    setAppointmentsCount({
      IsOpen: isOpen,
      Data: data,
    });
  };

  const getTotalAppointments = async () => {
    try {
      let formData = {
        appointmentDate: dateToCompanyFormat(moment().subtract(0, "days")),
        hospitalMasterID: filterValues.hospitalFilter.HospitalMasterID.toString(),
        departmentID: filterValues.DepartmentFilter.HospitalDeptID.toString(),
      };
      let result = await getTotalAppointment(formData);
      console.log(result);

      if (result.responseCode === Success) {
        if (result.responseData && result.responseData.GetPatientAppointmentCount) {
          if (result.responseData.GetPatientAppointmentCount.length > 0) {
            toggleTotalAppointmentsPopup(true, result.responseData.GetPatientAppointmentCount);
            setTotalAppointments(result.responseData.GetPatientAppointmentCount);
            console.log(result.responseData.GetPatientAppointmentCount);
          } else {
            setTotalAppointments([]);
          }
        } else {
          setTotalAppointments([]);
        }
      } else {
        setTotalAppointments([]);
        setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
      }
    } catch (error) {
      Sentry.captureException(error);
      setMsgAlert({ open: true, type: "error", msg: CustomMsg.Error });
      console.log(error);
    }
  };

  
  const updateFilterState = (name, value) => {
    if ((name === "SearchByFilter" && value) || (name === "txtSearchFilter" && value && value.length !== 0)) {
      setEnableControlValue(true);
      filterValues.hospitalFilter = "";
      filterValues.DepartmentFilter = "";
    } else if ((name !== "SearchByFilter" && filterValues.SearchByFilter !== null) || (name !== "txtSearchFilter" && filterValues.txtSearchFilter.length !== 0)) {
      setEnableControlValue(false);
      filterValues.txtSearchFilter = "";
      filterValues.hospitalFilter = "";
      filterValues.DepartmentFilter = "";
      filterValues.SearchByFilter = null;
      setOpdVisitList([]);
    } else {
      setEnableControlValue(false);
    }
    if (name === "hospitalFilter") {
      setAppointmentPatientList([]);
      setFilterAppointmentPatientList([]);
      setFilteredAppointmentListStatus([]);
      setTotalRecords(0);
      setTotalAppointments([]);
      setFilterValues((values) => ({
        ...values,
        hospitalFilter: value,
        DepartmentFilter: "",
      }));
      if (value) {
        filterValues.DepartmentFilter = "";
        getHospitalDepartmentList(value.HospitalMasterID);
      } else {
        setHospitalDeptList([]);
        filterValues.DepartmentFilter = "";
        setAppointmentPatientList([]);
        setTotalRecords(0);
        setFilterAppointmentPatientList([]);
        setOpdVisitList([]);
      }
    }
    if (name === "DepartmentFilter") {
      setAppointmentPatientList([]);
      setFilterAppointmentPatientList([]);
      setFilteredAppointmentListStatus([]);
      setTotalRecords(0);
      setTotalAppointments([]);
      if (!value) {
        filterValues.DepartmentFilter = "";
        setAppointmentPatientList([]);
        setFilterAppointmentPatientList([]);
        setTotalRecords(0);
        setOpdVisitList([]);
      }
    }
    // if (name === "txtSearchAppointment") {
    //   if (value) {
    //     const filteredData = appointmentPatientList.filter((data) => {
    //       return Object.values(data).join(" ").toLowerCase().includes(value.toLowerCase());
    //     });
    //     setFilterAppointmentPatientList(filteredData);
    //   } else {
    //     setFilterAppointmentPatientList(appointmentPatientList);
    //   }
    // }
    setFilterValues({ ...filterValues, [name]: value });
  };
  const onClickGetOpdVisitList = () => {

  }

  const toggleAddVisitPopup = (addPopUpType, data) => {

  }

  const [reScheduleAppointment, setReScheduleAppointment] = useState(false);
  const toggleReScheduleAppointment = (isOpen, data) => {
    setReScheduleAppointment({
      IsOpen: isOpen,
      Data: data,
    });
  };


//                   *****************************************Code for Billing**************************

const [openCreateInvoiceModal, setOpenCreateInvoiceModal] = useState(false);
const [selectedViewModeAndData, setSelectedViewModeAndData] = useState({
  selectedViewMode: "",
  selectedRowData: "",
  selectedData: {
    hospitalID: 0,
    departmentID: 0,
  },
});

const openBillingModal = (viewMode, rowData) => {
  if (viewMode && rowData) {
    setSelectedViewModeAndData(() => ({
      selectedViewMode: viewMode,
      selectedRowData: rowData,
      selectedData: {
        hospitalID: filterValues && filterValues.hospitalFilter && filterValues.hospitalFilter.HospitalMasterID,
        departmentID: filterValues && filterValues.DepartmentFilter && filterValues.DepartmentFilter.HospitalDeptID,
      },
    }));

    setOpenCreateInvoiceModal(true);
  }
};

const closeBillingModal = () => {
  setOpenCreateInvoiceModal(false);
};

const billingModalProps = {
  closeBillingModal,
  selectedViewModeAndData,
};

//                       ********************************Code for Billing ends************************************
  return (
    <>
      {openCreateInvoiceModal ? <CreateInvoice /> : null}
      <div className="Biz_Listing_PageStart">
      <PageHeader/>
        <PageTitle Title={"OPD List"} className='BizClass.PageTitle'>
          <PageInput
            type="date"
            name="dateFilter"
            disabled={enableControlValue}
            value={filterValues.dateFilter}
            onChange={(e) => updateFilterState(e.target.name, e.target.value)}
          />

          <PageSelect
            options={hospitalList}
            isLoading={isLoadingHospital}
            name="hospitalFilter"
            ControlTxt="Hospital"
            value={filterValues.hospitalFilter}
            onChange={(e) => updateFilterState("hospitalFilter", e)}
            getOptionValue={(option) => `${option}`}
            getOptionLabel={(option) => `${option.HospitalName}`}
            ref={hospitalSelect}
            isDisabled={enableControlValue}
          />

          <PageSelect
            ControlTxt="Department"
            name="DepartmentFilter"
            isDisabled={enableControlValue}
            getOptionLabel={(option) => `${option.HospitalDeptName}`}
            getOptionValue={(option) => `${option}`}
            options={hospitalDeptList}
            isLoading={isLoadingHospitalDept}
            value={filterValues.DepartmentFilter}
            onChange={(e) => updateFilterState("DepartmentFilter", e)}
            ref={departmentSelect}
          />

          <PageSelect
            ControlTxt={"Search By"}
            name="SearchByFilter"
            getOptionLabel={(option) => `${option.label}`}
            getOptionValue={(option) => `${option}`}
            options={searchByoptions}
            value={filterValues.SearchByFilter}
            onChange={(e) => updateFilterState("SearchByFilter", e)}
          />

          <PageSearch
            name="txtSearchFilter"
            value={filterValues.txtSearchFilter}
            onChange={(e) => updateFilterState(e.target.name, e.target.value)}
            onClick={() => onClickGetOpdVisitList()}
          />

          <PageButton onClick={() => toggleAddVisitPopup("Visit")}>Add Visit</PageButton>
        </PageTitle>
        </div>
    </>
  )
};

export default OPDVisit;
