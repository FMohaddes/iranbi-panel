import { mutate } from "swr";
import { useForm } from "react-hook-form";
import { useMemo , useEffect } from "react";

import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import LoadingButton
  from "@mui/lab/LoadingButton";
import DialogTitle
  from "@mui/material/DialogTitle";
import DialogActions
  from "@mui/material/DialogActions";
import DialogContent
  from "@mui/material/DialogContent";
import FormControlLabel
  from "@mui/material/FormControlLabel";

import { toast } from "src/components/snackbar";
import {
  Form , Field
} from "src/components/hook-form";

import axios , {
  endpoints
} from "../../utils/axios";

// ----------------------------------------------------------------------

export function UserQuickEditForm( {
                                     currentUser ,
                                     userRoles ,
                                     open ,
                                     onClose
                                   } ) {
  const defaultValues = useMemo( () => ( {
    Username  : "" ,
    RoleID    : null ,
    Email     : "" ,
    FirstName : "" ,
    LastName  : "" ,
    IsActive  : false ,
  } ) , [ currentUser ] );

  const methods = useForm( {
    mode : "all" , defaultValues ,
  } );

  const {
    reset ,
    watch ,
    handleSubmit ,
    formState : { isSubmitting } ,
  } = methods;

  useEffect( () => {
    if( userRoles ) {
      const resetValue = {
        Username  : currentUser?.Username || "" ,
        RoleID    : currentUser?.Roles[ 0 ].RoleID || userRoles[ 0 ]?.RoleID || null ,
        Email     : currentUser?.Email || "" ,
        IsActive  : currentUser?.IsActive || false ,
        FirstName : currentUser?.FirstName || "" ,
        LastName  : currentUser?.LastName || "" ,
      };
      reset( resetValue );
    }
  } , [ currentUser , userRoles , reset ] );

  const onSubmit = handleSubmit( async( data ) => {

    try {
      const res = await axios.patch( `${endpoints.user.update  }/${  currentUser.UserID}` , { ...data } );
      reset();
      if( res.status === 200 ) {
        mutate( endpoints.user.list );
        onClose();
        toast.success( "آپدیت با موفقیت آنجام شد!" );
      }

    }
    catch(error) {
      toast.error( error );
    }
  } );

  return ( <Dialog
      fullWidth
      maxWidth = { false }
      open = { open }
      onClose = { onClose }
      PaperProps = { { sx : { maxWidth : 720 } } }
    >
      <Form methods = { methods }
        onSubmit = { onSubmit } >
        <DialogTitle >آپدیت سریع</DialogTitle >

        <DialogContent >
          <Box
            sx = { { py : 2 } }
            rowGap = { 3 }
            columnGap = { 2 }
            display = "grid"
            gridTemplateColumns = { {
              xs : "repeat(1, 1fr)" ,
              sm : "repeat(2, 1fr)"
            } }
          >
            <Field.Text name = "FirstName"
              label = "نام"
              disabled = { currentUser } />
            <Field.Text name = "LastName"
              label = "نام خانوادگی"
              disabled = { currentUser } />
            <Field.Text name = "Email"
              label = "آدرس ایمیل"
              disabled = { currentUser } />
            <Field.Text name = "Username"
              label = "نام کاربری"
              disabled = { currentUser } />

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
                <MenuItem key = { option.RoleID }
                  value = { option.RoleID } >
                  { option.RoleName }
                </MenuItem > ) ) }
            </TextField >

            <RadioGroup
              row
              value = { watch( "IsActive" ) }
              onChange = { ( event ) => methods.setValue( "IsActive" , event.target.value === "true" ) }
            >
              <FormControlLabel value = "true"
                control = { <Radio /> }
                label = "فعال کردن کاربر" />
              <FormControlLabel value = "false"
                control = { <Radio /> }
                label = "غیرفعال کردن کاربر" />
            </RadioGroup >

          </Box >
        </DialogContent >

        <DialogActions >
          <Button variant = "outlined"
            onClick = { onClose } >
            لغو
          </Button >

          <LoadingButton type = "submit"
            variant = "contained"
            loading = { isSubmitting } >
            ویرایش
          </LoadingButton >
        </DialogActions >
      </Form >
    </Dialog > );
}
