import * as Sentry from "@sentry/react";
import { ProcedureAndPackageApiCalling } from "../APIEndpoints/ProcedureAndPackageApiCalling";

async function getProcedureAndPackageApiData(request) {
  const { setDatalist, setLoad, requestData, apiPath, setAlert, fun, message, name, direct, other } = request;
  debugger;

  try {
    if (name) {
      setLoad(name && name, true);
    } else {
      setLoad(true);
    }
    const result = await ProcedureAndPackageApiCalling(requestData, apiPath);
    if (name) {
      setLoad(name && name, false);
    } else {
      setLoad(false);
    }
    if (result.responseCode === '1') {
      if (result.responseData && Object.values(result.responseData) && Object.values(result.responseData)[0]) {
        debugger;
        if (name) {
          setDatalist(name, direct ? result.responseData : Object.values(result.responseData)[0]);
          console.log(name, direct ? result.responseData : Object.values(result.responseData)[0]);
        } else {
          setDatalist(direct ? result.responseData : Object.values(result.responseData)[0]);
          console.log(direct ? result.responseData : Object.values(result.responseData)[0]);
        }
        if (fun) {
          if (name) {
            fun(name && name, direct ? result.responseData : Object.values(result.responseData)[0], other && other);
          } else {
            fun(direct ? result.responseData : Object.values(result.responseData)[0], other && other);
          }
        }
        if (message) {
          setAlert({ open: true, type: "success", message: result.responseMessage });
        }
      } else {
        if (fun) {
          if (name) {
            fun(name && name, direct ? result.responseData : Object.values(result.responseData)[0], other && other);
          } else {
            fun(direct ? result.responseData : Object.values(result.responseData)[0], other && other);
          }
        }
        if (message) {
          setAlert({ open: true, type: "success", message: result.responseMessage });
        }
        if (name) {
          setDatalist(name && name, []);
        } else {
          setDatalist([]);
        }
      }
    } else {
      if (name) {
        setDatalist(name && name, []);
      } else {
        setDatalist([]);
      }
      setAlert({ open: true, type: "error", message: result.responseMessage });
      console.log(result.responseMessage);
    }
  } catch (error) {
    Sentry.captureException(error);
    setAlert({ open: true, type: "error", message: 'Error' });
    console.log(error);
  }
}

export default getProcedureAndPackageApiData;
