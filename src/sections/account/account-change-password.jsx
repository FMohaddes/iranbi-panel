import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import {
  zodResolver
} from "@hookform/resolvers/zod";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import LoadingButton
  from "@mui/lab/LoadingButton";
import InputAdornment
  from "@mui/material/InputAdornment";

import {
  useBoolean
} from "src/hooks/use-boolean";

import { toast } from "src/components/snackbar";
import { Iconify } from "src/components/iconify";
import {
  Form , Field
} from "src/components/hook-form";

import axios , {
  endpoints
} from "../../utils/axios";

export const ChangePassWordSchema = zod
  .object( {
    Password        : zod
      .string()
      .min( 1 , { message : `رمزعبور فعلی الزامی است!` } )
      .min( 6 , { message : `رمزعبور حداقل 6 کاراکتری است!` } ) ,
    newPassword        : zod.string().min( 1 , { message : "رمزعبور جدید الزامی است." } ) ,
    confirmNewPassword : zod.string().min( 1 , { message : "تایید رمزعبور جدید الزامی است!" } ) ,
  } )
  .refine( ( data ) => data.Password !== data.newPassword , {
    message : `رمزعبور جدید باید با نمونه قبلی تفاوت داشته باشد` ,
    path    : [ "newPassword" ] ,
  } )
  .refine( ( data ) => data.newPassword === data.confirmNewPassword , {
    message : `رمزعبور با تایید رمزعبور یکسان نمیباشد` ,
    path    : [ "confirmNewPassword" ] ,
  } );

// ----------------------------------------------------------------------

export function AccountChangePassword() {
  const password = useBoolean();

  const defaultValues = {
    Password        : "" ,
    newPassword        : "" ,
    confirmNewPassword : ""
  };

  const methods = useForm( {
    mode     : "all" ,
    resolver : zodResolver( ChangePassWordSchema ) ,
    defaultValues ,
  } );

  const {
    reset ,
    handleSubmit ,
    formState : { isSubmitting } ,
  } = methods;

  const onSubmit = handleSubmit( async( data ) => {
    try {
      const res = await axios.patch(endpoints.user.updateCurrent, { ...data });
      reset();
      toast.success('آپدیت با موفقیت آنجام شد!');

    }
    catch(error) {
      console.error( error );
    }
  } );

  return ( <Form methods = { methods }
      onSubmit = { onSubmit } >
      <Card sx = { {
        p             : 3 ,
        gap           : 3 ,
        display       : "flex" ,
        flexDirection : "column"
      } } >
        <Field.Text
          name = "Password"
          type = { password.value ? "text" : "password" }
          label = "رمزعبور فعلی"
          InputProps = { {
            endAdornment : (
              <InputAdornment position = "end" >
                <IconButton
                  onClick = { password.onToggle }
                  edge = "end" >
                  <Iconify
                    icon = { password.value ? "solar:eye-bold" : "solar:eye-closed-bold" } />
                </IconButton >
              </InputAdornment > ) ,
          } }
        />

        <Field.Text
          name = "newPassword"
          label = "رمزعبور جدید"
          type = { password.value ? "text" : "password" }
          InputProps = { {
            endAdornment : (
              <InputAdornment position = "end" >
                <IconButton
                  onClick = { password.onToggle }
                  edge = "end" >
                  <Iconify
                    icon = { password.value ? "solar:eye-bold" : "solar:eye-closed-bold" } />
                </IconButton >
              </InputAdornment > ) ,
          } }
          helperText = { <Stack component = "span"
            direction = "row"
            alignItems = "center" >
            <Iconify icon = "eva:info-fill"
              width = { 16 }
              sx = { { mr : 0.5 } } /> رمزعبور جدید حداقل +6 کاراکتری میباشد
          </Stack > }
        />

        <Field.Text
          name = "confirmNewPassword"
          type = { password.value ? "text" : "password" }
          label = "تایید رمزعبور جدید"
          InputProps = { {
            endAdornment : (
              <InputAdornment position = "end" >
                <IconButton
                  onClick = { password.onToggle }
                  edge = "end" >
                  <Iconify
                    icon = { password.value ? "solar:eye-bold" : "solar:eye-closed-bold" } />
                </IconButton >
              </InputAdornment > ) ,
          } }
        />

        <LoadingButton type = "submit"
          variant = "contained"
          loading = { isSubmitting }
          sx = { { ml : "auto" } } >
          ذخیره تغییرات
        </LoadingButton >
      </Card >
    </Form > );
}
