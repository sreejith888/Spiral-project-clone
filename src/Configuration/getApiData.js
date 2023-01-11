import { ApiCalling } from "../../APIMethods/Utilities/ApiCalling/ApiCalling";
import { Success } from "./Constants";
import { CustomMsg } from "./customMessage";
import * as Sentry from "@sentry/react";
import ApiCallingOPD from "../API methods/OPDVisit/APICallingOPD";

async function getApiData(request) {
  const { setDatalist, setLoad, requestData, apiPath, setAlert, fun, message = false } = request;
  debugger;
  try {
    setLoad(true);
    const result = await ApiCallingOPD(requestData, apiPath);
    setLoad(false);
    if (result.responseCode === Success) {
      if (result.responseData && Object.values(result.responseData) && Object.values(result.responseData)[0] && Object.values(result.responseData)[0].length > 0) {
        setDatalist(Object.values(result.responseData)[0]);
        console.log(Object.values(result.responseData)[0]);
        if (fun) {
          fun(Object.values(result.responseData)[0]);
        }
      } else {
        setDatalist([]);
      }
      if (message) {
        if (fun) {
          if (Object.values(result.responseData)[0]) {
            fun(Object.values(result.responseData)[0]);
          } else if (Object.values(result.responseData)) {
            fun(Object.values(result.responseData));
          } else {
            fun(Object.values(result.responseData));
          }
        }
        setAlert({ open: true, type: "success", msg: result.responseMessage });
      }
    } else {
      setDatalist([]);
      setAlert({ open: true, type: "error", msg: result.responseMessage });
      console.log(result.responseMessage);
    }
  } catch (error) {
    Sentry.captureException(error);
    setAlert({ open: true, type: "error", msg: CustomMsg.Error });
    console.log(error);
  }
}

export default getApiData;

export async function getApiData2(request) {
  const { setDatalist, setLoad, requestData, apiPath, setAlert, fun, message } = request;
  debugger;
  try {
    setLoad(true);
    const result = await ApiCalling(requestData, apiPath);
    setLoad(false);
    if (result.responseCode === Success) {
      if (result.responseData && Object.values(result.responseData) && Object.values(result.responseData)[0]) {
        setDatalist(Object.values(result.responseData)[0]);
        console.log(Object.values(result.responseData)[0]);
        if (fun) {
          fun(Object.values(result.responseData)[0]);
        }
        if (message) {
          setAlert({ open: true, type: "success", msg: result.responseMessage });
        }
      } else {
        if (fun) {
          fun(Object.values(result.responseData)[0]);
        }
        if (message) {
          setAlert({ open: true, type: "success", msg: result.responseMessage });
        }
        setDatalist([]);
      }
    } else {
      setDatalist([]);
      setAlert({ open: true, type: "error", msg: result.responseMessage });
      console.log(result.responseMessage);
    }
  } catch (error) {
    Sentry.captureException(error);
    setAlert({ open: true, type: "error", msg: CustomMsg.Error });
    console.log(error);
  }
}
