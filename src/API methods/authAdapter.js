import { Buffer } from "buffer";
import axios from "axios";
export const authenticate = async(username,password,companyId)=>{
    try{
        const buff=Buffer.from(`${username}:${password}`);
        const base64String = buff.toString('base64');
        const requestData={
   UserIP : "Example",
   UserAppType : "2",
   UserIMEI : "testimeinumber",
   UserPhone : "Example",
   UserMacAddress: "Example"
        };
        const response= await axios.post("https://identity.spiral.bmcontroller.com/users/authenticate",requestData,{
            headers:
{
   CompanyCode:companyId, 
   Authorization: "Basic" +" "+ base64String,
   "Content-Type": "application/json",
   Accept: "application/json",
   MenuType: "101",
}
        });
        console.log(response);
        if(response.status===200){
            const result=await response.data
            return{
                responseData:result,
                responseCode:1,
                responseMessage:"success"
            }
        }
        if(response.status===401 && 
            response &&
            response.Unauthorized.Errors&&
            response.Unauthorized.Errors[0]&&
            response.Unauthorized.Errors[0].ErrorsMessage
            ){
            return{
                responseData:null,
                responseCode:0,
                responseMessage:response.Unauthorized.errors[0].ErrorsMessage
            }
        }
        return{
            responseData:null,
            responseCode:0,
            responseMessage:"login error"
        }
    }
    catch(error){
        if(error.response.status===401 && 
            error&&
            error.response &&
            error.response.data.Unauthorized&&
            error.response.data.Unauthorized.Errors&&
            error.response.Unauthorized.Errors[0]&&
            error.response.Unauthorized.Errors[0].ErrorsMessage
            ){
            return{
                responseData:null,
                responseCode:0,
                responseMessage: error.response.data.Unauthorized.Errors[0].ErrorMessage,
            }
        }
        return{
            responseData:null,
            responseCode:0,
            responseMessage:"login error"
        }
    }
};


// Request URL
// https://identity.spiral.bmcontroller.com/users/authenticate


// Request JSON
// headers
// {
//    "CompanyCode": "",
//    "Authorization": "Basic Base64 String",
//    "Content-Type": "application/json",
//    "Accept": "application/json",
//    "MenuType": "101",
// }

// body
// {
//    "UserIP" : "",
//    "UserAppType" : "2",
//    "UserIMEI" : "",
//    "UserPhone" : "",
//    "UserMacAddress" : ""
// }


// Example  JSON
// headers
// {
//    "CompanyCode": "Spiral",
//    "Authorization": "Basic NTAwMTI6VGVzdEAxMjM=",
//    "Content-Type": "application/json",
//    "Accept": "application/json"
// }

// body 
// {
//    "UserIP" : "Example",
//    "UserAppType" : "2",
//    "UserIMEI" : "testimeinumber",
//    "UserPhone" : "Example",
//    "UserMacAddress" : "Example"
// }


// Response JSON
// {
//    "AppAccessUID": "50012",
//    "ClientName": "Spiral- Dev",
//    "LoginType": 472,
//    "ApiToken": {
//        "ApiToken": "61941704-3961-43a9-a19d-d18a058409e2",
//        "ExpiryDate": "2022-02-15T15:39:58.7053431+00:00",
//        "ExpirationTime": "01:00:00"
//    },
//    "UserData": {
//        "APIURL": "https://api.spiral.mybiznext.in/",
//        "ClientLogo": "../Test/Test.png",
//        "DateShort": "dd-MM-yyyy",
//        "DateLong": "dd-MM-yyyy HH:mm:ss",
//        "ServerTime": "02/15/2022 14:39:58",
//        "CompanyWeightUOMID": "111001",
//        "UserID": 35,
//        "UserDisplayName": "Test User",
//        "EmployeeCode": "1",
//        "BRCode": "",
//        "AppVersion": "1.0.0",
//        "CountryCode": "1001",
//        "CurrencyCode": "123001",
//        "CurrencyName": "",
//        "ImplementationDate": "10/01/2021 00:00:00",
//        "InventoryRoundOff": "",
//        "InvDecimalPoint": "5",
//        "QuantityType": "BOTH",
//        "InvAllocationCriteria": "1",
//        "GRNInspectionCheck": "YES",
//        "ProdInspectionCheck": "No",
//        "GRNWithoutOutward": "NO",
//        "SaleBudgetBy": "TTB",
//        "ActiveItemWeight": "YES",
//        "ActiveDimension": "YES"
//    },
//    "UserMenu": [],
//    "Module": [
//        {
//            "ModuleID": "901",
//            "ModuleName": "Setup",
//            "ModuleSequence": "1",
//            "IconImage": "Images/Icons/crm.png"
//        },
//        {
//            "ModuleID": "902",
//            "ModuleName": "BRM",
//            "ModuleSequence": "2",
//            "IconImage": "Images/Icons/inventory.png"
//        },
//        {
//            "ModuleID": "903",
//            "ModuleName": "PPM",
//            "ModuleSequence": "3",
//            "IconImage": "Images/Icons/purchase.png"
//        },
//        {
//            "ModuleID": "904",
//            "ModuleName": "IMM",
//            "ModuleSequence": "4",
//            "IconImage": "Images/Icons/sale.png"
//        },
//        {
//            "ModuleID": "905",
//            "ModuleName": "PPC",
//            "ModuleSequence": "5",
//            "IconImage": "Images/Icons/adminaccess.png"
//        },
//        {
//            "ModuleID": "906",
//            "ModuleName": "SDR",
//            "ModuleSequence": "6",
//            "IconImage": "Images/Icons/businessanalysis.png"
//        },
//        {
//            "ModuleID": "908",
//            "ModuleName": "FAC",
//            "ModuleSequence": "8",
//            "IconImage": "Images/Icons/financeaccount.png"
//        },
//        {
//            "ModuleID": "909",
//            "ModuleName": "HRMS",
//            "ModuleSequence": "9",
//            "IconImage": "Images/Icons/production.png"
//        },
//        {
//            "ModuleID": "910",
//            "ModuleName": "QAC",
//            "ModuleSequence": "10",
//            "IconImage": "Images/Icons/hrms.png"
//        },
//        {
//            "ModuleID": "911",
//            "ModuleName": "MIS",
//            "ModuleSequence": "11",
//            "IconImage": ""
//        },
//        {
//            "ModuleID": "914",
//            "ModuleName": "PPS",
//            "ModuleSequence": "14",
//            "IconImage": ""
//        },
//        {
//            "ModuleID": "915",
//            "ModuleName": "CRM",
//            "ModuleSequence": "15",
//            "IconImage": ""
//        },
//        {
//            "ModuleID": "917",
//            "ModuleName": "HIMS",
//            "ModuleSequence": "17",
//            "IconImage": ""
//        }
//    ]
// }

