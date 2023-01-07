import React, { useEffect, useRef, useState } from 'react'
import PageBar from '../../Framework/Pagebar/Pagebar';
import PageHeader from '../Common/Header/PageHeader';
import DataGrid from '../../Framework/DataGrid/DataGrid';
import * as DataMapping from "./Resources/MappingData";
import { AiFillEdit } from "react-icons/ai";
import { BsToggleOn } from "react-icons/bs";
import getProcedureAndPackageApiData from "./Resources/CommonFunction";
import APIEndpoints from "./APIEndpoints/APIEndpoints";
import * as Constant from "./Resources/Constant";
import AddProcedureAndPackage from "./AddProcedureAndPackage/AddProcedureAndpackge";
import { AlertMessage } from '../../Framework/Widgets/SelectStyle/Notification/NotificationProvider';
import { CommonCellTemplate } from '../../API methods/Utilities/CustomDataGridCellTemplate';
const ProcedureAndPackage = () => {

  const setAlertMessage = AlertMessage();
  const filterControlsRef = useRef([]);
  const [confirmAlert, setConfirmAlert] = useState({
    open: false,
    title: "",
    msg: "",
    onConfirm: null,
    button: { confirmText: "", abortText: "" },
  });


  const [gridApi, setGridApi] = useState();
  const [optionFilter, setOptionFilter] = useState(DataMapping.emptyArrayOptionFilterControls);
  const [loadingFilter, setLoadingFilter] = useState(DataMapping.emptyArrayLoadingFilterControls);
  const [selectedFilterValues, setSelectedFilterValues] = useState(DataMapping.emptyArraySelectedFilterControlsValues);
  const [procedurePackageData, setProcedureAndPackageData] = useState([]);
  const [isLoadingProcedureAndPackageData, setIsLoadingProcedureAndPackageData] = useState(false);
  const [isisloadingupdateProcedureAndPackageStatus, setIsisloadingupdateProcedureAndPackageStatus] = useState(false);

  const [addModalOpen,setAddModalOpen] = useState(false);
  const [modalGridSelectedData, setModalGridSelectedData] = useState({});

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

 const updateFilterControlsOption=(name,value)=>{
  debugger
  console.log(name,value);
  setOptionFilter((values)=>({
    ...values,
    [name]:value
  })
 )};

 const updateLoadingFilterControls = (name, value) => {
  setLoadingFilter((values) => ({
    ...values,
    [name]: value,
  }));
};

const updateFilterControlsValues = (name, value) => {
  setSelectedFilterValues((existingValues) => ({
    ...existingValues,
    [name]: value,
  }));

  if (name === "txtServiceCategory") {
    setProcedureAndPackageData([]);
  }

  if (name === "txtSearchFilter") {
    if (gridApi) {
      gridApi.setQuickFilter(value);
      gridApi.refreshCells();
    }
  }
};

const packageAndProcedureValidation =()=>{
  if(!selectedFilterValues["txtServiceCategory"]){
    if(filterControlsRef.current["txtServiceCategory"]){
    filterControlsRef.current["txtServiceCategory"].focus();
  }
  // setAlertMessage({open: true, type: "warning", message: "Please Select Service Category!"})
return false;
  }
  return true;
};

const updateProcedureAndPackageStatus = async (selectedRowData) =>{
  try{
if(selectedFilterValues){
  const buttonText = selectedRowData.ActiveStatus === Constant.ACTIVE_STATUS_VALUE
  ? Constant.IN_ACTIVE_STATUS_TEXT:selectedRowData.ActiveStatus === Constant.IN_ACTIVE_STATUS_VALUE
  ?Constant.ACTIVE_STATUS_TEXT :"";
setConfirmAlert({
  open: true,
  title: buttonText,
  msg: `Are you sure want to ${buttonText} ?`,
  button: {
    confirmText: buttonText,
    abortText: "Cancel",
    Color:
      selectedRowData.ActiveStatus === Constant.ACTIVE_STATUS_VALUE
        ? Constant.DANGER_TEXT
        : selectedRowData.ActiveStatus === Constant.IN_ACTIVE_STATUS_VALUE
        ? Constant.SUCCESS_TEXT
        : "",
  },
  onConfirm: () => onConfirmupdateProcedureAndPackageStatus(selectedRowData),
        });
}
}
  
  catch{
    // setAlertMessage({ open: true, type: "error", message: `${Constant.ERROR_MSG} 442` });
  }
};
//***************************MODAL CALING*************************/

const OpenAddModal = () => {
  if (!(packageAndProcedureValidation)) {
    return;
  }
  setModalGridSelectedData({ ViewMode: Constant.ADD_VIEWMODE, filterControlsValues: selectedFilterValues });
  setAddModalOpen(true);
};

const closeAddModal = () => {
  if (!packageAndProcedureValidation()) {
    return;
  }
  setModalGridSelectedData([]);
  setAddModalOpen(false);
};

const openEditProcedureAndPackageModal = (SelectedRowData) => {
  setModalGridSelectedData({ ViewMode: Constant.EDIT_VIEWMODE, SelectedRowData: SelectedRowData });
  setAddModalOpen(true);
};

const updateGridDataLocally = (newObj) => {
  if (procedurePackageData && procedurePackageData.length === 0) {
    procedurePackageData.push(newObj);
    setProcedureAndPackageData([]);
    setProcedureAndPackageData(procedurePackageData);
  } else {
    procedurePackageData.unshift(newObj);
    setProcedureAndPackageData([]);
    setProcedureAndPackageData(procedurePackageData);
  }
};

useEffect(() => {
  if (addModalOpen === false) {
    setProcedureAndPackageData({});
  }
}, [addModalOpen]);

// *************************API CALLING START***********************
const getServiceCategoryList = () => {
  debugger;
  try {
    const formData = {
      main: {
        action: Constant.GET_SERVICE_CATEGORY_LIST_ACTION,
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

    console.log(formData, "Request Json (getServiceCategoryList)");

    const setAlert =()=>{
      
    }
    const request = {
      setDatalist: updateFilterControlsOption,
      setLoad: updateLoadingFilterControls,
      requestData: formData,
      apiPath: APIEndpoints.ProcedureAndPackage.getServiceCategoryList,
      setAlert: setAlertMessage ,
      name: "txtServiceCategory" ,
      fun: null,
      message: false,
      direct: false,
      other: null,
    };

    getProcedureAndPackageApiData(request);
    console.log()
  } catch {
    setAlertMessage({ open: true, type: "error", message: `${Constant.ERROR_MSG} 441` });
  }
};

const getProcedureAndPackageList = () => {
  debugger;
  try {
    if (!packageAndProcedureValidation()) {
      return;
    }

    const formData = {
      main: {
        action: "PACKAGEANDPROCEDURE",
        filter1:
          selectedFilterValues && selectedFilterValues["txtServiceCategory"] && selectedFilterValues["txtServiceCategory"].MasterValueID
            ? selectedFilterValues["txtServiceCategory"].MasterValueID
            : 0,
        filter2: "",
      },
    };

    console.log(formData, "Request Json (getProcedureAndPackageList)");

    const request = {
      setDatalist: setProcedureAndPackageData,
      setLoad: isLoadingProcedureAndPackageData,
      requestData: formData,
      apiPath: APIEndpoints.ProcedureAndPackage.getProcedureAndPackageList,
      setAlert: setAlertMessage,
      name: null,
      fun: null,
      message: false,
      direct: true,
      other: null,
    };

    getProcedureAndPackageApiData(request);
  } catch {
    setAlertMessage({ open: true, type: "error", message: `${Constant.ERROR_MSG} 442` });
  }
};

const onConfirmupdateProcedureAndPackageStatus = (selectedRowData) => {
  debugger;
  try {
    const formData = {
      main: {
        himsbnItemNoID: selectedRowData && selectedRowData.HIMSBNItemNoID ? selectedRowData.HIMSBNItemNoID : 0,
        activeStatus: selectedRowData && selectedRowData.ActiveStatus === 1 ? 0 : selectedRowData && selectedRowData.ActiveStatus === 0 ? 1 : null,
      },
    };

    console.log(formData, "Request Json (updateProcedureAndPackageListStatus)");

    const localUpdate = () => {
      if (gridApi) {
        const itemsToUpdate = [];
        gridApi.forEachNode(function (rowNode) {
          if (rowNode.data.HIMSBNItemNoID.toString() === selectedRowData.HIMSBNItemNoID.toString()) {
            if (selectedRowData.ActiveStatus === 1) {
              selectedRowData.ActiveStatus = 0;
            } else if (selectedRowData.ActiveStatus === 0) {
              selectedRowData.ActiveStatus = 1;
            } else {
              selectedRowData.ActiveStatus = null;
            }
            itemsToUpdate.push(selectedRowData);
            rowNode.setData(selectedRowData);
          }
        });
        gridApi.updateRowData({
          update: itemsToUpdate,
        });
      }
    };

    const request = {
      setDatalist: console.log,
      setLoad:setIsisloadingupdateProcedureAndPackageStatus ,
      requestData: formData,
      apiPath: APIEndpoints.ProcedureAndPackage.updateProcedureAndPackageStatus,
      setAlert: setAlertMessage,
      name: null,
      fun: localUpdate,
      message: true,
      direct: true,
      other: null,
    };

    getProcedureAndPackageApiData(request);
  } catch {
    setAlertMessage({ open: true, type: "error", message: `${Constant.ERROR_MSG} 443` });
  }
};

/* ************************************* Code of Api Calling End ****************************** */

useEffect(() => {
  getServiceCategoryList();
}, []);

const AddProcedureAndPackageModalProps = {
  modalState: addModalOpen,
  selectedData: isLoadingProcedureAndPackageData,
  closeModal: closeAddModal,
  setConfirmAlert,
  updateGridDataLocally,
};
  return (
        <>
         {addModalOpen ? <AddProcedureAndPackage {...AddProcedureAndPackageModalProps} /> : null}
         <div className='main_procedure'>
        <PageHeader/>
        <div className="PageStart">
        <PageBar title="Procedure & Package">
          <PageBar.Select
            width="240px"
            label="Service Category"
            name="txtServiceCategory"
            options={optionFilter["txtServiceCategory"]}
            isLoading={loadingFilter["txtServiceCategory"]}
            getOptionValue={(option) => `${option}`}
            getOptionLabel={(option) => `${option.MasterDisplayName}`}
            value={selectedFilterValues["txtServiceCategory"]}
            onChange={(e) => updateFilterControlsValues("txtServiceCategory", e)}
            ref={(el) => (filterControlsRef.current["txtServiceCategory"] = el)}
          />

          <PageBar.Search
            name="txtSearchFilter"
            value={selectedFilterValues["txtSearchFilter"]}
            onClick={() => getProcedureAndPackageList()}
            onChange={(e) => updateFilterControlsValues(e.target.name, e.target.value)}
            ref={(el) => (filterControlsRef.current["txtSearchFilter"] = el)}
          />

          <PageBar.Button type="button"  onClick={() => OpenAddModal()}>
            Add
          </PageBar.Button>
        </PageBar>
        {/* <DataGrid
          columnDefs={DataMapping.procedureAndPackageColumnDef}
          frameworkComponents={{
            actionTemplate: cellTemplate,
            commonCellTemplate: CommonCellTemplate,
          }}
          getRowStyle={DataMapping.getRowStyle}
          rowData={procedurePackageData}
          onGridReady={onGridReady}
          updateProcedureAndPackageStatus={updateProcedureAndPackageStatus}
          isloadingupdateProcedureAndPackageStatus={isloadingupdateProcedureAndPackageStatus}
          openEditProcedureAndPackageModal={openEditProcedureAndPackageModal}
        /> */}
        </div>
        </div>
        </>

  )
}

export default ProcedureAndPackage;

const cellTemplate = (props) => {
  const { agGridReact, data } = props;

  const changeSelectedRowRecordStatue = () => {
    agGridReact.props.updateProcedureAndPackageStatus(data);
  };

  const editSelectedRowRecord = () => {
    agGridReact.props.openEditProcedureAndPackageModal(data);
  };

  return (
    <div className='BizClass.celltemplate'>
      {data && data.ActiveStatus === 0 && (
        <button
          type="button"
          title={Constant.ACTIVE_STATUS_TEXT}
          onClick={() => changeSelectedRowRecordStatue()}
          disabled={agGridReact.props.isloadingupdateProcedureAndPackageStatus}
        >
          <BsToggleOn style={{ fontSize: "20px", color: "#eb2121", marginTop: "1px", transform: "rotate(180deg)" }} />
        </button>
      )}
      {data && data.ActiveStatus === 1 && (
        <button
          type="button"
          title={Constant.IN_ACTIVE_STATUS_TEXT}
          onClick={() => changeSelectedRowRecordStatue()}
          disabled={agGridReact.props.isloadingupdateProcedureAndPackageStatus}
        >
          <BsToggleOn style={{ fontSize: "20px", color: "#198754", marginTop: "1px" }} />
        </button>
      )}

      <button type="button" title="Edit Record" onClick={() => editSelectedRowRecord()}>
        <AiFillEdit style={{ fontSize: "18px", color: "#34495E", marginTop: "2px" }} />
      </button>
    </div>
  );
};
