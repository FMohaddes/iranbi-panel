"use client";

// core (MUI)
import {
  faIR as faIRCore ,
} from "@mui/material/locale";
// date pickers (MUI)
import {
  enUS as enUSDate , faIR as faIRDate ,
} from "@mui/x-date-pickers/locales";
// data grid (MUI)
import {
  enUS as enUSDataGrid , faIR as faIRDataGrid ,
} from "@mui/x-data-grid/locales";

// ----------------------------------------------------------------------

export const allLangs = [ {
  value         : "fa" ,
  label         : "Persian" ,
  countryCode   : "IR" ,
  adapterLocale : "fa" ,
  numberFormat  : {
    code     : "fa-IR" ,
    currency : "IRR"
  } ,
  systemValue   : {
    components : { ...faIRCore.components , ...faIRDate.components , ...faIRDataGrid.components } ,

  } ,
} , {
  value         : "en" ,
  label         : "English" ,
  countryCode   : "GB" ,
  adapterLocale : "en" ,
  numberFormat  : {
    code     : "en-US" ,
    currency : "USD"
  } ,
  systemValue   : {
    components : { ...enUSDate.components , ...enUSDataGrid.components } ,
  } ,
} ,

];

/**
 * Country code:
 * https://flagcdn.com/en/codes.json
 *
 * Number format code:
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */
