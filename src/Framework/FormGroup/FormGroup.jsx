import React, { useEffect, useRef } from "react";
import BizClass from "./FormGroup.module.scss";
import classNames from "classnames";
import Select from "react-select";
import { ReactSelectStyle, ReactMultiSelectStyle } from "../Widgets/SelectStyle/SelectStyle";
import { FormStyle, FormGroupStyle, InputGroupStyle, FormBoxGroupStyle, FormCustomGroupStyle, InputLabelStyle } from "./FormGroupStyle";

export default function Form(props) {
  const { children, ...restProps } = props;
  return <FormStyle {...restProps}>{children}</FormStyle>;
}

Form.Group = function FormGroup(props) {
  const { column = 1, padding = 0, minwidth = "60px", controlwidth, children, ...restProps } = props;
  return (
    <FormGroupStyle column={column} padding={padding} minwidth={minwidth} controlwidth={controlwidth} {...restProps}>
      {children}
    </FormGroupStyle>
  );
};

Form.BoxGroup = function FormBoxGroup(props) {
  const { column = 1, padding = 8, minwidth = "50px", title, controlwidth, children, ...restProps } = props;

  return (
    <FormBoxGroupStyle className={classNames(BizClass.BoxGroup)} title={title}>
      {title ? <h2 className={BizClass.BoxGroupTxt}>{title}</h2> : null}
      <FormGroupStyle column={column} padding={padding} minwidth={minwidth} controlwidth={controlwidth} {...restProps}>
        {children}
      </FormGroupStyle>
    </FormBoxGroupStyle>
  );
};

Form.CustomGroup = function FormCustomGroup(props) {
  const { column, row, columntemplate, children, ...restProps } = props;

  return (
    <FormCustomGroupStyle column={column} row={row} columntemplate={columntemplate} {...restProps}>
      {children}
    </FormCustomGroupStyle>
  );
};

Form.InputGroup = function FormInputGroup(props) {
  const { errorMsg, req, label, columnstart, rowstart, column, row = 0, children, ...restProps } = props;

  return (
    <div className={classNames(BizClass.InputGroupBox, errorMsg ? BizClass.InputErrorMsgBox : null, row ? BizClass.ControlRowSpan : null)}>
      {label ? (
        <InputLabelStyle
          className={classNames(BizClass.InputLabel, req === true ? BizClass.InputReqLabel : null)}
          columnstart={columnstart}
          rowstart={rowstart}
          column={column}
          row={row}
        >
          {label}
        </InputLabelStyle>
      ) : null}
      {children && (
        <InputGroupStyle className={BizClass.InputGroup} columnstart={columnstart} rowstart={rowstart} column={column} row={row} {...restProps}>
          {children}
          {errorMsg && <span className={BizClass.ErrorMsg}>{errorMsg}</span>}
        </InputGroupStyle>
      )}
    </div>
  );
};

const FormInputControl = React.forwardRef((props, ref) => {
  const {
    control,
    className,
    label = "",
    focus,
    isClearable,
    isSearchable,
    menuPlacement,
    noOptionsMessage,
    getOptionValue,
    getOptionLabel,
    isLoading,
    styles,
    width,
    prefix,
    ...restProps
  } = props;

  const firstFormInput = useRef();

  useEffect(() => {
    if (firstFormInput.current) {
      firstFormInput.current.focus();
    }
  }, [focus]);

  let InputControl = "";
  switch (control) {
    case "input":
      InputControl = <input className={classNames(BizClass.InputControl, className)} placeholder={label} ref={focus === true ? firstFormInput : ref} {...restProps} />;
      break;
    case "textarea":
      InputControl = (
        <textarea
          className={classNames(BizClass.InputControl, className)}
          placeholder={label}
          style={{ resize: "none" }}
          ref={focus === true ? firstFormInput : ref}
          {...restProps}
        ></textarea>
      );
      break;
    case "select":
      InputControl = (
        <div style={{ width: width }}>
          <Select
            {...restProps}
            ref={focus === true ? firstFormInput : ref}
            classNamePrefix="BizN__"
            menuPortalTarget={document.body}
            menuPosition={"absolute"}
            menuShouldScrollIntoView={false}
            getOptionValue={getOptionValue}
            getOptionLabel={getOptionLabel}
            isLoading={isLoading}
            styles={styles ? styles : ReactSelectStyle}
            menuPlacement={menuPlacement ? menuPlacement : "auto"}
            isClearable={isClearable === false ? isClearable : true}
            isSearchable={isSearchable === false ? isSearchable : true}
            placeholder={prefix === false ? label : `Select ${label}`}
            noOptionsMessage={() => (noOptionsMessage ? noOptionsMessage : "No Result Found")}
          />
        </div>
      );
      break;
    case "multiselect":
      InputControl = (
        <div style={{ width: width }}>
        <Select
          {...restProps}
          isMulti
          ref={focus === true ? firstFormInput : ref}
          classNamePrefix="BizN__"
          menuPortalTarget={document.body}
          menuPosition={"absolute"}
          menuShouldScrollIntoView={false}
          getOptionValue={getOptionValue}
          getOptionLabel={getOptionLabel}
          isLoading={isLoading}
          styles={styles ? styles : ReactMultiSelectStyle}
          menuPlacement={menuPlacement ? menuPlacement : "auto"}
          isClearable={isClearable === false ? isClearable : true}
          isSearchable={isSearchable === false ? isSearchable : true}
          placeholder={prefix === false ? label : `Select ${label}`}
          noOptionsMessage={() => (noOptionsMessage ? noOptionsMessage : "No Result Found")}
        />
        </div>
      );
      break;
    case "maskedinput":
      InputControl = <input className={classNames(BizClass.InputControl, className)} {...restProps} />;
      break;
    case "checkbox":
      InputControl = <input className={classNames(className)} type="checkbox" ref={focus === true ? firstFormInput : ref} {...restProps} />;
      break;
    case "radio":
      InputControl = <input className={classNames(className)} type="radio" ref={focus === true ? firstFormInput : ref} {...restProps} />;
      break;
    case "switch":
      InputControl = (
        <label className={BizClass.Switch}>
          <input className={classNames(BizClass.Switch_input, className)} type="checkbox" ref={focus === true ? firstFormInput : ref} {...restProps} />
          <span className={BizClass.Switch_label}></span>
          <span className={BizClass.Switch_handle}></span>
        </label>
      );
      break;
    default:
      break;
  }

  return <React.Fragment>{InputControl}</React.Fragment>;
});

Form.InputControl = FormInputControl;
