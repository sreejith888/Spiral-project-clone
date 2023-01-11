import React, { useEffect, useState, useRef } from "react";
import BizClass from "./PatientRegistration.module.scss";
import { PageSearchButton } from "../../../Framework/PageTitle/PageTitle";
import Form from "../../../Framework/FormGroup/FormGroup"
import Modal from "../../../Framework/Modal/Modal";
import { dateToCompanyFormat, dateToSpecificFormat } from "../../../Configuration/dateFormat";
import { CustomMsg } from "../../../Configuration/customMessage";
import moment from "moment";
import { Success } from "../../../Configuration/Constants";
import classNames from "classnames";
import { BiSearch } from "react-icons/bi";
import { EnterKeyCode } from "../../../Configuration/Constants";
import { AiOutlineUser } from "react-icons/ai";
import { getAgeCalculatedFromDOB, getAgeYear, getAgeMonth, getDOBOnYearChange, getDOBOnMonthChange, getDOBCalculatedFromAge } from "../../../Configuration/AgeCalculator";
import * as Sentry from "@sentry/react";
import { getAppointTypeList, getPatientList } from "../../../API methods/OPDVisit/PatientAppointmentAdapter";
import { getGetPageConfigPublish } from "../../../API methods/OPDVisit/PageConfigAdapter";
import { addPatientInformation, getCityBinding, getHimsMasterDataBinding, getHimsReferNameBinding, getHRMSMasterData } from "../../../API methods/OPDVisit/PatientRegistrationAdapter";
import Button from "../../../Framework/Button/Button";

function AddPatient(props) {
  let toggleAddSearchPatientPopup = props.toggleAddSearchPatientPopup;
  let selectedHospital = props.selectedHospital;
  let PageButton = props.PageButton;
  const [msgAlert, setMsgAlert] = useState({ open: false, type: "", msg: "" });

  const [confirmAlert, setConfirmAlert] = useState({
    open: false,
    title: "",
    msg: "",
    onConfirm: null,
    button: { confirmText: "", abortText: "" },
  });
  const [disableFields, setDisableFields] = useState(true);
  const [searchPatientPopup, setSearchPatientPopup] = useState(false);
  const toggleSearchPatientPopup = () => {
    setSearchPatientPopup(!searchPatientPopup);
  };

  const [formValues, setFormValues] = useState({
    txtReferBy: "",
    txtReferenceName: "",
    txtCampaign: "",
    txtSalePerson: "",
    txtCity: "",
    txtSearchBy: "",
    txtInputValue: "",
    txtSalutation: "",
    txtFirstName: "",
    txtLastName: "",
    txtGender: "",
    txtEmail: "",
    txtDob: "",
    txtYear: "",
    txtMonth: "",
    txtAddress1: "",
    txtAddress2: "",
    txtPatientId: "",
    txtMobileNO: "",
    txtMrdNo: "",
    txtAadhar: "",
    txtUhidNo: "",
    txtCountry: "",
  });

  const [fieldPlaceHolder, setPlaceHolder] = useState({});
  const [fieldMaxLength, setFieldMaxLength] = useState({});
  const [requireField, setRequireField] = useState({});
  const [fieldRegx, setFieldRegx] = useState({});
  const [allowCharacter, setAllowCharacter] = useState({});
  const [fieldConfig, setFieldConfig] = useState([]);
  const [formStatusAfterSave, setFormStatusAfterSave] = useState("");
  useEffect(async () => {
    const result = await getGetPageConfigPublish({
      bizNextPageID: "4",
      searchtext: "#ALL",
    });
    console.log(result, "that");
    if (result.responseCode === Success) {
      if (result.responseData && result.responseData.opt && result.responseData.opt.length > 0) {
        let patientRegistrationData = result.responseData.opt[0];
        let patientConfigData = patientRegistrationData["Patient Registration"];
        if (patientConfigData) {
          console.log(patientConfigData, "data");
          setFormStatusAfterSave(patientConfigData.CloseAfterSave);
          setFieldConfig(patientConfigData.Fields);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (fieldConfig && fieldConfig.length > 0) {
      let placeholder = {};
      let maxlength = {};
      let requirefield = {};
      let regx = {};
      let allowcharacter = {};
      fieldConfig.forEach((field) => {
        placeholder[field.ControlName] = field.PlaceHolder;
        maxlength[field.ControlName] = field.MaxLength;
        requirefield[field.ControlName] = field.isRequired ? field.isRequired.toString() : field.isRequired === false ? "false" : "";
        regx[field.ControlName] = field.Expression;
        allowcharacter[field.ControlName] = field.AllowedCharacter;
      });
      setPlaceHolder(placeholder);
      setFieldMaxLength(maxlength);
      setRequireField(requirefield);
      setFieldRegx(regx);
      setAllowCharacter(allowcharacter);
    }
  }, [fieldConfig]);

  const [ageEntryType, setAgeEntryType] = useState("");
  const [monthChanged, setMonthChanged] = useState(false);
  const [ageChanged, setAgeChanged] = useState(false);
  const [dateChanged, setDateChanged] = useState(false);
  const [formValidationError, setFormValidationError] = useState({});

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    formValidationError[name] = validateField(name, value);
    if (name === "txtReferBy") {
      setReferenceNameValue("");
      setReferenceName([]);
      setFormValues({
        ...formValues,
        txtReferBy: value,
        txtReferenceName: "",
      });
    }
    if (name === "txtDob") {
      //onChangeDob(value);
      setFormValues((values) => ({
        ...values,
        txtDob: value,
        txtAgeEntryType: "D",
      }));
      setAgeEntryType("D");
    }
    if (name === "txtYear") {
      //onChangeYear(value);
      const year = value === null || value === undefined ? "" : value;
      setFormValues((values) => ({
        ...values,
        txtYear: year,
        txtAgeEntryType: "A",
      }));
      setAgeEntryType("A");
    }
    if (name === "txtMonth") {
      //onChangeMonth(value);
      const month = value === null || value === undefined ? "" : value;
      setFormValues((values) => ({
        ...values,
        txtMonth: month,
        txtAgeEntryType: "A",
      }));
      setAgeEntryType("A");
    }
    if (name === "txtCountry") {
      setCityList([]);
      setFormValues({
        ...formValues,
        txtCountry: value,
        txtCity: "",
      });
    }
  };

  const onChangeAge = (dayMonth, yearData) => {
    debugger;
    const day = dayMonth && dayMonth.length > 0 ? dayMonth.split(".")[1].replaceAll("_", "") : "";
    console.log(dayMonth,"**********daymonth*********");
    console.log(day);
    const month = dayMonth && dayMonth.length > 0 ? dayMonth.split(".")[0].replaceAll("_", "") : "";

    const year = yearData;
    console.log("poojaday", day);
    const Y = getDOBCalculatedFromAge(day, month, year);
    setFormValues((values) => ({
      ...values,
      txtDob: Y,
    }));
    // }
  };

  useEffect(() => {
    debugger;
    if (formValues.txtAgeEntryType === "A" || ageEntryType === "A") {
      if (formValues.txtYear) {
        onChangeAge(formValues.txtMonth, formValues.txtYear);
        setAgeChanged(true);
      } else if (formValues.txtMonth && formValues.txtMonth !== "__.__") {
        onChangeAge(formValues.txtMonth, formValues.txtYear);
        setAgeChanged(true);
      } else {
        setFormValues((values) => ({
          ...values,
          txtDob: "",
          txtAgeEntryType: "",
        }));
        setAgeChanged(false);
        setAgeEntryType("");
      }
    }
  }, [formValues.txtYear, formValues.txtMonth]);

  const onChangeDob = (value) => {
    debugger;
    if (value.length === 10) {
      const YMD = getAgeCalculatedFromDOB(value);
      const day = YMD.split(".")[0].toString().length === 1 ? "0" + YMD.split(".")[0] : YMD.split(".")[0].toString().length === 0 ? "00" : YMD.split(".")[0];
      const month = YMD.split(".")[1].toString().length === 1 ? "0" + YMD.split(".")[1] : YMD.split(".")[1].toString().length === 0 ? "00" : YMD.split(".")[1];
      const year = YMD.split(".")[2].length === 0 ? "0" : YMD.split(".")[2];
      setFormValues((values) => ({
        ...values,
        txtYear: year,
        txtMonth: month + "." + day,
        txtDob: value,
      }));
    } else {
      setFormValues((values) => ({
        ...values,
        txtYear: "",
        txtMonth: "",
        txtDob: value,
      }));
    }
  };

  useEffect(() => {
    debugger;
    if (formValues.txtAgeEntryType === "D" || ageEntryType === "D") {
      setDateChanged(true);
      if (formValues.txtDob.length === 10) {
        onChangeDob(formValues.txtDob);
      } else {
        setFormValues((values) => ({
          ...values,
          txtYear: "",
          txtMonth: "",
          txtAgeEntryType: "",
        }));
        setDateChanged(false);
        setAgeEntryType("");
      }
    }
  }, [formValues.txtDob]);
  useEffect(() => {
    formValues.txtReferenceName = "";
  }, [formValues.txtReferBy]);

  useEffect(() => {
    getCampaignMasterBinding();
    getSourceData();
    getGenderData();
    getSalutationdata();
    getCountryList("#all");
  }, []);

  const options = [
    { value: "MobileNo", label: "Mobile No" },
    // { value: 'MRD', label: 'MRD' }
  ];

  const Gender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const Salutation = [
    { value: "Mr", label: "Mr" },
    { value: "Mrs", label: "Mrs" },
  ];

  const [isLoadingReferBy, setIsLoadingReferBy] = useState(false);
  const [referBy, setReferBy] = useState([]);
  const referedByMasterBinding = async (searchText) => {
    try {
      setIsLoadingReferBy(true);
      let result = await getHimsMasterDataBinding("GETREFERBY", searchText);
      setIsLoadingReferBy(false);
      console.log(result);
      if (result.responseCode === Success) {
        if (result.responseData && result.responseData.HIMSMasterDataBinding) {
          setReferedByValue("");
          if (referedByValue && referedByValue.toLowerCase().includes("#")) {
            setReferedByValue("");
          }
          setReferBy(result.responseData.HIMSMasterDataBinding);
          console.log();
        } else {
          setReferBy([]);
        }
      } else {
        setReferBy([]);
        setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
      }
    } catch (error) {
      Sentry.captureException(error);
      setMsgAlert({ open: true, type: "error", msg: CustomMsg.Error });
      console.log(error);
    }
  };

  const [isLoadingReferenceName, setIsLoadingReferenceName] = useState(false);
  const [referenceName, setReferenceName] = useState([]);
  const referenceNameMasterBinding = async (referedBy, serachText) => {
    if (referedBy) {
      console.log(referedBy);
      try {
        setIsLoadingReferenceName(true);
        let result = await getHimsReferNameBinding("GETREFERENCE", referedBy ? referedBy.PatientReferenceID.toString() : "", serachText ? serachText : "#all");
        setIsLoadingReferenceName(false);
        console.log(result);
        if (result.responseCode === Success) {
          if (result.responseData && result.responseData.HIMSMasterDataBinding) {
            if (referenceNameValue && referenceNameValue.toLowerCase().includes("#")) {
              setReferenceNameValue("");
            }
            setReferenceName(result.responseData.HIMSMasterDataBinding);
            console.log();
          } else {
            setReferenceName([]);
          }
        } else {
          setReferenceName([]);
          setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
        }
      } catch (error) {
        Sentry.captureException(error);
        setMsgAlert({ open: true, type: "error", msg: CustomMsg.Error });
        console.log(error);
      }
    } else {
      setMsgAlert({ open: true, type: "warning", msg: "Please Select ReferedBy First" });
    }
  };

  const [isLoadingCampaign, setIsLoadingCampaign] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const getCampaignMasterBinding = async () => {
    try {
      setIsLoadingCampaign(true);
      let result = await getHimsMasterDataBinding("GETCAMPAIGN");
      setIsLoadingCampaign(false);
      console.log(result);
      if (result.responseCode === Success) {
        if (result.responseData && result.responseData.HIMSMasterDataBinding) {
          setCampaignData(result.responseData.HIMSMasterDataBinding);
        } else {
          setCampaignData([]);
        }
      } else {
        setCampaignData([]);
        setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
      }
    } catch (error) {
      Sentry.captureException(error);
      setMsgAlert({ open: true, type: "error", msg: CustomMsg.Error });
      console.log(error);
    }
  };

  const [searchPersonList, setSearchPersonList] = useState([]);
  const [isLoadingSearchPerson, setIsLoadingSearchPerson] = useState(false);
  const getSalePersonList = async (searchTerm) => {
    try {
      setIsLoadingSearchPerson(true);
      const result = await getHRMSMasterData("EMPSALE", searchTerm);
      console.log(result);
      setIsLoadingSearchPerson(false);
      if (result.responseCode === Success) {
        if (result.responseData && result.responseData.hRMSDataBinding && result.responseData.hRMSDataBinding.length > 0) {
          if (salePersonSearch && salePersonSearch.toLowerCase().includes("#")) {
            setSalePersonSearch("");
          }
          setSearchPersonList(result.responseData.hRMSDataBinding);
        } else {
          setSearchPersonList([]);
        }
      } else {
        setSearchPersonList([]);
        setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
        console.log(result.responseMessage);
      }
    } catch (error) {
      Sentry.captureException(error);
      setMsgAlert({
        open: true,
        type: "error",
        msg: error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : CustomMsg.Error,
      });
      console.log(error);
    }
  };

  const [cityList, setCityList] = useState([]);
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const getCityList = async (searchTerm) => {
    if (formValues.txtCountry) {
      try {
        setIsLoadingCity(true);
        const result = await getCityBinding({
          filterID: formValues.txtCountry ? formValues.txtCountry.CountryMasterID.toString() : "0",
          filterID1: "0",
          masterName: "CITYMAS",
          searchText: searchTerm,
          searchCriteria: "",
        });
        console.log(result);
        setIsLoadingCity(false);
        if (result.responseCode === Success) {
          if (result.responseData && result.responseData.masterdatabinding && result.responseData.masterdatabinding.length > 0) {
            if (citySearch && citySearch.toLowerCase().includes("#")) {
              setCitySearch("");
            }
            setCityList(result.responseData.masterdatabinding);
          } else {
            setCityList([]);
          }
        } else {
          setCityList([]);
          setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
          console.log(result.responseMessage);
        }
      } catch (error) {
        Sentry.captureException(error);
        setMsgAlert({
          open: true,
          type: "error",
          msg: error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : CustomMsg.Error,
        });
        console.log(error);
      }
    } else {
      setMsgAlert({ open: true, type: "warning", msg: "Please Select Nationality" });
    }
  };

  const [countryList, setCountryList] = useState([]);
  const [isLoadingCountry, setIsLoadingCountry] = useState(false);
  const getCountryList = async (searchterm) => {
    try {
      setIsLoadingCountry(true);
      const result = await getCityBinding({ filterID: "0", filterID1: "0", masterName: "COUNTRY", searchText: "#all", searchCriteria: "" });
      console.log("pooja", result);
      setIsLoadingCountry(false);
      if (result.responseCode === Success) {
        if (result.responseData && result.responseData.masterdatabinding && result.responseData.masterdatabinding.length > 0) {
          //   if (countrySearch && countrySearch.toLowerCase().includes("#")) {
          //     setCountrySearch("");
          //   }
          setCountryList(result.responseData.masterdatabinding);
        } else {
          setCountryList([]);
        }
      } else {
        setCountryList([]);
        setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
        console.log(result.responseMessage);
      }
    } catch (error) {
      Sentry.captureException(error);
      setMsgAlert({
        open: true,
        type: "error",
        msg: error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : CustomMsg.Error,
      });
      console.log(error);
    }
  };

  const [gender, setGender] = useState([]);
  const [isLoadingGender, setIsLoadingGender] = useState(false);
  const getGenderData = async () => {
    try {
      setIsLoadingGender(true);
      const result = await getCityBinding({ filterID: "102", filterID1: "0", masterName: "COMMVAL", searchText: "#all", searchCriteria: "AW" });
      console.log(result);
      setIsLoadingGender(false);
      if (result.responseCode === Success) {
        if (result.responseData && result.responseData.masterdatabinding && result.responseData.masterdatabinding.length > 0) {
          setGender(result.responseData.masterdatabinding);
        } else {
          setGender([]);
        }
      } else {
        setGender([]);
        setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
        console.log(result.responseMessage);
      }
    } catch (error) {
      Sentry.captureException(error);
      setMsgAlert({
        open: true,
        type: "error",
        msg: error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : CustomMsg.Error,
      });
      console.log(error);
    }
  };

  const [salutationdata, setSalutationData] = useState([]);
  const [isLoadingSalutation, setIsLoadingsalutation] = useState(false);
  const getSalutationdata = async () => {
    try {
      setIsLoadingsalutation(true);
      const result = await getCityBinding({ filterID: "101", filterID1: "0", masterName: "COMMVAL", searchText: "#all", searchCriteria: "AW" });
      console.log(result);
      setIsLoadingsalutation(false);
      if (result.responseCode === Success) {
        if (result.responseData && result.responseData.masterdatabinding && result.responseData.masterdatabinding.length > 0) {
          setSalutationData(result.responseData.masterdatabinding);
        } else {
          setSalutationData([]);
        }
      } else {
        setSalutationData([]);
        setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
        console.log(result.responseMessage);
      }
    } catch (error) {
      Sentry.captureException(error);
      setMsgAlert({
        open: true,
        type: "error",
        msg: error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : CustomMsg.Error,
      });
      console.log(error);
    }
  };

  const [salePersonSearch, setSalePersonSearch] = useState("");
  useEffect(() => {
    const timeOutHandler = setTimeout(() => {
      if (salePersonSearch && salePersonSearch.length >= 3) {
        if (salePersonSearch.toLowerCase().includes("#")) {
          if (salePersonSearch.toLowerCase() !== "#all") {
            return;
          } else {
            getSalePersonList("#all");
            return;
          }
        }
        getSalePersonList(salePersonSearch);
      }
    }, 500);
    return () => clearTimeout(timeOutHandler);
  }, [salePersonSearch]);

  const [citySearch, setCitySearch] = useState("");
  useEffect(() => {
    const timeOutHandler = setTimeout(() => {
      if (citySearch && citySearch.length >= 3) {
        if (citySearch.toLowerCase().includes("#")) {
          if (citySearch.toLowerCase() !== "#all") {
            return;
          } else {
            getCityList("#all");
            return;
          }
        }
        getCityList(citySearch);
      }
    }, 500);
    return () => clearTimeout(timeOutHandler);
  }, [citySearch]);

  const [referedByValue, setReferedByValue] = useState("");
  useEffect(() => {
    const timeOutHandler = setTimeout(() => {
      if (referedByValue && referedByValue.length >= 3) {
        if (referedByValue.toLowerCase().includes("#")) {
          if (referedByValue.toLowerCase() !== "#all") {
            return;
          } else {
            referedByMasterBinding(referedByValue);
            return;
          }
        }
        referedByMasterBinding(referedByValue);
      }
    }, 500);
    return () => clearTimeout(timeOutHandler);
  }, [referedByValue]);

  const [referenceNameValue, setReferenceNameValue] = useState("");
  useEffect(() => {
    const timeOutHandler = setTimeout(() => {
      if (referenceNameValue && referenceNameValue.length >= 3) {
        if (referenceNameValue.toLowerCase().includes("#")) {
          if (referenceNameValue.toLowerCase() !== "#all") {
            return;
          } else {
            referenceNameMasterBinding(formValues.txtReferBy, referenceNameValue);
            return;
          }
        }
        referenceNameMasterBinding(formValues.txtReferBy, referenceNameValue);
      }
    }, 500);
    return () => clearTimeout(timeOutHandler);
  }, [referenceNameValue]);

  const validateField = (name, value) => {
    let errorsMsg = "";

    if (name === "txtSalutation" || name === "txtGender" || name === "txtDob") {
      if (requireField[name] === "true") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Cannot be empty";
        }
      }
    } else if (name === "txtInputValue" || name === "txtAadhar") {
      if (requireField[name] === "true") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Cannot be empty";
        }
      }
      if (value && typeof value !== "undefined" && fieldRegx[name]) {
        const regex = new RegExp(fieldRegx[name]);
        if (!regex.test(value)) {
          errorsMsg = "Not valid";
        }
      }
    } else if (name === "txtEmail") {
      if (!value || typeof value === "undefined") {
      } else {
        //let regex = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
        let regex = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g);
        if (!regex.test(value)) {
          errorsMsg = "Not valid";
        }
      }
    } else if (name === "txtFirstName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Cannot be empty";
      }
    } else if (name === "txtLastName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Cannot be empty";
      }
    } else if (name === "txtMonth") {
      if (!value || typeof value === "undefined") {
      } else {
        // const LastDayOfMonth = getLstDayOfMonFnc(new Date(new Date().getFullYear() - formValues.txtYear, value.toString().split(".")[0], 1));
        if (value.toString().split(".")[0] >= 12) {
          errorsMsg = "Month Invalid";
        }
        if (value.toString().split(".")[1] > 30) {
          errorsMsg = "Day Invalid";
        }
      }
    }
    if (name === "txtYear") {
      if (!value || typeof value === "undefined") {
      } else {
        console.log("year", value.toString());
        if (value.toString() > 99) {
          errorsMsg = "Not Valid";
        }
      }
    }
    return errorsMsg;
  };

  const handleValidation = () => {
    const errors = {};
    let formIsValid = true;
    errors["txtDob"] = validateField("txtDob", formValues.txtDob);
    errors["txtGender"] = validateField("txtGender", formValues.txtGender);
    errors["txtLastName"] = validateField("txtLastName", formValues.txtLastName);
    errors["txtFirstName"] = validateField("txtFirstName", formValues.txtFirstName);
    errors["txtSalutation"] = validateField("txtSalutation", formValues.txtSalutation);
    errors["txtInputValue"] = validateField("txtInputValue", formValues.txtInputValue);
    errors["txtEmail"] = validateField("txtEmail", formValues.txtEmail);
    errors["txtYear"] = validateField("txtYear", formValues.txtYear);
    errors["txtMonth"] = validateField("txtMonth", formValues.txtMonth);
    errors["txtAadhar"] = validateField("txtAadhar", formValues.txtAadhar);
    if (Object.values(errors).join("").toString()) {
      formIsValid = false;
    }
    setFormValidationError(errors);
    return formIsValid;
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const [isLoadingPatientList, setIsLoadingPatientList] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const getPatientsList = async (searchType) => {
    try {
      setIsLoadingPatientList(true);
      setBtnLoaderActive(true);
      let result = await getPatientList(searchType, formValues.txtInputValue ? formValues.txtInputValue.toString() : "");
      setIsLoadingPatientList(false);
      setBtnLoaderActive(false);
      console.log(result);
      if (result.responseCode === Success) {
        if (result.responseData && result.responseData.GetPatientList) {
          if (result.responseData.GetPatientList.length > 0) {
            setPatientList(result.responseData.GetPatientList);
            toggleSearchPatientPopup();
          } else {
            setDisableFields(false);
            clearData();
            setMsgAlert({
              open: true,
              type: "warning",
              msg: "No User Registered on this Number",
            });
            setPatientList([]);
            setFormValues({
              ...formValues,
              txtCountry: { CountryName: "India - IND", CountryMasterID: 1001 },
              txtCity:
                selectedHospital && selectedHospital.CityMasterID && selectedHospital.CityName
                  ? { CityMasterID: selectedHospital.CityMasterID, CityName: selectedHospital.CityName }
                  : "",
            });
          }
        } else {
          setPatientList([]);
        }
      } else {
        setPatientList([]);
        setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
      }
    } catch (error) {
      Sentry.captureException(error);
      setMsgAlert({ open: true, type: "error", msg: CustomMsg.Error });
      console.log(error);
    }
  };

  const [isLoadingSourceData, setIsLoadingSourceData] = useState(false);
  const [sourceData, setSourceData] = useState([]);

  const getSourceData = async () => {
    try {
      setIsLoadingSourceData(true); 
      let result = await getAppointTypeList({ masterDataCode: 2027 });
      setIsLoadingSourceData(false);
      console.log(result);
      if (result.responseCode === Success) {
        if (result.responseData && result.responseData.DataFile) {
          var filterFile = result.responseData.DataFile.filter(function (x) {
            return x.MasterDisplayName === "Web";
          });
          setSourceData(filterFile);
          console.log();
        } else {
          setSourceData([]);
        }
      } else {
        setSourceData([]);
        setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
      }
    } catch (error) {
      Sentry.captureException(error);
      setMsgAlert({ open: true, type: "error", msg: CustomMsg.Error });
      console.log(error);
    }
  };

  const onClickGetPatients = () => {
    if (formValues.txtInputValue.length === 0) {
      setMsgAlert({
        open: true,
        type: "warning",
        msg: "First Search By Mobile No To Register Patient",
      });
      if (inputSelect.current) {
        inputSelect.current.focus();
      }
    } else if (!(formValues.txtInputValue.length === 10)) {
      setMsgAlert({
        open: true,
        type: "warning",
        msg: "Enter Valid 10 digit mobile No.",
      });

      if (inputSelect.current) {
        inputSelect.current.focus();
      }
    } else {
      getPatientsList("MOBILENO");
    }
  };

  const [selectedPatient, setSelectedPatient] = useState();
  const selectedPatientDetails = (data) => {
    console.log(data);
    setSearchPatientPopup(!searchPatientPopup);
    setSelectedPatient(data);
  };

  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function getMonth(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var m =
      today.getMonth() - birthDate.getMonth() < 0
        ? today.getMonth() - birthDate.getMonth() + 12
        : today.getMonth() - birthDate.getMonth() === 0
        ? today.getDate() - birthDate.getDate() < 0
          ? "11"
          : "0"
        : today.getMonth() - birthDate.getMonth();
    return m;
  }

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!handleValidation()) {
      return;
    }
    setConfirmAlert({
      open: true,
      title: "Save",
      msg: "Are you sure to Save ?",
      button: {
        confirmText: "Save",
        abortText: "Cancel",
      },
      onConfirm: () => onConfirmHandleSave(),
    });
  };

  const [saveBtnLoaderActive, setSaveBtnLoaderActive] = useState();
  const onConfirmHandleSave = async (e) => {
    if (e) e.preventDefault();
    if (!handleValidation()) {
      return;
    }
    try {
      let year = parseInt(formValues.txtYear);
      let month = formValues.txtMonth / 12;
      let age = year + month;
      const mday = formValues && formValues.txtMonth ? formValues.txtMonth.replaceAll("_", "") : "";
      setSaveBtnLoaderActive(true);
      let formData = {
        patientMasterID: formValues.txtPatientId ? formValues.txtPatientId : "0",
        salutationID: formValues.txtSalutation ? formValues.txtSalutation.CommonMasterValueID.toString() : "0",
        pFirstName: formValues.txtFirstName ? formValues.txtFirstName : "",
        pLastName: formValues.txtLastName ? formValues.txtLastName : "",
        pGenderID: formValues.txtGender ? formValues.txtGender.CommonMasterValueID.toString() : "0",
        pMobileNo: formValues.txtMobileNO ? formValues.txtMobileNO.toString() : formValues.txtInputValue ? formValues.txtInputValue.toString() : "",
        peMailAddress: formValues.txtEmail ? formValues.txtEmail.toString() : "",
        hospitalID: selectedHospital ? selectedHospital.HospitalMasterID.toString() : "0",
        pmrdNo: formValues.txtMrdNo ? formValues.txtMrdNo.toString() : "0",
        DateofBirth: formValues.txtDob ? dateToCompanyFormat(formValues.txtDob) : "",
        // month: formValues.txtYear === 0 || "" || "0" ? formValues.txtMonth === "0" ? 1 : (formValues.txtMonth ? formValues.txtMonth : "0") : formValues.txtMonth ? formValues.txtMonth : "0",
        // month: formValues.txtMonth ? formValues.txtMonth : "0",
        month: formValues.txtMonth ? Number(mday.split(".")[0]) : 0,
        day: formValues.txtMonth ? Number(mday.split(".")[1]) : 0,
        year: formValues.txtYear ? formValues.txtYear : "0",
        // patientAge: formValues.txtYear === "" || 0 ? (formValues.txtMonth === '0') ? (1 / 12).toFixed(5).toString().replace(/(\.0+|0+)$/, '') : ((formValues.txtMonth) / 12).toFixed(5).toString().replace(/(\.0+|0+)$/, '') : age.toFixed(5).toString().replace(/(\.0+|0+)$/, ''),
        aadharNo: formValues.txtAadhar ? formValues.txtAadhar : "",
        uhidNo: formValues.txtUhidNo ? formValues.txtUhidNo : "",
        entrySource: sourceData ? sourceData[0].MasterValueID.toString() : "",
        howtoKnowID: 0,
        referedByID: formValues.txtReferBy ? formValues.txtReferBy.PatientReferenceID.toString() : "0",
        referedByName: formValues.txtReferenceName ? formValues.txtReferenceName.ReferenceValueName : "",
        salePersonID: formValues.txtSalePerson ? formValues.txtSalePerson.EmployeeID.toString() : "0", // reconfirm need
        marketingCampaignID: formValues.txtCampaign ? formValues.txtCampaign.MarketCampaignID.toString() : "0",
        tpPatientID: 0,
        tpPatientNo: "",
        addressTypeID: 0,
        addressLine1: formValues.txtAddress1 ? formValues.txtAddress1 : "",
        addressLine2: formValues.txtAddress2 ? formValues.txtAddress2 : "",
        cityMasterID: formValues.txtCity ? formValues.txtCity.CityMasterID.toString() : "0",
        pinCode: "",
        areaMasterID: 0,
        isDefault: 0,
        landmark: "",
        latitude: "",
        longitude: "",
        AgeEntryType: ageEntryType ? ageEntryType : "D",
        nationalityID: formValues.txtCountry ? formValues.txtCountry.CountryMasterID.toString() : "0",
      };
      console.log(formData);

      let result = await addPatientInformation(formData);
      console.log(result);
      setSaveBtnLoaderActive(false);

      if (result.responseCode === Success) {
        setMsgAlert({ open: true, type: "success", msg: result.responseMessage });
        if (result.responseData) {
          let newlyAddedPatient = {
            PatientMasterID: result.responseData.PatientMasterID,
            AadharNo: formData.aadharNo,
            AddressLine1: formData.addressLine1,
            AddressLine2: formData.addressLine2,
            CampaignName: formValues.txtCampaign ? formValues.txtCampaign.CampaignName : "",
            CityName: formValues.txtCity ? formValues.txtCity.CityName : "",
            DateofBirth: dateToSpecificFormat(formValues.txtDob, "YYYY-MM-DD") + "T00:00:00",
            Gender: formValues.txtGender ? formValues.txtGender.CommonMasterValue : "",
            PEMailAddress: formData.peMailAddress,
            PMRDNo: result.responseData.PMRDNo,
            PMobileNo: formData.pMobileNo,
            PatientAge:
              formValues.txtYear === 0 || ""
                ? formValues.txtMonth === "0" || 0
                  ? (1 / 12)
                      .toFixed(2)
                      .toString()
                      .replace(/(\.0+|0+)$/, "")
                  : (formValues.txtMonth / 12)
                      .toFixed(2)
                      .toString()
                      .replace(/(\.0+|0+)$/, "")
                : age
                    .toFixed(2)
                    .toString()
                    .replace(/(\.0+|0+)$/, ""),
            PatientName: formData.pFirstName + " " + formData.pLastName,
            ReferedBy: formValues.txtReferBy ? formValues.txtReferBy.PatientReferenceName : "",
            ReferedByName: formValues.txtReferenceName ? formValues.txtReferenceName.ReferenceValueName : "",
            Salesperson: formValues.txtSalePerson ? formValues.txtSalePerson.Employee : "",
            UHIDNo: formData.uhidNo,
            HosMRDNo: result.responseData.HOSMRDNo,
            RegisterDate: dateToSpecificFormat(new Date(), "YYYY-MM-DD"),
            IsNewlyAdded: true,
          };
          props.updatePatients(newlyAddedPatient);
        }
        clearForm();
      } else {
        setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
      }
    } catch (error) {
      Sentry.captureException(error);
      setMsgAlert({ open: true, type: "error", msg: CustomMsg.Error });
    }
  };

  const clearData = () => {
    setFormValues({
      ...formValues,
      txtSalutation: "",
      txtFirstName: "",
      txtLastName: "",
      txtGender: "",
      txtEmail: "",
      txtDob: "",
      txtYear: "",
      txtMonth: "",
      txtAadhar: "",
      txtUhidNo: "",
    });
    setMonthChanged(false);
    setAgeChanged(false);
    setDateChanged(false);
    setCityList([]);
  };

  const clearForm = () => {
    setFormValues({
      txtReferBy: "",
      txtReferenceName: "",
      txtCampaign: "",
      txtSalePerson: "",
      txtCity: "",
      // txtSearchBy: '',
      txtInputValue: "",
      txtSalutation: "",
      txtFirstName: "",
      txtLastName: "",
      txtGender: "",
      txtEmail: "",
      txtDob: "",
      txtYear: "",
      txtMonth: "",
      txtAddress1: "",
      txtAddress2: "",
      txtPatientId: "",
      txtMobileNO: "",
      txtMrdNo: "",
      txtAadhar: "",
      txtUhidNo: "",
      txtCountry: "",
    });
    setMonthChanged(false);
    setAgeChanged(false);
    setDateChanged(false);
    setCityList([]);
    setReferBy([]);
    setReferenceName([]);
    setSearchPersonList([]);
    setDisableFields(true);
  };

  const salutationSelect = useRef();
  const inputSelect = useRef();

  const closeSearchPopup = (data) => {
    setFormValues({
      ...formValues,
      txtInputValue: data,
      txtCountry: { CountryName: "India - IND", CountryMasterID: 1001 },
      txtCity:
        selectedHospital && selectedHospital.CityMasterID && selectedHospital.CityName ? { CityMasterID: selectedHospital.CityMasterID, CityName: selectedHospital.CityName } : "",
    });

    toggleSearchPatientPopup();
    setDisableFields(false);
  };

  useEffect(() => {
    if (inputSelect.current) {
      inputSelect.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!disableFields) {
      if (salutationSelect.current) {
        salutationSelect.current.focus();
      }
    }
  }, [disableFields]);

  const updateMobNumber = () => {
    setDisableFields(false);
    clearForm();
  };

  const SearchByHandleKeyDown = (e) => {
    if (e.keyCode === EnterKeyCode) {
      e.preventDefault();
      onClickGetPatients();
    }
  };

  return (
    <React.Fragment>
      {/* {msgAlert.open && <ErrorMessage msgAlert={msgAlert} setMsgAlert={setMsgAlert} />} */}
      {/* {searchPatientPopup ? (
        <PatientSearchPopup
          toggleSearchPatientPopup={toggleSearchPatientPopup}
          closeSearchPopup={closeSearchPopup}
          selectedPatientDetails={selectedPatientDetails}
          patientList={patientList}
          inputValue={formValues.txtInputValue}
          serachBy={formValues.txtSearchBy}
          setMsgAlert={setMsgAlert}
        />
      ) : null} */}
      <Modal varient={"bottom"} title={"Add New Patient"} show={toggleAddSearchPatientPopup} width={"650px"} right={0} onSubmit={handleSave}>
        <Modal.Body>
          <Form>
            <Form.Group column={2} controlwidth={"1fr"}>
              <Form.CustomGroup column={4}>
                <h2 className={classNames(BizClass.FormHead, BizClass.NonBorder)}>Patient Information</h2>
              </Form.CustomGroup>
              <Form.InputGroup label={fieldPlaceHolder["txtInputValue"] || "Mobile No"} column={3} req={true}>
                <Form.CustomGroup columntemplate={"auto max-content max-content"}>
                  <Form.InputGroup errorMsg={formValidationError["txtInputValue"]}>
                    <Form.InputControl
                      control={"input"}
                      label={"Search With Mobile No"}
                      autoComplete="off"
                      name="txtInputValue"
                      maxLength={fieldMaxLength["txtInputValue"] || 10}
                      disabled={!disableFields ? true : false}
                      value={formValues.txtInputValue}
                      onKeyDown={(e) => SearchByHandleKeyDown(e)}
                      onChange={(e) => updateState(e.target.name, e.target.value.replace(/\D/g, ""))}
                      ref={inputSelect}
                    />
                  </Form.InputGroup>
                  <Form.InputGroup>
                    <PageSearchButton onClick={() => onClickGetPatients()}>
                      {btnLoaderActive ? (
                        <div className="DynBiz_btn__spinner">
                          <div className="DynBiz_btn__bounce1"></div>
                          <div className="DynBiz_btn__bounce2"></div>
                          <div className="DynBiz_btn__bounce3"></div>
                        </div>
                      ) : (
                        <React.Fragment>Search</React.Fragment>
                      )}
                    </PageSearchButton>
                  </Form.InputGroup>
                </Form.CustomGroup>
                <PageButton type="button" onClick={() => updateMobNumber()}>
                  Clear
                </PageButton>
              </Form.InputGroup>
              <Form.InputGroup errorMsg={formValidationError["txtSalutation"]} label={"Name"} req={true} column={3}>
                <Form.CustomGroup columntemplate={"120px repeat(2, auto)"}>
                  <Form.InputGroup errorMsg={""}>
                    <Form.InputControl
                      control={"select"}
                      prefix={false}
                      label={fieldPlaceHolder["txtSalutation"] || "Salutation"}
                      options={salutationdata}
                      isDisabled={disableFields ? true : false}
                      getOptionLabel={(option) => `${option.CommonMasterValue}`}
                      getOptionValue={(option) => `${option}`}
                      isLoading={isLoadingSalutation}
                      name="txtSalutation"
                      value={formValues.txtSalutation}
                      onChange={(e) => updateState("txtSalutation", e)}
                      ref={salutationSelect}
                    />
                  </Form.InputGroup>
                  <Form.InputGroup errorMsg={formValidationError["txtFirstName"]}>
                    <Form.InputControl
                      control={"input"}
                      label={fieldPlaceHolder["txtFirstName"] || "First Name"}
                      disabled={disableFields ? true : false}
                      name="txtFirstName"
                      autoComplete="off"
                      maxLength={fieldMaxLength["txtFirstName"] || 20}
                      value={formValues.txtFirstName}
                      onChange={(e) => updateState("txtFirstName", e.target.value.replace(/[^a-zA-Z ]+/g, ""))}
                    />
                  </Form.InputGroup>
                  <Form.InputGroup errorMsg={formValidationError["txtLastName"]}>
                    <Form.InputControl
                      control={"input"}
                      label={fieldPlaceHolder["txtLastName"] || "Last Name"}
                      disabled={disableFields ? true : false}
                      maxLength={fieldMaxLength["txtLastName"] || 20}
                      name="txtLastName"
                      autoComplete="off"
                      value={formValues.txtLastName}
                      onChange={(e) => updateState("txtLastName", e.target.value.replace(/[^a-zA-Z ]+/g, ""))}
                    />
                  </Form.InputGroup>
                </Form.CustomGroup>
              </Form.InputGroup>
              <Form.InputGroup errorMsg={formValidationError["txtGender"]} label={fieldPlaceHolder["txtGender"] || "Gender"} req={true}>
                <Form.InputControl
                  control={"select"}
                  options={gender}
                  getOptionLabel={(option) => `${option.CommonMasterValue}`}
                  getOptionValue={(option) => `${option}`}
                  isLoading={isLoadingGender}
                  isDisabled={disableFields ? true : false}
                  name="txtGender"
                  value={formValues.txtGender}
                  onChange={(e) => updateState("txtGender", e)}
                />
              </Form.InputGroup>
              <Form.InputGroup errorMsg={formValidationError["txtEmail"]} label={fieldPlaceHolder["txtEmail"] || "Email Address"}>
                <Form.InputControl
                  control={"input"}
                  name="txtEmail"
                  autoComplete="off"
                  disabled={disableFields ? true : false}
                  value={formValues.txtEmail}
                  onChange={(e) => updateState("txtEmail", e.target.value)}
                  maxLength={50}
                />
              </Form.InputGroup>
              <Form.InputGroup errorMsg={formValidationError["txtAadhar"]} label={fieldPlaceHolder["txtAadhar"] || "Aadhar No"}>
                <Form.InputControl
                  control={"input"}
                  name="txtAadhar"
                  disabled={disableFields ? true : false}
                  autoComplete="off"
                  maxLength="12"
                  value={formValues.txtAadhar}
                  onChange={(e) => updateState("txtAadhar", e.target.value.replace(/\D/g, ""))}
                />
              </Form.InputGroup>
              <Form.InputGroup errorMsg={""} label={fieldPlaceHolder["txtUhidNo"] || "UHID No"}>
                <Form.InputControl
                  control={"input"}
                  name="txtUhidNo"
                  disabled={disableFields ? true : false}
                  autoComplete="off"
                  value={formValues.txtUhidNo}
                  onChange={(e) => updateState("txtUhidNo", e.target.value.replace(/\D/g, ""))}
                  maxLength="20"
                />
              </Form.InputGroup>
              <Form.InputGroup label={"Age"}>
                <Form.CustomGroup columntemplate={"auto auto"}>
                  <Form.InputGroup errorMsg={formValidationError["txtYear"]}>
                    <Form.InputControl
                      control={"input"}
                      width={"80px"}
                      name="txtYear"
                      disabled={dateChanged ? true : disableFields ? true : false}
                      value={formValues.txtYear}
                      onChange={(e) => updateState("txtYear", e.target.value)}
                      maxLength="2"
                    />
                    <div className={BizClass.InputGroupTxt}>Y</div>
                  </Form.InputGroup>
                  <Form.InputGroup errorMsg={formValidationError["txtMonth"]}>
                    <Form.InputControl
                      control="maskedinput"
                      format="##.##"
                      mask="_"
                      allowEmptyFormatting
                      name="txtMonth"
                      disabled={dateChanged ? true : disableFields ? true : false}
                      value={formValues.txtMonth}
                      onValueChange={(values, sourceInfo) => {
                        updateState("txtMonth", values.formattedValue, sourceInfo);
                      }}
                    />

                    <div className={BizClass.InputGroupTxt}>M.D</div>
                  </Form.InputGroup>
                </Form.CustomGroup>
              </Form.InputGroup>

              <Form.InputGroup errorMsg={formValidationError["txtDob"]} label="DOB" req={true}>
                <Form.InputControl
                  control="input"
                  type="date"
                  disabled={ageChanged ? true : disableFields ? true : false}
                  name="txtDob"
                  value={formValues.txtDob}
                  onChange={(e) => updateState("txtDob", e.target.value)}
                  max={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD")}
                  min={dateToSpecificFormat(moment().subtract(365 * 100, "days"), "YYYY-MM-DD")}
                />
              </Form.InputGroup>
              <Form.InputGroup errorMsg={""} label={fieldPlaceHolder["txtCountry"] || "Nationality"}>
                <Form.InputControl
                  control={"select"}
                  name="txtCountry"
                  getOptionLabel={(option) => `${option.CountryName}`}
                  value={formValues.txtCountry}
                  getOptionValue={(option) => `${option}`}
                  isDisabled={disableFields ? true : false}
                  options={countryList}
                  isLoading={isLoadingCountry}
                  //inputValue={countrySearch}
                  //onInputChange={(e) => setCountrySearch(e)}
                  //ControlTxt="Country"
                  onChange={(e) => updateState("txtCountry", e)}
                />
              </Form.InputGroup>
            </Form.Group>
            <Form.Group column={2} controlwidth={"auto"}>
              <Form.CustomGroup column={4}>
                <h2 className={BizClass.FormHead}>Address</h2>
              </Form.CustomGroup>
              <Form.InputGroup errorMsg={""} label={fieldPlaceHolder["txtAddress1"] || "Address-1"} column={3}>
                <Form.InputControl
                  control={"input"}
                  name="txtAddress1"
                  disabled={disableFields ? true : false}
                  autoComplete="off"
                  value={formValues.txtAddress1}
                  onChange={(e) => updateState("txtAddress1", e.target.value)}
                  maxLength="100"
                />
              </Form.InputGroup>
              <Form.InputGroup errorMsg={""} label={fieldPlaceHolder["txtAddress2"] || "Address-2"} column={3}>
                <Form.InputControl
                  control={"input"}
                  name="txtAddress2"
                  disabled={disableFields ? true : false}
                  autoComplete="off"
                  value={formValues.txtAddress2}
                  onChange={(e) => updateState("txtAddress2", e.target.value)}
                  maxLength="100"
                />
              </Form.InputGroup>
              <Form.InputGroup errorMsg={""} label={fieldPlaceHolder["txtCity"] || "City"}>
                <Form.InputControl
                  control={"select"}
                  name="txtCity"
                  getOptionLabel={(option) => `${option.CityName}`}
                  value={formValues.txtCity}
                  getOptionValue={(option) => `${option}`}
                  options={cityList}
                  isDisabled={disableFields ? true : false}
                  isLoading={isLoadingCity}
                  inputValue={citySearch}
                  onInputChange={(e) => setCitySearch(e)}
                  ControlTxt="City"
                  onChange={(e) => updateState("txtCity", e)}
                />
              </Form.InputGroup>
            </Form.Group>
            <Form.Group column={2} controlwidth={"auto"}>
              <Form.CustomGroup column={4}>
                <h2 className={BizClass.FormHead}>Reference Details</h2>
              </Form.CustomGroup>
              <Form.InputGroup errorMsg={""} label={fieldPlaceHolder["txtReferBy"] || "Refered By"}>
                <Form.InputControl
                  control={"select"}
                  name="txtReferBy"
                  getOptionLabel={(option) => `${option.PatientReferenceName}`}
                  getOptionValue={(option) => `${option}`}
                  options={referBy}
                  isDisabled={disableFields ? true : false}
                  isLoading={isLoadingReferBy}
                  inputValue={referedByValue}
                  onInputChange={(e) => setReferedByValue(e)}
                  value={formValues.txtReferBy}
                  onChange={(e) => updateState("txtReferBy", e)}
                />
              </Form.InputGroup>
              <Form.InputGroup errorMsg={""} label={fieldPlaceHolder["txtReferenceName"] || "Reference Name"}>
                <Form.InputControl
                  control={"select"}
                  name="txtReferenceName"
                  getOptionLabel={(option) => `${option.ReferenceValueName}`}
                  getOptionValue={(option) => `${option}`}
                  options={referenceName}
                  isDisabled={disableFields ? true : false}
                  isLoading={isLoadingReferenceName}
                  inputValue={referenceNameValue}
                  onInputChange={(e) => setReferenceNameValue(e)}
                  value={formValues.txtReferenceName}
                  onChange={(e) => updateState("txtReferenceName", e)}
                />
              </Form.InputGroup>
              <Form.InputGroup errorMsg={""} label={fieldPlaceHolder["txtCampaign"] || "Campaign Name"}>
                <Form.InputControl
                  control={"select"}
                  name="txtCampaign"
                  getOptionLabel={(option) => `${option.CampaignName}`}
                  getOptionValue={(option) => `${option}`}
                  options={campaignData}
                  isLoading={isLoadingCampaign}
                  isDisabled={disableFields ? true : false}
                  value={formValues.txtCampaign}
                  onChange={(e) => updateState("txtCampaign", e)}
                />
              </Form.InputGroup>
              <Form.InputGroup errorMsg={""} label={fieldPlaceHolder["txtSalePerson"] || "Sale Person"}>
                <Form.InputControl
                  control={"select"}
                  name="txtSalePerson"
                  getOptionLabel={(option) => `${option.Employee}`}
                  value={formValues.txtSalePerson}
                  getOptionValue={(option) => `${option}`}
                  options={searchPersonList}
                  isLoading={isLoadingSearchPerson}
                  isDisabled={disableFields ? true : false}
                  inputValue={salePersonSearch}
                  onInputChange={(e) => setSalePersonSearch(e)}
                  ControlTxt="Sale Person"
                  onChange={(e) => updateState("txtSalePerson", e)}
                />
              </Form.InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {!disableFields ? (
            <Button varient={"secondary"} trigger={saveBtnLoaderActive}>
              Save
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default AddPatient;

// const PatientSearchPopup = (props) => {
//   let setMsgAlert = props.setMsgAlert;
//   let patientsList = props.patientList;
//   let inputValue = props.inputValue;
//   let serachBy = props.serachBy;
//   const firstTextInput = useRef();

//   const [formValues, setFormValues] = useState({
//     txtInputValue: "",
//   });

//   useEffect(() => {
//     if (inputValue) {
//       setFormValues({
//         txtInputValue: inputValue,
//       });
//     }
//   }, [inputValue]);

//   useEffect(() => {
//     if (firstTextInput.current) {
//       firstTextInput.current.focus();
//     }
//   }, []);

//   const [isLoadingPatientList, setIsLoadingPatientList] = useState(false);
//   const [patientList, setPatientList] = useState([]);
//   const getPatientsList = async (searchType) => {
//     try {
//       setIsLoadingPatientList(true);
//       let result = await getPatientList(searchType, formValues.txtInputValue ? formValues.txtInputValue.toString() : "");
//       setIsLoadingPatientList(false);
//       console.log(result);
//       if (result.responseCode === Success) {
//         if (result.responseData && result.responseData.GetPatientList) {
//           if (result.responseData.GetPatientList.length > 0) {
//             setPatientList(result.responseData.GetPatientList);
//           } else {
//             setPatientList([]);
//           }
//         } else {
//           setPatientList([]);
//         }
//       } else {
//         setPatientList([]);
//         setMsgAlert({ open: true, type: "error", msg: result.responseMessage });
//       }
//     } catch (error) {
//       Sentry.captureException(error);
//       setMsgAlert({ open: true, type: "error", msg: CustomMsg.Error });
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (patientsList) {
//       setPatientList(patientsList);
//     }
//   }, [patientsList]);

//   const onClickGetPatients = () => {
//     if (formValues.txtInputValue) {
//       getPatientsList("MobileNo");
//     } else {
//       setMsgAlert({
//         open: true,
//         type: "warning",
//         msg: "Please Enter MobileNo",
//       });
//     }
//   };

//   const updateState = (name, value) => {
//     setFormValues({ ...formValues, [name]: value });
//     if (name === "txtInputValue") {
//       console.log(value);
//     }
//   };

//   const addNewPatient = () => {
//     props.closeSearchPopup(formValues.txtInputValue);
//   };

//   const SearchByHandleKeyDown = (e) => {
//     if (e.keyCode === EnterKeyCode) {
//       e.preventDefault();
//       onClickGetPatients();
//     }
//   };

//   return (
//     <React.Fragment>
//       <Modal varient={"center"} show={props.toggleSearchPatientPopup} className={BizClass.SearchPopup} onlymodal={true} height={"400px"} width={"600px"} index={2}>
//         <Modal.Body>
//           <div className={BizClass.SearchPopupBox}>
//             <div className={BizClass.SearchPopupHeader}>
//               {/* <select id="mySelect" onChange={() => getOptionValue()}> */}
//               <select>
//                 <option value="MobileNo">Mobile No</option>
//                 {/* <option value="MRD">MRD</option> */}
//               </select>
//               <div className={BizClass.SearchInBoxPopup}>
//                 <BiSearch />
//                 <input
//                   placeholder="Search Patient With Mobile Number"
//                   onKeyDown={(e) => SearchByHandleKeyDown(e)}
//                   ref={firstTextInput}
//                   name="txtInputValue"
//                   value={formValues.txtInputValue}
//                   onChange={(e) => updateState(e.target.name, e.target.value)}
//                 />
//               </div>
//               <Button type={"button"} onClick={() => onClickGetPatients()}>
//                 Search
//               </Button>
//             </div>

//             <div className={BizClass.SearchBoxPopupBody}>
//               <div className={BizClass.SearchBoxAddPopupList} onClick={() => addNewPatient()}>
//                 <h2>Add New Patient</h2>
//               </div>
//               {isLoadingPatientList ? <Loader /> : null}
//               {patientList && patientList.length > 0
//                 ? patientList.map((data, i) => {
//                     return (
//                       <div className={BizClass.SearchBoxPopupList} key={i}>
//                         <div className={BizClass.SearchBoxPopupUserIcon}>
//                           <AiOutlineUser />
//                         </div>

//                         <div className={BizClass.SearchBoxPopupSubList}>
//                           <h2>
//                             {data.PFirstName ? data.PFirstName : ""} {data.PLastName ? data.PLastName : ""}
//                           </h2>
//                           <div>
//                             <p>Gender</p>
//                             <span>{data.Gender ? data.Gender : ""}</span>
//                           </div>
//                         </div>
//                         <div className={BizClass.SearchBoxPopupSubList}>
//                           <div>
//                             <p>{data.PMRDNo ? "Mrd No" : "Mobile No"}</p>
//                             <span>{data.PMRDNo ? data.PMRDNo : data.PMobileNo}</span>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })
//                 : null}

//               {/* <div className={BizClass.SearchBoxAddPopupList} onClick={() => addNewPatient()}>
//                                 <h2>Add New Patient</h2>
//                             </div> */}
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer />
//       </Modal>
//     </React.Fragment>
//   );
// };
