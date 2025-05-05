import { mutate } from "swr";
import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { useEffect , useContext } from "react";
import {
  zodResolver
} from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton
  from "@mui/lab/LoadingButton";

import { toast } from "src/components/snackbar";
import {
  Form , Field
} from "src/components/hook-form";

import axios , {
  endpoints
} from "../../utils/axios";
import {
  AuthContext
} from "../../auth/context/auth-context";

// ----------------------------------------------------------------------

export const UpdateUserSchema = zod.object( {
  Username  : zod.string().min( 1 , { message : "نام کاربری الزامی است" } ) ,
  Email     : zod
    .string()
    .min( 1 , { message : " ایمیل الزامی است" } )
    .email( { message : "ایمیل باید یک آدرس معتبر باشد" } ) ,
  FirstName : zod.string().min( 1 , { message : "نام الزامی است" } ) ,
  LastName  : zod.string().min( 1 , { message : "نام خانوادگی الزامی است" } ) ,
} );

export function AccountGeneral() {
  const {
    user , updateUser
  } = useContext( AuthContext );

  const defaultValues = {
    Username  : "" ,
    Email     : "" ,
    FirstName : "" ,
    LastName  : "" ,
  };

  const methods = useForm( {
    mode     : "all" ,
    resolver : zodResolver( UpdateUserSchema ) ,
    defaultValues ,
  } );

  const {
    handleSubmit ,
    reset ,
    formState : { isSubmitting } ,
  } = methods;

  useEffect( () => {
    const resetValue = {
      Username  : user?.Username || "" ,
      Email     : user?.Email || "" ,
      FirstName : user?.FirstName || "" ,
      LastName  : user?.LastName || "" ,
    }
    reset( resetValue );

  } , [ user , reset ] );

  const onSubmit = handleSubmit( async( data ) => {
    try {
      const res = await axios.patch( endpoints.user.updateCurrent , { ...data } );
      toast.success( "آپدیت با موفقیت آنجام شد!" );

      updateUser( {
        Username  : data.Username ,
        Email     : data.Email ,
        FirstName : data.FirstName ,
        LastName  : data.LastName ,
      } );
      mutate( endpoints.auth.me )
    }
    catch(error) {
      console.error( error );
    }
  } );

  return ( <Form methods = { methods }
    onSubmit = { onSubmit } >
    <Grid container spacing = { 3 } >

      <Grid xs = { 12 } md = { 12 } >
        <Card sx = { { p : 3 } } >
          <Box
            rowGap = { 3 }
            columnGap = { 2 }
            display = "grid"
            gridTemplateColumns = { {
              xs : "repeat(1, 1fr)" ,
              sm : "repeat(2, 1fr)" ,
            } }
          >
            <Field.Text name = "Username"
              label = "نام کاربری" />
            <Field.Text name = "Email"
              label = "آدرس ایمیل" />
            <Field.Text name = "FirstName"
              label = "نام" />
            <Field.Text name = "LastName"
              label = "نام خانوادگی" />
          </Box >

          <Stack spacing = { 3 }
            alignItems = "flex-end"
            sx = { { mt : 3 } } >

            <LoadingButton type = "submit"
              variant = "contained"
              loading = { isSubmitting } >
              ذخیره تغییرات
            </LoadingButton >
          </Stack >
        </Card >
      </Grid >
    </Grid >
  </Form > );
}
