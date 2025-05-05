import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import {
  zodResolver
} from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import LoadingButton
  from "@mui/lab/LoadingButton";
import InputAdornment
  from "@mui/material/InputAdornment";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { toast } from "src/components/snackbar";
import {
  Form , Field
} from "src/components/hook-form";

import {
  Iconify
} from "../../components/iconify";
import {
  useBoolean
} from "../../hooks/use-boolean";
import axios , {
  endpoints
} from "../../utils/axios";

// ----------------------------------------------------------------------

export const NewUserSchema = ( isEdit ) => zod.object( {
  Username     : zod.string()
                    .min( 1 , { message : "نام کاربری الزامی است" } )
                    .regex( /^[A-Za-z0-9]*$/ , { message : "نام کاربری باید فقط شامل حروف و اعداد انگلیسی باشد" } ) ,
  Email        : zod
    .string()
    .min( 1 , { message : " ایمیل الزامی است" } )
    .email( { message : "ایمیل باید یک آدرس معتبر باشد" } ) ,
  FirstName    : zod.string().min( 1 , { message : "نام الزامی است" } ) ,
  LastName     : zod.string().min( 1 , { message : "نام خانوادگی الزامی است" } ) ,
  RoleID       : zod.union( [ zod.string() , zod.number() ] ).refine( ( value ) => value !== null && value !== "" , { message : "نقش الزامی است" } ) ,
  PasswordHash : isEdit ? zod.string().optional() : zod.string().min( 1 , { message : "رمز عبور الزامی است" } ) ,
} );

// ----------------------------------------------------------------------

export function UserNewEditForm( {
                                   currentItem ,
                                   userRoles
                                 } ) {
  const router = useRouter();
  const PasswordHash = useBoolean();
  const isEdit = !!currentItem;
  const defaultValues = {
    Username     : "" ,
    PasswordHash : "" ,
    RoleID       : null ,
    Email        : "" ,
    FirstName    : "" ,
    LastName     : "" ,
  }
  const methods = useForm( {
    mode     : "onSubmit" ,
    resolver : zodResolver( NewUserSchema( isEdit ) ) ,
    defaultValues ,
  } );

  const {
    reset ,
    watch ,
    handleSubmit ,
    formState : { isSubmitting } ,
  } = methods;

  const onSubmit = handleSubmit( async( data ) => {
    const url = endpoints.user.new
    const method =  "post"
    try {
      const res = await axios( {
        method , url , data : { ...data }
      } );

      if( res?.status === 200 ) {
        reset();
        toast.success(  "ساخت با موفقیت آنجام شد!" );
        router.push( paths.dashboard.user.list );
      }
    }
    catch(error) {
      toast.error( error );
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
              <Field.Text name = "FirstName"
                label = "نام"
                disabled = { currentItem } autoComplete="on"/>
              <Field.Text name = "LastName"
                label = "نام خانوادگی"
                disabled = { currentItem } autoComplete="on"/>
              <Field.Text name = "Email"
                label = "آدرس ایمیل"
                disabled = { currentItem } autoComplete="on"/>
              <Field.Text name = "Username"
                label = "نام کاربری"
                disabled = { currentItem } />

                <Field.Text name = "PasswordHash"
                  label = "رمزعبور"
                  type = { PasswordHash.value ? "text" : "password" }
                  InputProps = { {
                    endAdornment : (
                      <InputAdornment
                        position = "end" >
                        <IconButton
                          onClick = { PasswordHash.onToggle }
                          edge = "end" >
                          <Iconify
                            icon = { PasswordHash.value ? "solar:eye-bold" : "solar:eye-closed-bold" } />
                        </IconButton >
                      </InputAdornment > ) ,
                  } }
                />

              <TextField
                fullWidth
                select
                label = "نقش"
                name = "RoleID"
                value = { watch( "RoleID" ) || "" }
                onChange = { ( event ) => methods.setValue( "RoleID" , event.target.value ) }  // Handle changes
                inputProps = { { id : `status-select-label` } }
                InputLabelProps = { { htmlFor : `status-select-label` } }
              >
                { userRoles?.map( ( option ) => (
                  <MenuItem
                    key = { option.RoleID }
                    value = { option.RoleID } >
                    { option.RoleName }
                  </MenuItem > ) ) }
              </TextField >

            </Box >
            <Stack spacing = { 3 }
              alignItems = "flex-end"
              sx = { { mt : 3 } } >
              <LoadingButton type = "submit"
                variant = "contained"
                loading = { isSubmitting }
              >
                { !currentItem ? "ساخت کاربر" : `ذخیره تغییرات` }
              </LoadingButton >
            </Stack >
          </Card >
        </Grid >
      </Grid >
    </Form > );
}
