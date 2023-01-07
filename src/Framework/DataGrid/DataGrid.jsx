import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import classNames from "classnames";
import "./DataGrid.scss";

function DataGrid(props) {
  const { className, loader, ...restProps } = props;

  return (
    <div className={classNames("AGDataGrid", "ag-theme-blue", className)}>
      {loader !== false ? loader : null}
      <AgGridReact
        enableRangeSelection="false"
        rowSelection="false"
        defaultColDef={{
          sortable: true,
          resizable: true,
          enableRowGroup: true,
          enablePivot: true,
          enableValue: true,
          animateRows: true,
        }}
        {...restProps}
      />
    </div>
  );
}

export default DataGrid;
