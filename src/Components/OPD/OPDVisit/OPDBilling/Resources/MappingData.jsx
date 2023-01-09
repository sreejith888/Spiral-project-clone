import { FaMoneyCheck } from "react-icons/fa";
import { MdDoubleArrow, MdPayment } from "react-icons/md";
import { RiBankFill } from "react-icons/ri";
import { BsCashStack } from "react-icons/bs";
import * as CONSTANT from "./Constant";
// import { dateToCompanyFormat } from "Configration/Utilities/dateFormat";
// import { getAgeCalculatedFromDOBWithLabel } from "Configration/Utilities/AgeCalculator";

export const amountPaymentControls = {
  LABEL: "Amount",
  CONTROL: "input",
  MAX_LENGTH: 50,
  REQUIRED: true,
  NAME: "txtRecieptAmount",
};

export const remarkPaymentControls = {
  LABEL: "Remark",
  CONTROL: "textarea",
  MAX_LENGTH: 200,
  REQUIRED: false,
  NAME: "txtPaymentRemark",
};

export const paymentType = [
  {
    ID: CONSTANT.CASH_PAYMENT,
    NAME: "Cash",
    ICON: <BsCashStack />,
    CONTROLS: [],
  },
  {
    ID: CONSTANT.CHEQUE_PAYMENT,
    NAME: "Cheque",
    ICON: <FaMoneyCheck />,
    CONTROLS: [
      {
        LABEL: "Bank Name",
        CONTROL: "select",
        TYPE: null,
        MAX_LENGTH: 50,
        REQUIRED: true,
        OPTION_LABEL: "BankMasterName",
        NAME: "txtBankName",
      },
      {
        LABEL: "Cheque No",
        CONTROL: "input",
        TYPE: null,
        MAX_LENGTH: 30,
        REQUIRED: true,
        OPTION_LABEL: "",
        NAME: "txtChequeDDNo",
      },
      {
        LABEL: "Cheque Date",
        CONTROL: "input",
        TYPE: "date",
        MAX_LENGTH: 4,
        REQUIRED: true,
        OPTION_LABEL: "",
        NAME: "txtChequeDDDate",
      },
    ],
  },
  {
    ID: CONSTANT.CREDIT_DEBIT_CARD_PAYMENT,
    NAME: "Cards (Credit/Debit)",
    ICON: <MdPayment />,
    CONTROLS: [
      {
        LABEL: "Card Type",
        CONTROL: "select",
        TYPE: null,
        MAX_LENGTH: 50,
        REQUIRED: true,
        OPTION_LABEL: "CommonMasterValue",
        NAME: "txtCardType",
      },
      {
        LABEL: "Card No",
        CONTROL: "input",
        TYPE: null,
        MAX_LENGTH: 4,
        REQUIRED: true,
        OPTION_LABEL: "",
        NAME: "txtCardNo",
      },
      {
        LABEL: "Name on Card",
        CONTROL: "input",
        TYPE: null,
        MAX_LENGTH: 50,
        REQUIRED: true,
        OPTION_LABEL: "",
        NAME: "txtNameOnCard",
      },
      {
        LABEL: "UTR Code",
        CONTROL: "input",
        TYPE: null,
        MAX_LENGTH: 50,
        REQUIRED: true,
        OPTION_LABEL: "",
        NAME: "txtUTRCode",
      },
    ],
  },
  {
    ID: CONSTANT.NEFT_RTGS_PAYMENT,
    NAME: "NEFT/RTGS",
    ICON: <RiBankFill />,
    CONTROLS: [
      {
        LABEL: "Bank Name",
        CONTROL: "select",
        TYPE: null,
        MAX_LENGTH: 50,
        REQUIRED: true,
        OPTION_LABEL: "BankMasterName",
        NAME: "txtBankName",
      },
      {
        LABEL: "UTR Code",
        CONTROL: "input",
        TYPE: null,
        MAX_LENGTH: 50,
        REQUIRED: true,
        OPTION_LABEL: "",
        NAME: "txtUTRCode",
      },
    ],
  },
  {
    ID: CONSTANT.UPI_PAYMENT,
    NAME: "UPI",
    ICON: <MdDoubleArrow />,
    CONTROLS: [
      {
        LABEL: "UTR Code",
        CONTROL: "input",
        TYPE: null,
        MAX_LENGTH: 50,
        REQUIRED: true,
        OPTION_LABEL: "",
        NAME: "txtUTRCode",
      },
    ],
  },
];

export const userDataFieldMapping = [
  {
    CLASSNAME: "FirstRow",
    FIELDBINDING: [
      {
        DISPLAYNAME: "Patient Name",
        BINDING: [
          { BINDINGNAME: "PFirstName", SEPERATOR: "", FUNCTION: null },
          { BINDINGNAME: "PLastName", SEPERATOR: " ", FUNCTION: null },
        ],
      },
      {
        DISPLAYNAME: "MRD NO",
        BINDING: [{ BINDINGNAME: "HosMRDNo", SEPERATOR: "", FUNCTION: null }],
      },
      {
        DISPLAYNAME: "Gender",
        BINDING: [{ BINDINGNAME: "Gender", SEPERATOR: "", FUNCTION: null }],
      },
      {
        DISPLAYNAME: "D.O.B",
        BINDING: [{ BINDINGNAME: "DateofBirth", SEPERATOR: "", FUNCTION: dateToCompanyFormat }],
      },

      {
        DISPLAYNAME: "AGE",
        BINDING: [{ BINDINGNAME: "DateofBirth", SEPERATOR: "", FUNCTION: getAgeCalculatedFromDOBWithLabel }],
      },
    ],
  },
  {
    CLASSNAME: "SecondRow",
    FIELDBINDING: [
      {
        DISPLAYNAME: "OPD Visit No",
        BINDING: [{ BINDINGNAME: "OPNo", SEPERATOR: "", FUNCTION: null }],
      },
      {
        DISPLAYNAME: "Visit Date",
        BINDING: [{ BINDINGNAME: "VisitDate", SEPERATOR: "", FUNCTION: dateToCompanyFormat }],
      },
      {
        DISPLAYNAME: "Payer Type",
        BINDING: [{ BINDINGNAME: "PayerTypeName", SEPERATOR: "", FUNCTION: null }],
      },

      {
        DISPLAYNAME: "Payer Name",
        BINDING: [{ BINDINGNAME: "PayerName", SEPERATOR: "", FUNCTION: null }],
      },

      {
        DISPLAYNAME: "Payment Type",
        BINDING: [{ BINDINGNAME: "PaymentType", SEPERATOR: "", FUNCTION: null }],
      },

      {
        DISPLAYNAME: "Ward Name",
        BINDING: [{ BINDINGNAME: "WardMasterName", SEPERATOR: "", FUNCTION: null }],
      },
    ],
  },
];

export const itemGridFieldMapping = [
  {
    DISPLAYNAME: "Item",
    CONTROL_BINDING: [
      {
        LABEL: "Item",
        OPTION_LABEL: "BNItemNo",
        SEPERATOR: " | ",
        OPTION_LABEL2: "ItemMasterName",
        CONTROL: "select",
        MAX_LENGTH: "",
        NAME: "txtItem",
        REF: true,
      },
    ],
  },
  {
    DISPLAYNAME: "Desciption",
    CONTROL: false,
    NAME: "txtDescription",
  },
  {
    DISPLAYNAME: "Qty",
    CONTROL_BINDING: [
      {
        LABEL: "",
        CONTROL: "input",
        MAX_LENGTH: 4,
        NAME: "txtQuantity",
      },
    ],
  },
  {
    DISPLAYNAME: "Rate",
    CONTROL_BINDING: [
      {
        LABEL: "",
        CONTROL: "input",
        MAX_LENGTH: 6,
        NAME: "txtRate",
      },
    ],
  },
  {
    DISPLAYNAME: "Amount",
    CONTROL: false,
    NAME: "txtAmount",
    CLASSNAME: "ItemGridText",
  },
  {
    DISPLAYNAME: "Discount",
    CLASSNAME: "DiscountBox",
    CONTROL_BINDING: [
      {
        LABEL: "",
        OPTION_LABEL: "label",
        CONTROL: "select",
        MAX_LENGTH: 4,
        NOLABEL: false,
        IS_CLEARABLE: false,
        IS_SEARCHABLE: false,
        NAME: "txtDiscountType",
      },
      {
        LABEL: "",
        CONTROL: "input",
        MAX_LENGTH: 6,
        NAME: "txtDiscountValue",
      },
    ],
  },
  {
    DISPLAYNAME: "Total Amount",
    CONTROL: false,
    NAME: "txtTotalAmount",
    CLASSNAME: "ItemGridText",
  },
  {
    CONTROL: "button",
  },
];

export const itemGridValueMapping = [
  {
    DISPLAYNAME: "Item",
    CLASSNAME: "",
    VALUE_BINDING: [
      {
        VALUE_NAME: "txtItem",
        VALUE_NAME1: "ItemMasterName",
      },
    ],
  },
  {
    DISPLAYNAME: "Desciption",
    CLASSNAME: "",
    VALUE_BINDING: [
      {
        VALUE_NAME: "txtDescription",
      },
    ],
  },
  {
    DISPLAYNAME: "Qty",
    CLASSNAME: "ItemGridText",
    VALUE_BINDING: [
      {
        VALUE_NAME: "txtQuantity",
      },
    ],
  },
  {
    DISPLAYNAME: "Rate",
    CLASSNAME: "ItemGridText",
    VALUE_BINDING: [
      {
        VALUE_NAME: "txtRate",
      },
    ],
  },
  {
    DISPLAYNAME: "Amount",
    CLASSNAME: "ItemGridText",
    VALUE_BINDING: [
      {
        VALUE_NAME: "txtAmount",
      },
    ],
  },
  {
    DISPLAYNAME: "Discount",
    CLASSNAME: "ItemGridText",
    VALUE_BINDING: [
      {
        VALUE_NAME: "txtDiscountValue",
      },
      {
        VALUE_NAME: "txtDiscountType",
        VALUE_NAME1: "Vlabel",
      },
    ],
  },
  {
    DISPLAYNAME: "Total Amount",
    CLASSNAME: "ItemGridText",
    VALUE_BINDING: [
      {
        VALUE_NAME: "txtTotalAmount",
      },
    ],
  },
  {
    CONTROL: "button",
  },
];

export const itemTotalFooterBarMapping = [
  {
    DISPLAYNAME: "Amount",
    NAME: "txtInvoiceSubTotalAmount",
  },
  {
    DISPLAYNAME: "Discount",
    NAME: "txtInvoiceTotalDiscount",
  },
  {
    DISPLAYNAME: "Total Amt",
    NAME: "txtInvoiceTotalAmount",
  },
];
