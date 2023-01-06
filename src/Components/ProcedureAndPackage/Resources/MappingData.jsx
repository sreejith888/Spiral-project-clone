export const emptyArrayOptionFilterControls = {
    txtServiceCategory: [],
  };
  
  export const emptyArrayLoadingFilterControls = {
    txtServiceCategory: false,
  };
  
  export const emptyArraySelectedFilterControlsValues = {
    txtServiceCategory: null,
    txtSearchFilter: "",
  };
  
  export const procedureAndPackageColumnDef = [
    { headerName: "Action", field: "#", width: 80, pinned: "left", cellRenderer: "actionTemplate" },
    { headerName: "Sr No.", field: "BNItemNo", width: 80, pinned: "left", valueGetter: "node.rowIndex + 1" },
    { headerName: "Item Name", field: "ItemMasterName", width: 240 },
    { headerName: "Service Code", field: "ServiceCode", width: 220 },
    { headerName: "Service Name", field: "ServiceName", width: 380 },
    { headerName: "Free Days", field: "FreeDays", width: 120 },
    { headerName: "No of Visits", field: "NoOfVisits", width: 120 },
    { headerName: "Visit Days", field: "VisitDays", width: 120 },
    { headerName: "Tax Definition", field: "TaxDefinitionName", width: 160 },
    { headerName: "Tax Definition Value", field: "TaxDefinitionValue", width: 160 },
    { headerName: "Disease Name", field: "DiseaseName", width: 180 },
    { headerName: "Discountable", field: "Discountable", width: 120, cellRenderer: "commonCellTemplate" },
  ];
  
  export const getRowStyle = (data) => {
    if (data.data.IsSelected) {
      return { background: "#ffc176" };
    } else {
      if (data.data.IsNewlyAdded) {
        return { background: "#d5a10e" };
      }
      return { background: "" };
    }
  };
  
  export const emptyArrayOptionAddFormControls = {
    txtItemGroup: [],
    txtItemMaster: [],
    txtDisease: [],
  };
  
  export const emptyArrayLoadingAddFormControls = {
    txtItemGroup: false,
    txtItemMaster: false,
    txtDisease: false,
  };
  
  export const emptyArraySelectedAddFormControlsValues = {
    txtItemGroup: null,
    txtItemMaster: null,
    txtServiceCategory: "",
    txtServiceCode: "",
    txtServiceName: "",
    txtFreeDays: "",
    txtNoOfVisits: "",
    txtVisitDays: "",
    txtDisease: null,
    txtDiscountable: false,
  };
  
  export const emptyArraySearchTermAddFormControls = {
    txtItemMaster: "",
  };
  
  export const addFormValidationFieldNames = [
    "txtItemGroup",
    "txtItemMaster",
    "txtServiceCategory",
    "txtServiceCode",
    "txtServiceName",
    "txtFreeDays",
    "txtNoOfVisits",
    "txtVisitDays",
    "txtDisease",
    "txtDiscountable",
  ];
  