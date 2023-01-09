import * as Sentry from "@sentry/react";
import  CustomMsg  from "../../../../../API methods/Utilities/CustomMsg";
import { ProcedureAndPackageApiCalling } from "../../../../ProcedureAndPackage/APIEndpoints/ProcedureAndPackageApiCalling";

async function getOPDBillingApiData(request) {
  const { setDatalist, setLoad, requestData, apiPath, setAlert, fun, message, name, direct, other } = request;
  debugger;

  try {
    setLoad(name, true);
    const result = await ProcedureAndPackageApiCalling(requestData, apiPath);
    setLoad(name, false);
    if (result.responseCode === "1") {
      if (result.responseData && Object.values(result.responseData) && Object.values(result.responseData)[0]) {
        debugger;
        setDatalist(name, direct ? result.responseData : Object.values(result.responseData)[0]);
        console.log(name, direct ? result.responseData : Object.values(result.responseData)[0]);
        if (fun) {
          fun(name, direct ? result.responseData : Object.values(result.responseData)[0], other && other);
        }
        if (message) {
          setAlert({ open: true, type: "success", message: result.responseMessage });
        }
      } else {
        if (fun) {
          fun(name, direct ? result.responseData : Object.values(result.responseData)[0], other && other);
        }
        if (message) {
          setAlert({ open: true, type: "success", message: result.responseMessage });
        }
        setDatalist(name, []);
      }
    } else {
      setDatalist(name, []);
      setAlert({ open: true, type: "error", message: result.responseMessage });
      console.log(result.responseMessage);
    }
  } catch (error) {
    Sentry.captureException(error);
    setAlert({ open: true, type: "error", message: CustomMsg.Error });
    console.log(error);
  }
}

export default getOPDBillingApiData;
