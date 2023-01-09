import { useEffect, useState } from "react";
import APIEndpoints from "APIMethods/APIEndpoints/APIEndpoints";
import { getSessionStorage } from "APIMethods/Auth/auth";
import { dateToCompanyFormat, dateToSpecificFormat } from "Configration/Utilities/dateFormat";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import * as Constant from "../Constant";
import moment from "moment";
import getOPDBillingApiData from "../CommonFunction";

function CreateReceiptLogic() {
  const loggedInUserDetail = getSessionStorage("user");
  const currentDate = dateToCompanyFormat(moment());
  const controlCurrentDate = dateToSpecificFormat(moment(), "YYYY-MM-DD");
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(0);
  const setAlertMessage = AlertMessage();

  const [formValidationError, setFormValidationError] = useState({});
  const validationFieldNames = ["txtRecieptAmount", "txtCardType", "txtCardNo", "txtNameOnCard", "txtBankName", "txtChequeDDNo", "txtChequeDDDate", "txtUTRCode"];

  const emptyArrayReceiptFormValues = {
    txtReceiptDate: currentDate,
    txtHospitalMasterID: "0",
    txtAccountingBranchID: "0",
    txtHosBusinessUnitID: "0",
    txtPatientMasterID: "0",
    txtPatientVisitID: "0",
    txtPayableAmount: "0.00",
    txtPaidAmount: "0.00",
    txtBalanceAmount: "0.00",
    txtPaymentRemark: "",
    recieptPaymentFields: {
      txtRecieptMode: "",
      txtRecieptAmount: "",
      txtCardType: "",
      txtCardNo: "",
      txtNameOnCard: "",
      txtBankName: "",
      txtChequeDDNo: "",
      txtChequeDDDate: controlCurrentDate,
      txtUTRCode: "",
    },
  };

  const emptyArrayOptionReceiptFormValues = {
    txtBankName: [],
    txtCardType: [],
    eReceipt: [],
  };

  const emptyArrayLoadingReceiptFormValues = {
    txtBankName: false,
    txtCardType: false,
  };

  const [optionReceiptFormValues, setOptionReceiptFormValues] = useState(emptyArrayOptionReceiptFormValues);
  const [loadingReceiptFormValues, setLoadingReceiptFormValues] = useState(emptyArrayLoadingReceiptFormValues);
  const [selectedReceiptFormValues, setSelectedReceiptFormValues] = useState(emptyArrayReceiptFormValues);
  const [addedPaymentTransaction, setAddedPaymentTransaction] = useState([]);

  const paymentMethodSelectValidation = (selectedValue) => {
    debugger;
    if (addedPaymentTransaction && addedPaymentTransaction.length > 0) {
      let selectedPaymentMethod = addedPaymentTransaction.some((x) => x.txtRecieptMode.ID == selectedValue.ID);

      if (selectedPaymentMethod === true) {
        return false;
      }
    }
    return true;
  };

  const updatePaymentMethod = (selectedValue) => {
    debugger;
    if (paymentMethodSelectValidation(selectedValue) === false) {
      if (selectedPaymentMethod === selectedValue) {
        setSelectedPaymentMethod(0);
      }
      return;
    }

    if (selectedPaymentMethod === selectedValue) {
      setSelectedPaymentMethod(0);
      return;
    }

    let arrayPaymentTransaction = selectedReceiptFormValues.recieptPaymentFields;
    arrayPaymentTransaction = emptyArrayReceiptFormValues.recieptPaymentFields;

    setSelectedReceiptFormValues((values) => ({
      ...values,
      recieptPaymentFields: arrayPaymentTransaction,
    }));

    setSelectedPaymentMethod(selectedValue);
  };

  const validatePaymentMethodField = (name, value) => {
    debugger;
    let errorsMsg = "";

    if (name === "txtRecieptAmount") {
      if (!value || typeof value === "undefined" || value === null) {
        errorsMsg = "Amount Cannot Be Empty";
      }
    }

    if (selectedPaymentMethod.ID === Constant.CHEQUE_PAYMENT) {
      if (name === "txtBankName" || name === "txtChequeDDNo" || name === "txtChequeDDDate") {
        if (!value || typeof value === "undefined" || value === null) {
          errorsMsg = "Cannot Be Empty";
        }
      }
    }

    if (selectedPaymentMethod.ID === Constant.CREDIT_DEBIT_CARD_PAYMENT) {
      if (name === "txtCardType" || name === "txtCardNo" || name === "txtNameOnCard" || name === "txtUTRCode") {
        if (!value || typeof value === "undefined" || value === null) {
          errorsMsg = "Cannot Be Empty";
        }
      }
    }

    if (selectedPaymentMethod.ID === Constant.NEFT_RTGS_PAYMENT) {
      if (name === "txtBankName" || name === "txtUTRCode") {
        if (!value || typeof value === "undefined" || value === null) {
          errorsMsg = "Cannot Be Empty";
        }
      }
    }

    if (selectedPaymentMethod.ID === Constant.UPI_PAYMENT) {
      if (name === "txtUTRCode") {
        if (!value || typeof value === "undefined" || value === null) {
          errorsMsg = "Cannot Be Empty";
        }
      }
    }

    return errorsMsg;
  };

  const closeCreateReceiptModal = (modalCloseFunction) => {
    modalCloseFunction(false);
  };

  const paymentMethodFormValidation = (name, value, arrayPaymentTransaction) => {
    debugger;
    if ((name === "txtCardNo" || name === "txtChequeDDNo") && value) {
      if (value > 0) {
        formValidationError[name] = validatePaymentMethodField(name, value);
        arrayPaymentTransaction[name] = value.replace(/\D/g, "");
      }
      return;
    }

    if (name === "txtRecieptAmount" && value) {
      let balanceAmount = Number(selectedReceiptFormValues.txtBalanceAmount);
      let valueAmount = Number(value);

      if (value > 0 && valueAmount <= balanceAmount) {
        formValidationError[name] = validatePaymentMethodField(name, value);
        arrayPaymentTransaction["txtRecieptAmount"] = value.replace(/\D/g, "");
      }

      return;
    }

    return true;
  };

  const updateSelectedReceiptFormState = (name, value, direct) => {
    debugger;
    let arrayPaymentTransaction = selectedReceiptFormValues.recieptPaymentFields;

    if (direct === true) {
      setSelectedReceiptFormValues((values) => ({
        ...values,
        [name]: value,
      }));

      formValidationError[name] = validatePaymentMethodField(name, value);
      return;
    }

    if (paymentMethodFormValidation(name, value, arrayPaymentTransaction) === true) {
      formValidationError[name] = validatePaymentMethodField(name, value);
      arrayPaymentTransaction[name] = value;
    }

    setSelectedReceiptFormValues((values) => ({
      ...values,
      recieptPaymentFields: arrayPaymentTransaction,
    }));
  };

  const receiptTotalCalculation = () => {
    let receiptPaidAmount =
      addedPaymentTransaction.length > 0
        ? addedPaymentTransaction.reduce((partialSum, payment) => partialSum + (payment.txtRecieptAmount ? Number(payment.txtRecieptAmount) : 0), 0)
        : 0;
    let receiptPayableAmount = selectedReceiptFormValues && selectedReceiptFormValues.txtPayableAmount ? Number(selectedReceiptFormValues.txtPayableAmount) : 0;
    let receiptBalanceAmount = receiptPayableAmount - receiptPaidAmount;
    let arrayPaymentTransaction = selectedReceiptFormValues.recieptPaymentFields;
    arrayPaymentTransaction["txtRecieptAmount"] = receiptBalanceAmount;
    formValidationError["txtRecieptAmount"] = validatePaymentMethodField("txtRecieptAmount", receiptBalanceAmount);

    setSelectedReceiptFormValues((values) => ({
      ...values,
      txtPaidAmount: receiptPaidAmount.toFixed(2),
      txtBalanceAmount: receiptBalanceAmount.toFixed(2),
      recieptPaymentFields: arrayPaymentTransaction,
    }));
  };

  const updateOptionReceiptFormState = (name, value) => {
    debugger;
    setOptionReceiptFormValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const updateLoadingReceiptFormState = (name, value) => {
    debugger;
    setLoadingReceiptFormValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const addNewPaymentTransactionValidation = () => {
    debugger;
    let formIsValid = true;
    let errors = {};

    validationFieldNames &&
      validationFieldNames.map((data) => {
        return (errors[data] = validatePaymentMethodField(data, selectedReceiptFormValues.recieptPaymentFields[data]));
      });

    if (errors && Object.values(errors).join("").toString()) {
      formIsValid = false;
    }

    setFormValidationError(errors);
    return formIsValid;
  };

  const addNewPaymentTransaction = () => {
    debugger;

    if (addNewPaymentTransactionValidation() === false) {
      return;
    }

    let arrayRecieptPaymentFields = selectedReceiptFormValues && selectedReceiptFormValues.recieptPaymentFields ? selectedReceiptFormValues.recieptPaymentFields : "";
    let arrayPaymentTransaction = [...addedPaymentTransaction];

    if (arrayRecieptPaymentFields) {
      arrayPaymentTransaction.push({
        txtRecieptMode: selectedPaymentMethod ? selectedPaymentMethod : "",
        txtRecieptAmount: arrayRecieptPaymentFields.txtRecieptAmount ? Number(arrayRecieptPaymentFields.txtRecieptAmount).toFixed(2) : "",
        txtCardType: arrayRecieptPaymentFields.txtCardType ? arrayRecieptPaymentFields.txtCardType : "",
        txtCardNo: arrayRecieptPaymentFields.txtCardNo ? arrayRecieptPaymentFields.txtCardNo : "",
        txtNameOnCard: arrayRecieptPaymentFields.txtNameOnCard ? arrayRecieptPaymentFields.txtNameOnCard : "",
        txtBankName: arrayRecieptPaymentFields.txtBankName ? arrayRecieptPaymentFields.txtBankName : "",
        txtChequeDDNo: arrayRecieptPaymentFields.txtChequeDDNo ? arrayRecieptPaymentFields.txtChequeDDNo : "",
        txtChequeDDDate: arrayRecieptPaymentFields.txtChequeDDDate ? dateToCompanyFormat(arrayRecieptPaymentFields.txtChequeDDDate) : "",
        txtUTRCode: arrayRecieptPaymentFields.txtUTRCode ? arrayRecieptPaymentFields.txtUTRCode : "",
      });

      setAddedPaymentTransaction(arrayPaymentTransaction);
    }
  };

  const removeNewPaymentTransaction = (data, index) => {
    debugger;
    let arrayAddedPaymentTransaction = addedPaymentTransaction;
    arrayAddedPaymentTransaction.splice(index, 1);

    paymentMethodSelectValidation(data);
    receiptTotalCalculation();
    setAddedPaymentTransaction(arrayAddedPaymentTransaction);
  };

  const clearOnNewPaymentTransaction = () => {
    let arrayPaymentTransaction = emptyArrayReceiptFormValues.recieptPaymentFields;

    setSelectedReceiptFormValues((values) => ({
      ...values,
      recieptPaymentFields: arrayPaymentTransaction,
    }));

    setSelectedPaymentMethod(0);
  };

  const getAddedPaymentTransaction = () => {
    debugger;
    let arrayAddedPaymentTransaction = [];
    addedPaymentTransaction.forEach((value) => {
      if (value && value.txtRecieptMode) {
        let transaction = {
          receiptModeID: value.txtRecieptMode ? value.txtRecieptMode.ID : 0,
          receiptDate: selectedReceiptFormValues && selectedReceiptFormValues.txtReceiptDate ? selectedReceiptFormValues.txtReceiptDate : "",
          receiptAmount: value.txtRecieptAmount ? Number(value.txtRecieptAmount) : 0,
          cardTypeID: value.txtCardType ? value.txtCardType.BMCGCode : 0,
          cardNo: value.txtCardNo ? value.txtCardNo : "",
          nameOnCard: value.txtNameOnCard ? value.txtNameOnCard : "",
          bankMasterName: value.txtBankName ? value.txtBankName.BankMasterName : "",
          chequeDDNo: value.txtChequeDDNo ? value.txtChequeDDNo : "",
          chequeDDDate: value.txtChequeDDDate ? value.txtChequeDDDate : "",
          eReceiptID: 0,
          utrCode: value.txtUTRCode ? value.txtUTRCode : "",
          paymentRemarks: selectedReceiptFormValues && selectedReceiptFormValues.txtPaymentRemark ? selectedReceiptFormValues.txtPaymentRemark : "",
        };
        arrayAddedPaymentTransaction.push(transaction);
      }
    });
    return arrayAddedPaymentTransaction;
  };

  /* ************************************* Code of Receipt Form Api Calling Start ***************************** */

  const getCardTypeList = () => {
    debugger;
    const formData = {
      main: {
        filterID: "140",
        filterID1: "0",
        masterName: "COMMVAL",
        searchText: "#all",
        searchCriteria: "AW",
      },
    };

    const request = {
      setDatalist: updateOptionReceiptFormState,
      setLoad: updateLoadingReceiptFormState,
      requestData: formData,
      apiPath: APIEndpoints.OPDBilling.getCardTypeList,
      setAlert: setAlertMessage,
      name: "txtCardType",
      fun: null,
    };

    getOPDBillingApiData(request);
  };

  const getBankMasterList = () => {
    debugger;
    const formData = {
      main: {
        filterID: "140",
        filterID1: "0",
        masterName: "COMMVAL",
        searchText: "#all",
        searchCriteria: "AW",
      },
    };

    const request = {
      setDatalist: updateOptionReceiptFormState,
      setLoad: updateLoadingReceiptFormState,
      requestData: formData,
      apiPath: APIEndpoints.OPDBilling.getBankMasterList,
      setAlert: setAlertMessage,
      name: "txtBankName",
      fun: null,
    };

    getOPDBillingApiData(request);
  };

  const saveSaleReceipt = (CIL) => {
    debugger;

    if (!paymentMethodFormValidation()) {
      return;
    }

    if (addedPaymentTransaction && addedPaymentTransaction.length > 0) {
      let addedPaymentTransaction = getAddedPaymentTransaction();

      const formData = {
        main: {
          hospitalMasterID: selectedReceiptFormValues && selectedReceiptFormValues.txtHospitalMasterID ? selectedReceiptFormValues.txtHospitalMasterID : 0,
          accountingBranchID: 1,
          hosBusinessUnitID: 2,
          HIMSBusinessUnitID: Constant && Constant.OPD_BUSINESS_UNIT_ID ? Constant.OPD_BUSINESS_UNIT_ID : 0,
          patientMasterID: selectedReceiptFormValues && selectedReceiptFormValues.txtPatientMasterID ? selectedReceiptFormValues.txtPatientMasterID : 0,
          patientVisitID: selectedReceiptFormValues && selectedReceiptFormValues.txtPatientVisitID ? selectedReceiptFormValues.txtPatientVisitID : 0,
          receipt: addedPaymentTransaction ? addedPaymentTransaction : [],
        },
      };

      console.log(formData, "Save Request JSon");

      const request = {
        setDatalist: updateOptionReceiptFormState,
        setLoad: updateLoadingReceiptFormState,
        requestData: formData,
        apiPath: APIEndpoints.OPDBilling.saveSaleReceipt,
        setAlert: setAlertMessage,
        name: "eReceipt",
        fun: afterSaveSaleReceipt,
        message: true,
        direct: true,
        other: CIL,
      };

      getOPDBillingApiData(request);
    }
  };

  const afterSaveSaleReceipt = (name, responseValue, CIL) => {
    CIL.toggleCreateReceiptModal(false);

    setOptionReceiptFormValues(emptyArrayOptionReceiptFormValues);
    setLoadingReceiptFormValues(emptyArrayLoadingReceiptFormValues);

    let arrayPaymentTransaction = emptyArrayReceiptFormValues.recieptPaymentFields;

    setSelectedReceiptFormValues((values) => ({
      ...values,
      recieptPaymentFields: arrayPaymentTransaction,
    }));

    CIL.updateSavedReceiptData(responseValue);
  };

  /* ************************************* Code of Receipt Form Api Calling End ***************************** */

  useEffect(() => {
    if (selectedUserData) {
      setSelectedReceiptFormValues((values) => ({
        ...values,
        txtPatientMasterID: selectedUserData && selectedUserData.PatientMasterID ? selectedUserData.PatientMasterID : 0,
        txtPatientVisitID: selectedUserData && selectedUserData.PatientVisitID ? selectedUserData.PatientVisitID : 0,
      }));
    }

    if (selectedData) {
      setSelectedReceiptFormValues((values) => ({
        ...values,
        txtHospitalMasterID: selectedData && selectedData.hospitalID ? selectedData.hospitalID : 0,
      }));
    }
  }, [selectedUserData, selectedData]);

  useEffect(() => {
    console.log(selectedReceiptFormValues);
  }, [selectedReceiptFormValues]);

  useEffect(() => {
    debugger;
    if (selectedPaymentMethod.ID > 0) {
      if (optionReceiptFormValues["txtBankName"].length === 0) {
        getBankMasterList();
      }
      if (optionReceiptFormValues["txtCardType"].length === 0) {
        getCardTypeList();
      }
      receiptTotalCalculation();
    }
    console.log(selectedPaymentMethod);
  }, [selectedPaymentMethod]);

  useEffect(() => {
    debugger;
    if (addedPaymentTransaction.length > 0) {
      receiptTotalCalculation();
      clearOnNewPaymentTransaction();
    }
    console.log(addedPaymentTransaction);
  }, [addedPaymentTransaction]);

  /* ************************************* Array of States to be Returned Start ***************************** */

  const returnArray = {
    selectedUserData,
    setSelectedUserData,
    selectedData,
    setSelectedData,
    selectedReceiptFormValues,
    setSelectedReceiptFormValues,
    selectedPaymentMethod,
    updatePaymentMethod,
    closeCreateReceiptModal,
    loadingReceiptFormValues,
    optionReceiptFormValues,
    updateSelectedReceiptFormState,
    receiptTotalCalculation,
    addedPaymentTransaction,
    addNewPaymentTransaction,
    clearOnNewPaymentTransaction,
    paymentMethodSelectValidation,
    removeNewPaymentTransaction,
    formValidationError,
    saveSaleReceipt,
  };

  /* ************************************* Array of States to be Returned End ******************************* */

  return { ...returnArray };
}

export default CreateReceiptLogic;
