import React from "react";
import { TiTick, TiTimes } from "react-icons/ti";

export const CommonCellTemplate = (props) => {
  return (
    <React.Fragment>
      <span style={{ cursor: "pointer", display: "grid", gridTemplateColumns: "auto max-content", justifyContent: "center" }}>
        {props.value === 1 ? <TiTick style={{ fontSize: "20px", color: "#4caf50" }} /> : props.value === 0 ? <TiTimes style={{ fontSize: "20px", color: "#f64e60" }} /> : "--"}
      </span>
    </React.Fragment>
  );
};
