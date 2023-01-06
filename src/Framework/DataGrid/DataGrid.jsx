import React, { useState } from "react";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import "ag-grid-enterprise";
import classNames from "classnames";

function DataGrid(props) {
  const { className, children, loader, theme, enableRangeSelection, rowSelection, rowData, ...restProps } = props;
  const [dragResized, setDragResized] = useState(false);

  var timer;
  const autoResize = (val) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const gridApi = val.api;
      const columnApi = val.columnApi;
      let colDefs = [...gridApi.getColumnDefs()];

      //Auto Resizable Columns
      let autoResizableColumns = [];
      colDefs.forEach((val, index) => {
        if (val.autoResizeValues) {
          autoResizableColumns.push({
            index: index,
            id: val.field,
            autoResizeValues: val.autoResizeValues,
          });
        }
      });
      if (autoResizableColumns.length > 0) {
        const rowRendered = gridApi.rowRenderer;
        let firstRenderedRow = rowRendered.firstRenderedRow;
        let lastRenderedRow = rowRendered.lastRenderedRow + 1;

        let columnData = rowData.slice(firstRenderedRow, lastRenderedRow);

        let width = [];
        columnData.forEach((row) => {
          autoResizableColumns.forEach(({ id, autoResizeValues }) => {
            if (row[id]) {
              if (row[id].length > autoResizeValues.maxCharacters) {
                width[id] = autoResizeValues.maxLength;
              } else {
                if (!width[id]) width[id] = 0;
              }
            }
          });
        });

        autoResizableColumns.forEach((val) => {
          if (width[val.id] === 0) {
            delete colDefs[val.index]["width"];
            columnApi.autoSizeColumn(val.id, true);
          } else {
            colDefs[val.index]["width"] = width[val.id];
          }
        });
        gridApi.setColumnDefs(colDefs);
      }
    }, 400);
  };

  const onColumnResized = (val) => {
    if (val.finished && dragResized) {
      let colDef = val.column.getColDef();
      console.log("colDef", colDef);
      delete colDef.autoResizeValues;
      val.column.setColDef(colDef);
      setDragResized(false);
    }
    if (!val.finished) setDragResized(true);
  };

  return (
    <div className={classNames(theme ? null : "Biz_CustomizedAgGrid", theme ? theme : "ag-theme-blue", className)}>
      {loader}
      <AgGridReact
        onBodyScroll={autoResize}
        onColumnResized={onColumnResized}
        enableRangeSelection={enableRangeSelection ? enableRangeSelection : true}
        rowSelection={rowSelection ? rowSelection : "multiple"}
        rowData={rowData}
        defaultColDef={{
          sortable: true,
          resizable: true,
          enableRowGroup: true,
          enablePivot: true,
          enableValue: true,
        }}
        {...restProps}
      >
        {children}
      </AgGridReact>
    </div>
  );
}

export default DataGrid;

const DataGridColumn = (props) => {
  const { children, ...restProps } = props;
  return <AgGridColumn {...restProps}>{children}</AgGridColumn>;
};

DataGrid.Column = DataGridColumn;

function EditableDataGrid(props) {
  const { className, children, loader, theme, rowData, ...restProps } = props;
  return (
    <div className={classNames(theme ? null : "Biz_CustomizedAgGrid", theme ? theme : "ag-theme-blue", className)}>
      {loader}
      <AgGridReact rowData={rowData} {...restProps}>
        {children}
      </AgGridReact>
    </div>
  );
}

DataGrid.Editable = EditableDataGrid;
