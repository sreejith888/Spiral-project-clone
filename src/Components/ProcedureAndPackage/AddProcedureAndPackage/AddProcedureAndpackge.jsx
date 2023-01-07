import React, { useState, useEffect, useRef } from "react";
import * as Constant from "../Resources/Constant";
import * as DataMapping from "../Resources/MappingData";
import APIEndpoints from "../APIEndpoints/APIEndpoints";
import getProcedureAndPackageApiData from "../Resources/CommonFunction";
import useDebounce from "../../../API methods/Utilities/Debounce";
import { AlertMessage } from "../../../Framework/Widgets/SelectStyle/Notification/NotificationProvider";
import Modal from "../../../Framework/Modal/Modal";
import Form from "../../../Framework/FormGroup/FormGroup";
import Button from "../../../Framework/Button/Button";

function AddProcedureAndPackage(props) {
  const { modalState, selectedData, closeModal, setConfirmAlert, updateGridDataLocally } = props;

  const addFormControlsRef = useRef([]);
  const setAlertMessage = AlertMessage();

  const [selectedViewMode, setSelectedViewMode] = useState("");
  const [optionAddForm, setOptionAddForm] = useState(DataMapping.emptyArrayOptionAddFormControls);
  const [loadingAddForm, setLoadingAddForm] = useState(DataMapping.emptyArrayLoadingAddFormControls);
  const [searchTermAddForm, setSearchTermAddForm] = useState(DataMapping.emptyArraySearchTermAddFormControls);
  const [selectedAddFormValues, setSelectedAddFormValues] = useState(DataMapping.emptyArraySelectedAddFormControlsValues);
  const [oldSelectedAddFormValues, setOldSelectedAddFormValues] = useState(DataMapping.emptyArraySelectedAddFormControlsValues);

  const [loadingAddProcedureAndPackage, setLoadingAddProcedureAndPackage] = useState(false);

  const [formValidationError, setFormValidationError] = useState({});

  const updateOptionAddForm = (name, value) => {
    setOptionAddForm((existingValues) => ({
      ...existingValues,
      [name]: value,
    }));
  };

  const updateLoadingAddForm = (name, value) => {
    setLoadingAddForm((existingValues) => ({
      ...existingValues,
      [name]: value,
    }));
  };

  const addProcedureAndPackageValidateField = (name, value) => {
    debugger;
    let errorsMsg = "";

    if (name === "txtItemGroup") {
      if (!value || typeof value === "undefined" || value === null) {
        errorsMsg = "Item Group Cannot Be Empty";
      }
    }

    if (name === "txtItemMaster") {
      if (!value || typeof value === "undefined" || value === null) {
        errorsMsg = "Item Master Cannot Be Empty";
      }
    }

    if (name === "txtBNItemNo") {
      if (!value || typeof value === "undefined" || value === null) {
        errorsMsg = "BNItem No Cannot Be Empty";
      }
    }

    if (name === "txtServiceCategory") {
      if (!value || typeof value === "undefined" || value === null) {
        errorsMsg = "Service Category Cannot Be Empty";
      }
    }

    if (name === "txtServiceCode") {
      if (!value || typeof value === "undefined" || value === null) {
        errorsMsg = "Service Code Cannot Be Empty";
      }
    }

    if (name === "txtServiceName") {
      if (!value || typeof value === "undefined" || value === null) {
        errorsMsg = "Service Name Cannot Be Empty";
      }
    }

    if (name === "txtDisease") {
      if (!value || typeof value === "undefined" || value === null) {
        errorsMsg = "Disease Cannot Be Empty";
      }
    }

    return errorsMsg;
  };

  const addProcedureAndPackageValidation = () => {
    debugger;
    let formIsValid = true;
    let errors = {};

    DataMapping.addFormValidationFieldNames &&
      DataMapping.addFormValidationFieldNames.map((data) => {
        return (errors[data] = addProcedureAndPackageValidateField(data, selectedAddFormValues[data]));
      });

    if (errors && Object.values(errors).join("").toString()) {
      formIsValid = false;
    }

    setFormValidationError(errors);
    return formIsValid;
  };

  const [searchTerm, setSearchTerm] = useState({
    searchControl: "",
    searchValue: "",
  });

  const debouncedSearchTerm = useDebounce(searchTerm.searchValue, 500);

  const updateSearchTermAddForm = (name, value) => {
    setSearchTermAddForm((existingValues) => ({
      ...existingValues,
      [name]: value,
    }));

    setSearchTerm((existingValues) => ({
      ...existingValues,
      searchControl: name,
      searchValue: value,
    }));
  };

  const updateAddFormControlsValues = (name, value) => {
    formValidationError[name] = addProcedureAndPackageValidateField(name, value);
    setSelectedAddFormValues((existingValues) => ({
      ...existingValues,
      [name]: value,
    }));

    console.log(selectedAddFormValues);

    if ((name === "txtFreeDays" || name === "txtNoOfVisits" || name === "txtVisitDays") && value) {
      const newValue = value.replace(/\D/g, "");

      setSelectedAddFormValues((existingValues) => ({
        ...existingValues,
        [name]: newValue,
      }));
      return;
    }

    if (name === "txtItemGroup") {
      if (value && value.ItemGroupID) {
        getItemMasterList(value.ItemGroupID);
        return;
      }

      setOptionAddForm((existingValues) => ({
        ...existingValues,
        ["txtItemMaster"]: [],
      }));
    }

    if (name === "txtItemMaster" && value) {
      if (value.ItemGroupID && value.ItemGroupName) {
        setSelectedAddFormValues((existingValues) => ({
          ...existingValues,
          ["txtItemGroup"]: {
            ItemGroupID: value.ItemGroupID,
            ItemGroupName: value.ItemGroupName,
          },
        }));
      }
    }
  };

  const addProcedureAndPackage = async (buttonMode) => {
    try {
      if (addProcedureAndPackageValidation() === false) {
        return;
      }

      setConfirmAlert({
        open: true,
        title: "Add New Record",
        msg: `Are you sure want to Add New Record ?`,
        button: {
          confirmText: "Save",
          abortText: "Cancel",
          Color: Constant.SUCCESS_TEXT,
        },
        onConfirm: () => onConfirmAddProcedureAndPackage(buttonMode),
      });
    } catch (error) {
      setAlertMessage({ open: true, type: "error", message: `${Constant.ERROR_MSG} 551` });
    }
  };

  /* ************************************* Code of Api Calling Start ***************************** */

  const getItemGroupList = () => {
    debugger;
    try {
      const formData = {
        main: {
          filterID: 0,
          filterID1: 0,
          MasterName: "ITEMGRP",
          searchText: "#ALL",
          searchCriteria: "AW",
        },
      };

      console.log(formData, "Request Json (getItemGroupList)");

      const request = {
        setDatalist: updateOptionAddForm,
        setLoad: updateLoadingAddForm,
        requestData: formData,
        apiPath: APIEndpoints.ProcedureAndPackage.getItemGroupList,
        setAlert: setAlertMessage,
        name: "txtItemGroup",
        fun: null,
        message: false,
        direct: false,
        other: null,
      };

      getProcedureAndPackageApiData(request);
    } catch {
      setAlertMessage({ open: true, type: "error", message: `${Constant.ERROR_MSG} 545` });
    }
  };

  const getItemMasterList = (itemGroupID) => {
    debugger;
    try {
      const formData = {
        main: {
          masterName: "ITEMMAS",
          itemMasterID: 0,
          itemGroupID: itemGroupID
            ? itemGroupID
            : selectedAddFormValues["txtItemGroup"] && selectedAddFormValues["txtItemGroup"].ItemGroupID
            ? selectedAddFormValues["txtItemGroup"].ItemGroupID
            : 0,
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
          searchText: debouncedSearchTerm ? debouncedSearchTerm : "#all",
          searchCriteria: "AW",
        },
      };

      console.log(formData, "Request Json (getItemMasterList)");

      const request = {
        setDatalist: updateOptionAddForm,
        setLoad: updateLoadingAddForm,
        requestData: formData,
        apiPath: APIEndpoints.ProcedureAndPackage.getItemMasterList,
        setAlert: setAlertMessage,
        name: "txtItemMaster",
        fun: null,
        message: false,
        direct: false,
        other: null,
      };

      getProcedureAndPackageApiData(request);
    } catch {
      setAlertMessage({ open: true, type: "error", message: `${Constant.ERROR_MSG} 564` });
    }
  };

  const getDiseaseList = () => {
    debugger;
    try {
      const formData = {
        main: {
          action: Constant.GET_DISEASE_LIST_ACTION,
          searchText: "",
          searchCriteria: "",
          filterID: "",
          filterID1: "",
          filterID2: "",
          filterID3: "",
          filterID4: "",
          filterID5: "",
          filterID6: "",
        },
      };

      console.log(formData, "Request Json (getDiseaseList)");

      const request = {
        setDatalist: updateOptionAddForm,
        setLoad: updateLoadingAddForm,
        requestData: formData,
        apiPath: APIEndpoints.ProcedureAndPackage.getDiseaseList,
        setAlert: setAlertMessage,
        name: "txtDisease",
        fun: null,
        message: false,
        direct: false,
        other: null,
      };

      getProcedureAndPackageApiData(request);
    } catch {
      setAlertMessage({ open: true, type: "error", message: `${Constant.ERROR_MSG} 542` });
    }
  };

  const onConfirmAddProcedureAndPackage = (buttonMode) => {
    debugger;
    try {
      const formData = {
        main: {
          bnItemNoID:
            selectedAddFormValues && selectedAddFormValues.txtItemMaster && selectedAddFormValues.txtItemMaster.BNItemNoID
              ? selectedAddFormValues.txtItemMaster.BNItemNoID
              : "",
          serviceCode: selectedAddFormValues && selectedAddFormValues.txtServiceCode ? selectedAddFormValues.txtServiceCode : "",
          serviceName: selectedAddFormValues && selectedAddFormValues.txtServiceName ? selectedAddFormValues.txtServiceName : "",
          serviceCategoryID:
            selectedAddFormValues && selectedAddFormValues.txtServiceCategory && selectedAddFormValues.txtServiceCategory.MasterValueID
              ? Number(selectedAddFormValues.txtServiceCategory.MasterValueID)
              : 0,
          freeDays: selectedAddFormValues && selectedAddFormValues.txtFreeDays ? Number(selectedAddFormValues.txtFreeDays) : 0,
          noOfVisits: selectedAddFormValues && selectedAddFormValues.txtNoOfVisits ? Number(selectedAddFormValues.txtNoOfVisits) : 0,
          visitDays: selectedAddFormValues && selectedAddFormValues.txtVisitDays ? selectedAddFormValues.txtVisitDays : "",
          diseaseMasterID:
            selectedAddFormValues && selectedAddFormValues.txtDisease && selectedAddFormValues.txtDisease.DiseaseMasterID
              ? Number(selectedAddFormValues.txtDisease.DiseaseMasterID)
              : 0,
          discountable: selectedAddFormValues && selectedAddFormValues.txtDiscountable && selectedAddFormValues.txtDiscountable === true ? 1 : 0,
        },
      };

      console.log(formData, "Request Json (onConfirmAddProcedureAndPackage)");

      const localUpdate = (data) => {
        const newObj = {
          HIMSBNItemNoID: data ? data : 0,
          BNItemNoID:
            selectedAddFormValues && selectedAddFormValues.txtItemMaster && selectedAddFormValues.txtItemMaster.BNItemNoID
              ? Number(selectedAddFormValues.txtItemMaster.BNItemNoID)
              : "",
          ServiceCode: selectedAddFormValues && selectedAddFormValues.txtServiceCode ? selectedAddFormValues.txtServiceCode : "",
          ServiceName: selectedAddFormValues && selectedAddFormValues.txtServiceName ? selectedAddFormValues.txtServiceName : "",
          FreeDays: selectedAddFormValues && selectedAddFormValues.txtFreeDays ? Number(selectedAddFormValues.txtFreeDays) : 0,
          Discountable: selectedAddFormValues && selectedAddFormValues.txtDiscountable && selectedAddFormValues.txtDiscountable === true ? 1 : 0,
          ActiveStatus: 0,
          NoOfVisits: selectedAddFormValues && selectedAddFormValues.txtNoOfVisits ? Number(selectedAddFormValues.txtNoOfVisits) : 0,
          VisitDays: selectedAddFormValues && selectedAddFormValues.txtVisitDays ? selectedAddFormValues.txtVisitDays : "",
          ItemMasterName:
            selectedAddFormValues && selectedAddFormValues.txtItemMaster && selectedAddFormValues.txtItemMaster.ItemMasterName
              ? selectedAddFormValues.txtItemMaster.ItemMasterName
              : "",
          TaxDefinitionName: "",
          TaxDefinitionValue: 0,
          DiseaseMasterID:
            selectedAddFormValues && selectedAddFormValues.txtDisease && selectedAddFormValues.txtDisease.DiseaseMasterID
              ? Number(selectedAddFormValues.txtDisease.DiseaseMasterID)
              : 0,
          DiseaseName:
            selectedAddFormValues && selectedAddFormValues.txtDisease && selectedAddFormValues.txtDisease.DiseaseName
              ? selectedAddFormValues.txtDisease.DiseaseName
              : "",
          IsNewlyAdded: true,
        };

        updateGridDataLocally(newObj);

        if (buttonMode === "Save") {
          closeModal();
        }

        if (buttonMode === "SaveMore") {
          setOptionAddForm(DataMapping.emptyArrayOptionAddFormControls);
          setLoadingAddForm(DataMapping.emptyArrayLoadingAddFormControls);
          setSearchTermAddForm(DataMapping.emptyArraySearchTermAddFormControls);
          setSelectedAddFormValues(DataMapping.emptyArraySelectedAddFormControlsValues);

          if (addFormControlsRef.current["txtItemGroup"]) {
            addFormControlsRef.current["txtItemGroup"].focus();
          }

          if (selectedData.ViewMode === Constant.ADD_VIEWMODE) {
            if (selectedData.filterControlsValues) {
              if (selectedData.filterControlsValues.txtServiceCategory) {
                updateAddFormControlsValues("txtServiceCategory", selectedData.filterControlsValues.txtServiceCategory);
              }
            }
          }

          getItemGroupList();
          getDiseaseList();
        }
      };

      const setData = () => {};

      const request = {
        setDatalist: setData,
        setLoad: setLoadingAddProcedureAndPackage,
        requestData: formData,
        apiPath: APIEndpoints.ProcedureAndPackage.addProcedureAndPackage,
        setAlert: setAlertMessage,
        name: null,
        fun: localUpdate,
        message: false,
        direct: false,
        other: null,
      };

      getProcedureAndPackageApiData(request);
    } catch {
      setAlertMessage({ open: true, type: "error", message: `${Constant.ERROR_MSG} 543` });
    }
  };

  /* ************************************* Code of Api Calling End ****************************** */

  const checkEditFormControlValues = () => {
    debugger;
    try {
      if (selectedViewMode === Constant.EDIT_VIEWMODE && JSON.stringify(selectedAddFormValues) === JSON.stringify(oldSelectedAddFormValues)) {
        return false;
      }
      return true;
    } catch {
      setAlertMessage({ open: true, type: "error", message: `${Constant.ERROR_MSG} 544` });
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 3 && searchTerm.searchControl) {
      if (searchTerm.searchControl === "txtItemMaster") {
        getItemMasterList();
      }

      if (debouncedSearchTerm === "#all" || debouncedSearchTerm === "#al") {
        setSearchTermAddForm((existingValues) => ({
          ...existingValues,
          [searchTerm.searchControl]: "",
        }));
      }
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (selectedData) {
      setSelectedViewMode(selectedData.ViewMode);

      if (selectedData.ViewMode === Constant.ADD_VIEWMODE) {
        if (selectedData.filterControlsValues) {
          if (selectedData.filterControlsValues.txtServiceCategory) {
            updateAddFormControlsValues("txtServiceCategory", selectedData.filterControlsValues.txtServiceCategory);
          }
        }
      }

      if (selectedData.ViewMode === Constant.EDIT_VIEWMODE) {
        const state = {
          txtServiceCategory: "",
          txtServiceCode: "",
          txtServiceName: "",
          txtFreeDays: "",
          txtNoOfVisits: "",
          txtVisitDays: "",
          txtDisease: null,
          txtDiscountable: "",
          txtItemGroup: null,
        };

        setSelectedAddFormValues(state);
        setOldSelectedAddFormValues(state);
      }
    }
  }, [selectedData]);

  useEffect(() => {
    if (modalState === true) {
      if (addFormControlsRef.current["txtItemGroup"]) {
        addFormControlsRef.current["txtItemGroup"].focus();
      }

      getItemGroupList();
      getDiseaseList();
    }
  }, []);

  return (
    <Modal varient="center" title={`${selectedViewMode} Procedure & Package`} show={closeModal} right={0}>
      <Modal.Body>
        <Form>
          <Form.Group column={2} controlwidth="240px">
            <Form.InputGroup label="Service Category" errorMsg={formValidationError["txtServiceCategory"]} req={true}>
              <Form.InputControl
                control="input"
                name="txtServiceCategory"
                disabled={true}
                value={
                  selectedAddFormValues["txtServiceCategory"] && selectedAddFormValues["txtServiceCategory"].MasterDisplayName
                    ? selectedAddFormValues["txtServiceCategory"].MasterDisplayName
                    : ""
                }
              />
            </Form.InputGroup>
            <Form.InputGroup label="Group" errorMsg={formValidationError["txtItemGroup"]} req={true}>
              <Form.InputControl
                control="select"
                name="txtItemGroup"
                options={optionAddForm["txtItemGroup"]}
                isLoading={loadingAddForm["txtItemGroup"]}
                getOptionValue={(option) => `${option}`}
                getOptionLabel={(option) => `${option.ItemGroupName}`}
                value={selectedAddFormValues["txtItemGroup"]}
                onChange={(e) => updateAddFormControlsValues("txtItemGroup", e)}
                ref={(el) => (addFormControlsRef.current["txtItemGroup"] = el)}
              />
            </Form.InputGroup>
            <Form.InputGroup label="Item Master" errorMsg={formValidationError["txtItemMaster"]} req={true}>
              <Form.InputControl
                control="select"
                name="txtItemMaster"
                options={optionAddForm["txtItemMaster"]}
                isLoading={loadingAddForm["txtItemMaster"]}
                getOptionValue={(option) => `${option}`}
                getOptionLabel={(option) => (option.BNItemNo ? `${option.BNItemNo + " " + "|" + " " + option.ItemMasterName}` : `${option.ItemMasterName}`)}
                value={selectedAddFormValues["txtItemMaster"]}
                onChange={(e) => updateAddFormControlsValues("txtItemMaster", e)}
                inputValue={searchTermAddForm["txtItemMaster"]}
                onInputChange={(e) => {
                  if (e !== null) {
                    updateSearchTermAddForm("txtItemMaster", e);
                  }
                }}
                ref={(el) => (addFormControlsRef.current["txtItemMaster"] = el)}
              />
            </Form.InputGroup>
            <Form.InputGroup label="service Code" errorMsg={formValidationError["txtServiceCode"]} req={true}>
              <Form.InputControl
                control="input"
                maxLength="10"
                name="txtServiceCode"
                value={selectedAddFormValues["txtServiceCode"]}
                onChange={(e) => updateAddFormControlsValues("txtServiceCode", e.target.value)}
                ref={(el) => (addFormControlsRef.current["txtServiceCode"] = el)}
              />
            </Form.InputGroup>
            <Form.InputGroup label="service Name" errorMsg={formValidationError["txtServiceName"]} req={true}>
              <Form.InputControl
                control="input"
                maxLength="100"
                name="txtServiceName"
                value={selectedAddFormValues["txtServiceName"]}
                onChange={(e) => updateAddFormControlsValues("txtServiceName", e.target.value)}
                ref={(el) => (addFormControlsRef.current["txtServiceName"] = el)}
              />
            </Form.InputGroup>
            <Form.InputGroup label="Free Days" errorMsg={formValidationError["txtFreeDays"]} req={false}>
              <Form.InputControl
                control="input"
                maxLength="2"
                name="txtFreeDays"
                value={selectedAddFormValues["txtFreeDays"]}
                onChange={(e) => updateAddFormControlsValues("txtFreeDays", e.target.value)}
                ref={(el) => (addFormControlsRef.current["txtFreeDays"] = el)}
              />
            </Form.InputGroup>
            <Form.InputGroup label="No of Visits" errorMsg={formValidationError["txtNoOfVisits"]} req={false}>
              <Form.InputControl
                control="input"
                maxLength="1"
                name="txtNoOfVisits"
                value={selectedAddFormValues["txtNoOfVisits"]}
                onChange={(e) => updateAddFormControlsValues("txtNoOfVisits", e.target.value)}
                ref={(el) => (addFormControlsRef.current["txtNoOfVisits"] = el)}
              />
            </Form.InputGroup>
            <Form.InputGroup label="Visit Days" errorMsg={formValidationError["txtVisitDays"]} req={false}>
              <Form.InputControl
                control="input"
                maxLength="3"
                name="txtVisitDays"
                value={selectedAddFormValues["txtVisitDays"]}
                onChange={(e) => updateAddFormControlsValues("txtVisitDays", e.target.value)}
                ref={(el) => (addFormControlsRef.current["txtVisitDays"] = el)}
              />
            </Form.InputGroup>
            <Form.InputGroup label="Disease" errorMsg={formValidationError["txtDisease"]} req={true}>
              <Form.InputControl
                control="select"
                name="txtDisease"
                options={optionAddForm["txtDisease"]}
                isLoading={loadingAddForm["txtDisease"]}
                getOptionValue={(option) => `${option}`}
                getOptionLabel={(option) => `${option.DiseaseName}`}
                value={selectedAddFormValues["txtDisease"]}
                onChange={(e) => updateAddFormControlsValues("txtDisease", e)}
                ref={(el) => (addFormControlsRef.current["txtDisease"] = el)}
              />
            </Form.InputGroup>
            <Form.InputGroup label="Discountable" errorMsg={formValidationError["txtDiscountable"]} req={false}>
              <Form.InputControl
                control="switch"
                name="txtDiscountable"
                checked={selectedAddFormValues["txtDiscountable"]}
                onChange={(e) => updateAddFormControlsValues("txtDiscountable", e.target.checked)}
                ref={(el) => (addFormControlsRef.current["txtDiscountable"] = el)}
              />
            </Form.InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button
          type="button"
          varient="secondary"
          onClick={() => addProcedureAndPackage("Save")}
          loader={loadingAddProcedureAndPackage}
          disabled={checkEditFormControlValues() === false ? true : false}
        >
          {selectedViewMode === Constant.EDIT_VIEWMODE ? "Update" : "Save"}
        </Button>
        {selectedViewMode === Constant.EDIT_VIEWMODE ? null : (
          <Button type="button" varient="secondary" onClick={() => addProcedureAndPackage("SaveMore")} loader={loadingAddProcedureAndPackage}>
            Save More
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default AddProcedureAndPackage;
