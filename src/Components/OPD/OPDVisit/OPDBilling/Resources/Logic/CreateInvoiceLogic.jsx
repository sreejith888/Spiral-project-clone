import APIEndpoints from "APIMethods/APIEndpoints/APIEndpoints";
import { getSessionStorage } from "APIMethods/Auth/auth";
import { dateToCompanyFormat } from "Configration/Utilities/dateFormat";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import moment from "moment";
import { useRef } from "react";
import { useState, useEffect } from "react";
import getOPDBillingApiData from "../CommonFunction";
import * as Constant from "../Constant";

function CreateInvoiceLogic() {
  const loggedInUserDetail = getSessionStorage("user");
  const currentDate = dateToCompanyFormat(moment());
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [savedReceiptData, setSavedReceiptData] = useState({});
  const [openCreateReceiptModal, setOpenCreateReceiptModal] = useState(false);
  const setAlertMessage = AlertMessage();
  const firstTextInput = useRef();

  const [modalWidth, setModalWidth] = useState("");
  const [formValidationError, setFormValidationError] = useState({});
  const validationFieldNames = ["txtItem", "txtQuantity", "txtRate"];

  const emptyArrayItemsAndService = {
    txtInvoiceDate: currentDate,
    addedItemsAndServices: {
      txtItem: "",
      txtDescription: "",
      txtQuantity: "",
      txtRate: "",
      txtAmount: "0.00",
      txtDiscountType: "",
      txtDiscountValue: "",
      txtTotalDiscountValue: "",
      txtTotalAmount: "0.00",
    },
    txtInvoiceSubTotalAmount: "0.00",
    txtInvoiceTotalDiscount: "0.00",
    txtInvoiceTotalAmount: "0.00",
    txtInvoiceTotalPaidAmount: "0.00",
  };

  const emptyArrayOptionItemsAndService = {
    txtItem: [],
    txtDiscountType: [
      { label: "%", value: "%", Vlabel: " %" },
      { label: "V", value: "V", Vlabel: "" },
    ],
    eInvoice: {},
  };

  const emptyArrayLoadingItemsAndService = {
    txtItem: false,
    eInvoice: false,
  };

  const [optionInvoiceFormValues, setOptionInvoiceFormValues] = useState(emptyArrayOptionItemsAndService);
  const [loadingInvoiceFormValues, setLoadingInvoiceFormValues] = useState(emptyArrayLoadingItemsAndService);
  const [selectedInvoiceFormValues, setSelectedInvoiceFormValues] = useState(emptyArrayItemsAndService);
  const [addedInvoiceItemsAndServices, setAddedInvoiceItemsAndServices] = useState([]);

  /* ************************************* Code of Invoice Form Functions Start ***************************** */

  const authenticateSelectedRowIndex = (index) => {
    debugger;
    if (index === selectedInvoiceFormValues.addedItemsAndServices.length - 1) {
      return true;
    }
    return false;
  };

  const authenticateCreatedReceipt = () => {
    debugger;
    if (Object.values(savedReceiptData).length > 0) {
      return false;
    }

    return true;
  };

  const updateOptionInvoiceFormState = (name, value) => {
    debugger;
    setOptionInvoiceFormValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const updateLoadingInvoiceFormState = (name, value) => {
    debugger;
    setLoadingInvoiceFormValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const updateSavedReceiptData = (value) => {
    debugger;
    setSavedReceiptData(value);
  };

  const invoiceFormValidation = (name, value, arrayItemsAndService) => {
    debugger;

    if (name === "txtItem" && value) {
      formValidationError[name] = validateItemField(name, value);
      arrayItemsAndService[name] = value;
      arrayItemsAndService["txtDescription"] = value && value.ItemDescription ? value.ItemDescription : "";
      return;
    } else if (name === "txtItem" && !value) {
      formValidationError[name] = validateItemField(name, value);
      arrayItemsAndService[name] = value;
      arrayItemsAndService["txtDescription"] = "";
      return;
    }

    if ((name === "txtQuantity" || name === "txtRate") && value) {
      if (value > 0) {
        formValidationError[name] = validateItemField(name, value);
        arrayItemsAndService[name] = value.replace(/\D/g, "");
      }
      return;
    }

    if (name === "txtDiscountValue" && value) {
      let discountType = arrayItemsAndService["txtDiscountType"] && arrayItemsAndService["txtDiscountType"].value;
      let amount = arrayItemsAndService["txtAmount"];

      if (discountType && discountType.length > 0 && amount && Number(amount) > 0) {
        if (discountType === "%" && value && Number(value) <= 100) {
          arrayItemsAndService[name] = value.replace(/\D/g, "");
        }

        if (discountType === "V" && value && Number(value) <= amount) {
          arrayItemsAndService[name] = value.replace(/\D/g, "");
        }
      }

      return;
    }

    if (name === "txtDiscountType" && value) {
      arrayItemsAndService[name] = value;
      arrayItemsAndService["txtDiscountValue"] = "";

      return;
    }

    return true;
  };

  const itemRowCalculation = (arrayItemsAndService) => {
    debugger;
    if (arrayItemsAndService) {
      let quantity = arrayItemsAndService["txtQuantity"] ? Number(arrayItemsAndService["txtQuantity"]) : 0;
      let rate = arrayItemsAndService["txtRate"] ? Number(arrayItemsAndService["txtRate"]) : 0;
      let discountType = arrayItemsAndService["txtDiscountType"] && arrayItemsAndService["txtDiscountType"].value;
      let discountValue = arrayItemsAndService["txtDiscountValue"] ? Number(arrayItemsAndService["txtDiscountValue"]) : 0;
      let discountAmount = 0;

      let amount = quantity * rate;

      if (discountType === "%" && discountValue > 0) {
        discountAmount = (discountValue / 100) * amount;
      }

      if (discountType === "V") {
        discountAmount = discountValue;
      }

      let totalAmount = quantity * rate - discountAmount;

      arrayItemsAndService["txtTotalDiscountValue"] = discountAmount;
      arrayItemsAndService["txtAmount"] = amount.toFixed(2);
      arrayItemsAndService["txtTotalAmount"] = totalAmount.toFixed(2);
    }
  };

  const invoiceTotalCalculation = (arrayItemsAndService) => {
    debugger;
    if (arrayItemsAndService && arrayItemsAndService.length > 0) {
      const invoiceSubTotalAmount = arrayItemsAndService.reduce((partialSum, item) => partialSum + (item.txtAmount ? Number(item.txtAmount) : 0), 0);
      const invoiceTotalDiscount = arrayItemsAndService.reduce((partialSum, item) => partialSum + (item.txtTotalDiscountValue ? Number(item.txtTotalDiscountValue) : 0), 0);
      const invoiceTotalAmount = arrayItemsAndService.reduce((partialSum, item) => partialSum + (item.txtTotalAmount ? Number(item.txtTotalAmount) : 0), 0);

      setSelectedInvoiceFormValues((values) => ({
        ...values,
        txtInvoiceSubTotalAmount: invoiceSubTotalAmount.toFixed(2),
        txtInvoiceTotalDiscount: invoiceTotalDiscount.toFixed(2),
        txtInvoiceTotalAmount: invoiceTotalAmount.toFixed(2),
      }));
    }
  };

  const validateItemField = (name, value) => {
    debugger;
    let errorsMsg = "";

    if (name === "txtItem") {
      if (!value || typeof value === "undefined" || value === null) {
        errorsMsg = "true";
      }
    }

    if (name === "txtQuantity") {
      if (!value || typeof value === "undefined" || value === null) {
        errorsMsg = "true";
      }
    }

    if (name === "txtRate") {
      if (!value || typeof value === "undefined" || value === null) {
        errorsMsg = "true";
      }
    }

    return errorsMsg;
  };

  const addNewItemRowValidation = () => {
    debugger;
    let arrayItemsAndService = selectedInvoiceFormValues.addedItemsAndServices;
    let formIsValid = true;
    let errors = {};

    validationFieldNames &&
      validationFieldNames.map((data) => {
        return (errors[data] = validateItemField(data, arrayItemsAndService[data]));
      });

    if (errors && Object.values(errors).join("").toString()) {
      formIsValid = false;
    }

    setFormValidationError(errors);
    return formIsValid;
  };

  const updateSelectedInvoiceFormState = (name, value) => {
    debugger;
    let arrayItemsAndService = selectedInvoiceFormValues.addedItemsAndServices;
    if (arrayItemsAndService) {
      if (invoiceFormValidation(name, value, arrayItemsAndService) === true) {
        formValidationError[name] = validateItemField(name, value);
        arrayItemsAndService[name] = value;
      }

      setSelectedInvoiceFormValues((values) => ({
        ...values,
        addedItemsAndServices: arrayItemsAndService,
      }));

      itemRowCalculation(arrayItemsAndService);
      invoiceTotalCalculation(arrayItemsAndService);
    }
  };

  const addRemoveItemAndService = (index, ViewMode) => {
    debugger;
    let formItemsAndService = selectedInvoiceFormValues.addedItemsAndServices;
    let arrayItemsAndService = [...addedInvoiceItemsAndServices];
    let arrayFormItemsAndService = emptyArrayItemsAndService.addedItemsAndServices;

    if (authenticateCreatedReceipt() === false) {
      return;
    }

    if (ViewMode === Constant.ADD_NEW_ITEM_ROW) {
      if (!addNewItemRowValidation()) {
        return;
      }

      if (formItemsAndService && authenticateCreatedReceipt() === true) {
        let formValuesItemsAndServices = formItemsAndService ? formItemsAndService : "";
        let txtDiscountValue = formValuesItemsAndServices.txtDiscountValue ? formValuesItemsAndServices.txtDiscountValue : "0.00";
        arrayItemsAndService.push({
          txtItem: formValuesItemsAndServices.txtItem ? formValuesItemsAndServices.txtItem : "",
          txtDescription: formValuesItemsAndServices.txtDescription ? formValuesItemsAndServices.txtDescription : "",
          txtQuantity: formValuesItemsAndServices.txtQuantity ? formValuesItemsAndServices.txtQuantity : "0",
          txtRate: formValuesItemsAndServices.txtRate ? Number(formValuesItemsAndServices.txtRate).toFixed(2) : "0.00",
          txtAmount: formValuesItemsAndServices.txtAmount ? formValuesItemsAndServices.txtAmount : "0.00",
          txtDiscountType: formValuesItemsAndServices.txtDiscountType && formValuesItemsAndServices.txtDiscountValue ? formValuesItemsAndServices.txtDiscountType : "0.00",
          txtDiscountValue: formValuesItemsAndServices.txtDiscountType.value === "V" ? Number(txtDiscountValue).toFixed(2) : txtDiscountValue,
          txtTotalDiscountValue: formValuesItemsAndServices.txtTotalDiscountValue ? formValuesItemsAndServices.txtTotalDiscountValue : "",
          txtTotalAmount: formValuesItemsAndServices.txtTotalAmount ? formValuesItemsAndServices.txtTotalAmount : "",
        });

        setAddedInvoiceItemsAndServices(arrayItemsAndService);
        invoiceTotalCalculation(arrayItemsAndService);

        setSelectedInvoiceFormValues((values) => ({
          ...values,
          addedItemsAndServices: arrayFormItemsAndService,
        }));

        setFormValidationError({});

        if (firstTextInput.current) {
          firstTextInput.current.focus();
        }
      }
    }

    if (ViewMode === Constant.REMOVE_SELECTED_ITEM_ROW) {
      arrayItemsAndService.splice(index, 1);

      setAddedInvoiceItemsAndServices(arrayItemsAndService);
      invoiceTotalCalculation(arrayItemsAndService);
    }
  };

  const getModalWidth = (viewMode) => {
    debugger;
    if (viewMode) {
      if (viewMode === Constant.INVOICE_CREATION) {
        setModalWidth(Constant.INVOICE_CREATION_MODAL_WIDTH);
      }

      if (viewMode === Constant.RECEIPT_CREATION) {
        setModalWidth(Constant.RECEIPT_CREATION_MODAL_WIDTH);
      }

      if (viewMode === Constant.INVOICE_RECEIPT_CREATION) {
        setModalWidth(Constant.INVOICE_RECEIPT_CREATION_MODAL_WIDTH);
      }
    }
  };

  const toggleCreateReceiptModal = (state) => {
    if (addedInvoiceItemsAndServices && addedInvoiceItemsAndServices.length > 0 && authenticateCreatedReceipt() === true) {
      setOpenCreateReceiptModal(state);
    }
  };

  const getAddedInvoiceItems = () => {
    debugger;
    let arrayItemsAndService = [...addedInvoiceItemsAndServices];

    let arrayAddedInvoiceItems = [];
    arrayItemsAndService.forEach((value) => {
      if (value && value.txtItem) {
        let Item = {
          bnItemNoID: value.txtItem.BNItemNoID ? value.txtItem.BNItemNoID : 0,
          bnItemDescription: value.txtItem.ItemDescription ? value.txtItem.ItemDescription : "",
          itemMakeID: 0,
          quantity_UOM: value.txtQuantity ? Number(value.txtQuantity) : 0,
          itemRate: value.txtRate ? Number(value.txtRate) : 0,
          lineRemark: "",
          hsnsacCode: "",
          itemBatchNo: "",
          itemExpiryDate: "",
          priceListID: 1,
          discountTypeID: 1,
          discountBaseAmount: value.txtAmount ? Number(value.txtAmount) : 0,
          discountPercentage: value.txtDiscountType === "%" && value.txtDiscountValue ? Number(value.txtDiscountValue) : 0,
          discountCalculatedAmount: value.txtTotalAmount ? value.txtTotalAmount : 0,
          discountRemarks: "",
          taxDefinitionID: 1,
          taxBaseamount: 1,
          taxPercentageApplicable: 1,
          taxAmountApplicable: 1,
          taxCalculatedAmount: 1,
          VariantCodeID: 1,
        };
        arrayAddedInvoiceItems.push(Item);
      }
    });
    return arrayAddedInvoiceItems;
  };

  /* ************************************* Code of Invoice Form Functions End ***************************** */

  /* ************************************* Code of Invoice Form Api Calling Start ***************************** */

  const getItemAndServicesList = () => {
    debugger;
    const formData = {
      main: {
        masterName: "BNITEMNO",
        itemMasterID: 0,
        itemGroupID: 0,
        itemTypeID: "#all",
        stockHeadID: "#all",
        transaction: "Purchase",
        itemCodeID: 0,
        skuid: 0,
        bnItemnoNo: "",
        filterID: 0,
        filterID1: 0,
        filterID2: 0,
        filterID3: "",
        filterID4: "",
        filterID5: "",
        searchText: "#all",
        searchCriteria: "AW",
      },
    };

    const request = {
      setDatalist: updateOptionInvoiceFormState,
      setLoad: updateLoadingInvoiceFormState,
      requestData: formData,
      apiPath: APIEndpoints.OPDBilling.getItemAndServicesList,
      setAlert: setAlertMessage,
      name: "txtItem",
      fun: null,
    };

    getOPDBillingApiData(request);
  };

  const saveSaleInvoice = (closeBillingModal) => {
    debugger;

    console.log(selectedUserData, "Selected Data");

    if (authenticateCreatedReceipt() === true) {
      return;
    }

    let arrayItemsAndService = [...addedInvoiceItemsAndServices];

    if (arrayItemsAndService && arrayItemsAndService.length > 0) {
      let addedInvoiceItems = getAddedInvoiceItems();

      const formData = {
        main: {
          saleInvoiceType: 1,
          saleInvoiceDate: currentDate ? currentDate : "",
          departmentMasterID: selectedData && selectedData.hospitalID ? selectedData.hospitalID : 0,
          accountingBranchID: 1,
          HIMSBusinessUnitID: Constant && Constant.OPD_BUSINESS_UNIT_ID ? Constant.OPD_BUSINESS_UNIT_ID : 0,
          specialityMasterID: selectedUserData && selectedUserData.SpecialityMasterID ? Number(selectedUserData.SpecialityMasterID) : 0,
          hospitalMasterID: selectedData && selectedData.departmentID ? Number(selectedData.departmentID) : 0,
          patientMasterID: selectedUserData && selectedUserData.PatientMasterID ? Number(selectedUserData.PatientMasterID) : 0,
          billToName: selectedUserData && selectedUserData.PatientVisitID ? `${selectedUserData.PFirstName} ${selectedData.PLastName}` : "",
          patientVisitID: selectedUserData && selectedUserData.PatientVisitID ? Number(selectedUserData.PatientVisitID) : 0,
          billToAddressLine1: selectedUserData && selectedUserData.AddressLine1 ? selectedUserData.AddressLine1 : "",
          billToAddressLine2: selectedUserData && selectedUserData.AddressLine2 ? selectedUserData.AddressLine2 : "",
          cityMasterID: selectedUserData && selectedUserData.CityMasterID ? Number(selectedUserData.CityMasterID) : 0,
          cityPinCode: selectedUserData && selectedUserData.PinCode ? selectedUserData.PinCode : "",
          warehouseMasterID: 1,
          storeMasterID: 1,
          invoiceStatusID: 1,
          invoiceCurrencyID: 1,
          invoiceRemarks: "",
          hosBusinessUnitID: 1,
          consultantMasterID: selectedUserData && selectedUserData.DoctorMasterID ? Number(selectedUserData.DoctorMasterID) : 0,
          payerMasterID: selectedUserData && selectedUserData.PayerMasterID ? Number(selectedUserData.PayerMasterID) : 0,
          insuranceMasterID: 0,
          payerPaymentModeID: 0,
          opticalOrderId: 0,
          labMasterID: 0,
          VariantCodeID: 2,
          invoiceTradeName: "",
          invoiceTradeName2: "",
          invDetail: addedInvoiceItems ? addedInvoiceItems : [],
        },
      };

      console.log(formData, "Save Request JSon");

      const request = {
        setDatalist: updateOptionInvoiceFormState,
        setLoad: updateLoadingInvoiceFormState,
        requestData: formData,
        apiPath: APIEndpoints.OPDBilling.saveSaleInvoice,
        setAlert: setAlertMessage,
        name: "eInvoice",
        fun: afterSaveSaleInvoice,
        message: true,
        direct: true,
        other: closeBillingModal,
      };

      getOPDBillingApiData(request);
    }
  };

  const afterSaveSaleInvoice = () => {};

  /* ************************************* Code of Invoice Form Api Calling End ***************************** */

  /* ************************************* Code of Invoice Form UseEffect Start ***************************** */

  useEffect(() => {
    getItemAndServicesList();
  }, []);

  useEffect(() => {
    console.log(selectedInvoiceFormValues);
  }, [selectedInvoiceFormValues]);

  useEffect(() => {
    console.log(loadingInvoiceFormValues);
  }, [loadingInvoiceFormValues]);

  useEffect(() => {
    console.log(optionInvoiceFormValues);
  }, [optionInvoiceFormValues]);

  /* ************************************* Code of Invoice Form UseEffect End ***************************** */

  /* ************************************* Array of States to be Returned Start ***************************** */

  const returnArray = {
    modalWidth,
    getModalWidth,
    selectedUserData,
    setSelectedUserData,
    selectedData,
    setSelectedData,
    selectedInvoiceFormValues,
    updateSelectedInvoiceFormState,
    addRemoveItemAndService,
    authenticateSelectedRowIndex,
    formValidationError,
    optionInvoiceFormValues,
    loadingInvoiceFormValues,
    openCreateReceiptModal,
    toggleCreateReceiptModal,
    savedReceiptData,
    updateSavedReceiptData,
    authenticateCreatedReceipt,
    saveSaleInvoice,
    addedInvoiceItemsAndServices,
    firstTextInput,
  };

  /* ************************************* Array of States to be Returned End ******************************* */

  return { ...returnArray };
}

export default CreateInvoiceLogic;
