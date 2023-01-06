export const PageBarSelectStyle = {
  menuPortal: (base) => ({ ...base, zIndex: "9999999999 !important" }),

  control: (provided, state) => ({
    ...provided,
    background: state.isDisabled ? "#e9ecef !important" : "#fff!important",
    minHeight: "26px!important",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(0 125 250 / 30%)" : null,
    borderColor: state.isFocused ? "#0071e3" : "#D6DBDF!important",
    fontSize: "12px!important",
    padding: "0px 0px 0px 6px!important",
    color: "#3f4254!important",
    borderRadius: "0px !important",
  }),

  valueContainer: (provided) => ({
    ...provided,
    height: "26px!important",
    padding: "0 6px 0 2px!important",
  }),

  input: (provided) => ({
    ...provided,
    margin: "0px!important",
    fontSize: "12px!important",
    color: "#3f4254",
  }),

  placeholder: (provided) => ({
    ...provided,
    margin: "0px!important",
    fontSize: "12px!important",
    color: "#3f4254!important",
  }),

  indicatorsContainer: (provided) => ({
    ...provided,
    height: "26px!important",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#50c6d0" : null,
    color: state.isSelected ? "#fff" : "#3f4254",
    backgroundColor: state.isFocused ? "#50c6d0" : null,
    color: state.isFocused ? "#fff" : "#3f4254",
    fontSize: "12px!important",
    padding: "6px 12px 5px 12px!important",
    fontWeight: "400",
    fontFamily: "Poppins, Helvetica, 'sans-serif'",
    borderRadius: "2px !important",
  }),

  noOptionsMessage: (provided) => ({
    ...provided,
    fontSize: "12px!important",
    padding: "5px 8px!important",
    color: "#3f4254!important",
  }),

  menu: (provided) => ({
    ...provided,
    padding: "1px 4px",
    zIndex: "99999999",
    position: "absolute",
    borderRadius: "0px !important",
    marginTop: "-0.2px !important",
  }),
};