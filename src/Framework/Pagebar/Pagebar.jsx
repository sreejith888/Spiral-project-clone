import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { PageBarSelectStyle } from "../Widgets/SelectStyle/SelectStyle";
import  "./Pagebar.css";
import classNames from "classnames";

function PageBar(props) {
  const { title, children, className, ...restProps } = props;

  return (
    <React.Fragment>
      <div className='DynBiz_PageTitle' {...restProps}>
        <span>{title}</span>
        <div className='DynBiz_PageTitle_Contentbox'>{children}</div>
      </div>
    </React.Fragment>
  );
}

export default PageBar;

const PageSelect = React.forwardRef((props, ref) => {
  const { label = "", children, width, nolabel, ...restProps } = props;

  return (
    <div style={{ width: width }}>
      <Select
        ref={ref}
        menuPlacement="auto"
        openMenuOnFocus={true}
        isClearable={true}
        menuPosition={"absolute"}
        menuPortalTarget={document.body}
        isSearchable={true}
        className='DynBiz_PageTitle_Select'
        placeholder={`${!nolabel ? "Select" : ""} ${label}`}
        styles={PageBarSelectStyle}
        menuShouldScrollIntoView={false}
        noOptionsMessage={() => "No Result Found"}
        {...restProps}
      />
    </div>
  );
});

PageBar.Select = PageSelect;

const PageSearch = React.forwardRef((props, ref) => {
  const { onClick, focus, btnText = "Search", label = "Search", className, children, disabled = false, ...restPropsProps } = props;

  const firstSearchInput = useRef();
  const [msgAlert, setMsgAlert] = useState({ open: false, type: "", msg: "" });

  useEffect(() => {
    if (firstSearchInput.current) {
      firstSearchInput.current.focus();
    }
  }, [focus]);

  const returnFunction = () => {
    return;
  };

  const ButtonClickFunction = () => {
    onClick ? onClick() : returnFunction();
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      ButtonClickFunction();
    }
  };

  return (
    <React.Fragment>
      {/* {msgAlert.open && <ErrorMessage msgAlert={msgAlert} setMsgAlert={setMsgAlert} />} */}
      <div className='DynBiz_PageTitle_SearchBox'>
        <input
          type="text"
          placeholder={label}
          className='DynBiz_PageTitle_SearchInputBox'
          ref={focus === true ? firstSearchInput : null}
          onKeyDown={(e) => handleKeyDown(e)}
          disabled={disabled}
          {...restPropsProps}
        />
        <button type="button" className='DynBiz_PageTitle_SearchBoxBtn' onClick={() => ButtonClickFunction()} disabled={disabled}>
          {btnText}
        </button>
      </div>
    </React.Fragment>
  );
});

PageBar.Button = function PageButton(props) {
  const { btnText, loader, className, children, ...restProps } = props;

  return (
    <React.Fragment>
      <button type="button" className='DynBiz_PageTitle_Btn' {...restProps}>
        {loader === true ? (
          <div className="DynBiz_btn__spinner">
            <div className="DynBiz_btn__bounce1"></div>
            <div className="DynBiz_btn__bounce2"></div>
            <div className="DynBiz_btn__bounce3"></div>
          </div>
        ) : (
          <React.Fragment>{children}</React.Fragment>
        )}
      </button>
    </React.Fragment>
  );
};

PageBar.SearchButton = function PageSearchButton(props) {
  const { btnText, loader, className, children, ...restProps } = props;

  return (
    <React.Fragment>
      <button type="button" className='DynBiz_PageTitle_SearchBtn' {...restProps}>
        {loader === true ? (
          <div className="DynBiz_btn__spinner">
            <div className="DynBiz_btn__bounce1"></div>
            <div className="DynBiz_btn__bounce2"></div>
            <div className="DynBiz_btn__bounce3"></div>
          </div>
        ) : (
          <React.Fragment>{children}</React.Fragment>
        )}
      </button>
    </React.Fragment>
  );
};

PageBar.ExcelButton = function PageExcelButton(props) {
  const { btnText, loader, className, children, ...restProps } = props;

  return (
    <React.Fragment>
      <button type="button" className='DynBiz_PageTitle_ExcelBtn' {...restProps}>
        {loader === true ? (
          <div className="DynBiz_btn__spinner">
            <div className="DynBiz_btn__bounce1"></div>
            <div className="DynBiz_btn__bounce2"></div>
            <div className="DynBiz_btn__bounce3"></div>
          </div>
        ) : (
          <React.Fragment>{children}</React.Fragment>
        )}
      </button>
    </React.Fragment>
  );
};

const PageInput = React.forwardRef((props, ref) => {
  const { className, ...restProps } = props;

  return (
    <React.Fragment>
      <input className='DynBiz_PageTitle_Inputref' {...restProps} />
    </React.Fragment>
  );
});

PageBar.Search = PageSearch;
PageBar.Input = PageInput;
