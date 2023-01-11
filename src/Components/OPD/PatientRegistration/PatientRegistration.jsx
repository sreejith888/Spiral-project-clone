import React, { useState, useEffect, useRef, useCallback } from "react";
// import BizClass from "./PatientRegistration.module.scss";
import PageTitle, { PageButton, PageInput, PageSearch, PageSelect } from "../../../Framework/PageTitle/PageTitle";
// import DataGrid from "Framework/Components/Common/DataGrid/DataGrid";
import { CustomMsg } from "../../../Configuration/customMessage";
import moment from "moment";
import { dateToCompanyFormat, dateToSpecificFormat } from "../../../Configuration/dateFormat";
// import ErrorMessage from "../../../../Framework/OldFramework/ErrorAlert/ErrorMessage";
// import ConfirmDialog from "../../../../Framework/OldFramework/ConfirmDialog/ConfirmDialog";
import AddPatient from "./AddPatient";
import { Success } from "../../../Configuration/Constants";
import * as Sentry from "@sentry/react";
import { getSessionStorage } from "../../../API methods/AUTH/Auth";
import { getPatientsDataList } from "../../../API methods/OPDVisit/PatientRegistrationAdapter";
import { getHIMSMasterDataBinding } from "../../../API methods/OPDVisit/OPDVisitAdapter";
import PageHeader from "../../Common/Header/PageHeader";
import DataGrid from "../../../Framework/DataGrid/DataGrid";

function PatientRegistration() {
  const userData = getSessionStorage("user");
  const [msgAlert, setMsgAlert] = useState({ open: false, type: "", msg: "" });
  const [confirmAlert, setConfirmAlert] = useState({
    open: false,
    title: "",
    msg: "",
    onConfirm: null,
    button: { confirmText: "", abortText: "" },
  });

  const [formValues, setFormValues] = useState({
    txtHospital: "",
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    txtInput: "",
  });

  const [isLoadingHospital, setIsLoadingHospital] = useState(false);
  const [hospitalList, setHospitalList] = useState([]);

  const getHospitalList = async () => {
    try {
      setIsLoadingHospital(true);
      let result = await getHIMSMasterDataBinding("GETHOSP", "", userData && userData.UserData && userData.UserData.UserID);
      setIsLoadingHospital(false);
      console.log(result);
      if (result.responseCode === Success) {
        if (result.responseData && result.responseData.HIMSMasterDataBinding) {
          setHospitalList(result.responseData.HIMSMasterDataBinding);
          console.log();
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

  useEffect(() => {
    getHospitalList();
  }, []);

  const [addPatientPopup, setAddPatientPopup] = useState(false);
  const toggleAddSearchPatientPopup = () => {
    if (formValues.txtHospital) {
      setAddPatientPopup(!addPatientPopup);
    } else {
      setFormValues({
        ...formValues,
        txtInput: "",
      });
      setEnableHospital(false);
      if (hospitalSelect.current) {
        hospitalSelect.current.focus();
      }
      setMsgAlert({ open: true, type: "warning", msg: "Please Select Hospital to Register Patient" });
    }
  };

  const [enableHospital, setEnableHospital] = useState(false);
  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });

    if (name === "txtHospital") {
      if (value) {
        setpatientsList([]);
      } else {
        setpatientsList([]);
      }
    }
    if (name === "txtInput") {
      if (value) {
        setEnableHospital(true);
      } else {
        setEnableHospital(false);
      }
    }
  };
  const hospitalSelect = useRef();

  const onClickGetpatientsList = () => {
    if (formValues.txtInput) {
      getPatientsList();
    } else if (formValues.txtHospital) {
      if (formValues.txtFromDate) {
        if (formValues.txtToDate) {
          if (formValues.txtFromDate > formValues.txtToDate) {
            setMsgAlert({
              open: true,
              type: "warning",
              msg: "From Date Must Be Less Than To Date",
            });
          } else {
            getPatientsList();
          }
        } else {
          setMsgAlert({ open: true, type: "warning", msg: "Please Select To Date" });
        }
      } else {
        setMsgAlert({ open: true, type: "warning", msg: "Please Select From Date" });
      }
    } else {
      if (hospitalSelect.current) {
        hospitalSelect.current.focus();
      }
      setMsgAlert({ open: true, type: "warning", msg: "Please Select Hospital or Mobile No" });
    }
  };

  const [patientsList, setpatientsList] = useState([]);
  const [isLoadingPatientsList, setIsLoadingPatientsList] = useState(false);
  const getPatientsList = async () => {
    try {
      let formData = {
        viewMode: "OPDPATIENT",
        HospitalID: formValues.txtHospital ? formValues.txtHospital.HospitalMasterID.toString() : "",
        mobileNo: formValues.txtInput ? formValues.txtInput.toString() : "",
        FromDate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        ToDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        mrdNo: "",
      };
      setIsLoadingPatientsList(true);
      const result = await getPatientsDataList(formData);
      setIsLoadingPatientsList(false);
      console.log("data", result);
      if (result.responseCode === Success) {
        if (result.responseData && result.responseData.GetPatientList) {
          setpatientsList(result.responseData.GetPatientList);
        } else {
          setpatientsList([]);
        }
      } else {
        setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
      }
    } catch (error) {
      Sentry.captureException(error);
      setMsgAlert({ open: true, type: "error", msg: CustomMsg.Error });
    }
  };

  const updatePatients = (newlyAddedPatient) => {
    console.log("pooja", newlyAddedPatient);
    patientsList.unshift(newlyAddedPatient);
    setpatientsList([]);
    setpatientsList(patientsList);
  };

  const gridRef = useRef();
  const onFirstDataRendered = useCallback((params) => {
    const allColumnIds = [];
    params.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getId());
    });
    params.columnApi.autoSizeColumns(allColumnIds);
  }, []);

  return (
    <React.Fragment>
      {/* {msgAlert.open && <ErrorMessage msgAlert={msgAlert} setMsgAlert={setMsgAlert} />}
      {confirmAlert.open && <ConfirmDialog confirmAlert={confirmAlert} setConfirmAlert={setConfirmAlert} />} */}
      {addPatientPopup ? (
        <AddPatient
          toggleAddSearchPatientPopup={toggleAddSearchPatientPopup}
          selectedHospital={formValues.txtHospital}
          updatePatients={updatePatients}
          setConfirmAlert={setConfirmAlert}
          PageButton={PageButton}
        />
      ) : null}
      <div className="Biz_Listing_PageStart">
      <PageHeader/>
        <PageTitle Title="Patient Registration">
          <PageSelect
            ControlTxt={"Hospital"}
            options={hospitalList}
            getOptionLabel={(option) => `${option.HospitalName}`}
            value={formValues.txtHospital}
            getOptionValue={(option) => `${option}`}
            isLoading={isLoadingHospital}
            isDisabled={enableHospital ? true : false}
            name="txtHospital"
            onChange={(e) => updateState("txtHospital", e)}
            ref={hospitalSelect}
          />
          <PageInput
            type={"date"}
            value={formValues.txtFromDate}
            name="txtFromDate"
            // min={dateToSpecificFormat(moment().subtract(0, 'days'), 'YYYY-MM-DD')}
            placeholder="dd-mm-yyyy"
            onChange={(e) => updateState(e.target.name, e.target.value)}
          />
          <PageInput
            type={"date"}
            value={formValues.txtToDate}
            name="txtToDate"
            min={formValues.txtFromDate ? formValues.txtFromDate : ""}
            onChange={(e) => updateState(e.target.name, e.target.value)}
          />
          <PageSearch
            focus={true}
            placeholder={"Search with Mobile No"}
            autoComplete="off"
            name="txtInput"
            onClick={() => onClickGetpatientsList()}
            value={formValues.txtInput}
            onChange={(e) => updateState(e.target.name, e.target.value)}
            maxLength={10}
          />
          <PageButton onClick={() => toggleAddSearchPatientPopup()}>Add</PageButton>
        </PageTitle>
        <DataGrid
          rowData={patientsList}
          ref={gridRef}
          onFirstDataRendered={onFirstDataRendered}
          getRowStyle={function (data) {
            if (data.data.IsNewlyAdded) {
              return { background: "#d5a10e" };
            }
            return { background: "" };
          }}
          frameworkComponents={{
            createdOnTemplate: CreatedOnTemplate,
            addressTemplate: AddressTemplate,
            registerDateTemplate: RegisterDateTemplate,
          }}
          // loader={isLoadingPatientsList ? <Loader /> : null}
        >
          <DataGrid.Column field="#" headerName="Action" width={100} pinned="left" />
          <DataGrid.Column field="#" headerName="Sr No." width={75} valueGetter="node.rowIndex + 1" />
          <DataGrid.Column field="PMobileNo" headerName="Mobile No." width={105} />
          <DataGrid.Column field="PatientName" headerName="Patient Name" width={160} />
          <DataGrid.Column field="HosMRDNo" headerName="Hospital MRD No." width={160} />
          <DataGrid.Column field="Gender" headerName="Gender" width={85} />
          <DataGrid.Column field="RegisterDate" headerName="Register Date" width={120} cellRenderer="registerDateTemplate" />
          <DataGrid.Column field="PEMailAddress" headerName="Email Address" width={160} />
          <DataGrid.Column field="DateofBirth" headerName="D.O.B" width={90} cellRenderer="createdOnTemplate" />
          <DataGrid.Column field="AadharNo" headerName="Aadhar No." width={110} />
          <DataGrid.Column field="UHIDNo" headerName="UHID" width={110} />
          <DataGrid.Column field="AddressLine1" headerName="Address" width={400} cellRenderer="addressTemplate" />
          <DataGrid.Column field="ReferedBy" headerName="Refered By" width={120} />
          <DataGrid.Column field="ReferedByName" headerName="Reference Name" width={180} />
          <DataGrid.Column field="CampaignName" headerName="Campaign Name" width={180} />
          <DataGrid.Column field="Salesperson" headerName="Sale Person" width={180} />
        </DataGrid>
      </div>
    </React.Fragment>
  );
}

export default PatientRegistration;
const CreatedOnTemplate = (props) => {
  return (
    <React.Fragment>
      {props.data && props.data.DateofBirth ? (
        <div style={{ display: "flex" }}>
          <p>{dateToCompanyFormat(props.data.DateofBirth.split("T")[0])}</p>
        </div>
      ) : null}
    </React.Fragment>
  );
};

const RegisterDateTemplate = (props) => {
  return (
    <React.Fragment>
      {props.data && props.data.RegisterDate ? (
        <div style={{ display: "flex" }}>
          <p>{dateToCompanyFormat(props.data.RegisterDate.split("T")[0])}</p>
        </div>
      ) : null}
    </React.Fragment>
  );
};

const AddressTemplate = (props) => {
  return (
    <React.Fragment>
      {props.data ? (
        <div style={{ display: "flex" }}>
          <p>
            {props.data.AddressLine1 ? props.data.AddressLine1 : ""} {props.data.AddressLine2 ? props.data.AddressLine2 : ""} {props.data.CityName ? props.data.CityName : ""}
          </p>
        </div>
      ) : null}
    </React.Fragment>
  );
};
