import { z as zod } from "zod";
import { useEffect  } from "react";
import { useForm } from "react-hook-form";
import {
  zodResolver
} from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import LoadingButton
  from "@mui/lab/LoadingButton";
import InputAdornment
  from "@mui/material/InputAdornment";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import {
  PRODUCT_GENDER_OPTIONS ,
  PRODUCT_COLOR_NAME_OPTIONS ,
  PRODUCT_TYPE_GROUP_OPTIONS ,
} from "src/_mock";

import { toast } from "src/components/snackbar";
import {
  Form , Field , schemaHelper
} from "src/components/hook-form";

import axios , {
  endpoints
} from "../../utils/axios";
import {
  useImageUpload
} from '../../hooks/use-image-upload';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object( {
  name: zod.string().min(1, 'نام الزامی است'),
  description: zod.string().min(1, 'توضیح الزامی است'),
  price: zod.string().min(1, 'قیمت الزامی است'),
  category: zod.string().min(1, 'دسته‌بندی الزامی است'),
  tags: zod.array(zod.string()).optional(),
  images: zod.any().optional(),
  videos: zod.any().optional(),
  videoData: zod.string().optional(),
} );

// ----------------------------------------------------------------------

export function ProductNewEditForm( { currentProduct } ) {
  const router = useRouter();


  const defaultValues = {
    name: '',
    description: '',
    price: '',
    category: '',
    tags: [],
    images: [],
    videos: [],
    videoData: '',

  }

  const methods = useForm( {
    resolver : zodResolver( NewProductSchema ) ,
    defaultValues ,
  } );

  const {
    reset ,
    watch ,
    setValue ,
    control ,
    handleSubmit ,
    formState : { isSubmitting } ,
  } = methods;

  const { handleRemoveFile, handleRemoveAllFiles, handleUpload } = useImageUpload({
    watch,
    setValue,
    fieldName: 'ProductImage',
  });

  useEffect( () => {
    if( currentProduct ) {
      const resetValue = {
        ProductName  : currentProduct?.ProductName || "" ,
        ProductType  : PRODUCT_TYPE_GROUP_OPTIONS.find( item => item === currentProduct?.ProductType ) || "کفش" ,
        Color        : currentProduct?.Color || "" ,
        Size         : currentProduct?.Size ?? 0 ,
        FootLength   : currentProduct?.FootLength ?? 0 ,
        Description  : currentProduct?.Description || "" ,
        ProductImage : currentProduct?.ProductImage || [] ,
        ProductCode  : currentProduct?.ProductCode ?? 0 ,
        AccCode      : Number( currentProduct?.AccCode ) ?? 0 ,
        Price        : currentProduct?.price ?? 0 ,
        Tag          : currentProduct?.tag || [] ,
        Gender       : currentProduct?.Gender || "Men" ,
      };

      reset( resetValue );
    }
  } , [ currentProduct , reset ] );


  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('category', data.category);
    formData.append('videoData', data.videoData || '');

    // Append tags as individual fields
    data.tags?.forEach((tag) => {
      formData.append('tags', tag);
    });

    // Append images
    if (data.images?.length) {
      for (const file of data.images) {
        formData.append('images', file);
      }
    }

    // Append videos
    if (data.videos?.length) {
      for (const file of data.videos) {
        formData.append('videos', file);
      }
    }
    const url = currentProduct ? `${ endpoints.product.update(currentProduct._id) }` : endpoints.product.new;

    try {
      const res = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        reset();
        toast.success('محصول با موفقیت ثبت شد!');
        router.push(paths.dashboard.products.root);
      }
    } catch (error) {
      toast.error('خطا در ثبت محصول');
    }
  });




  const renderDetails = ( <Card >
    <CardHeader title = "جزئیات"
      subheader = "عنوان, توضیح, عکس..."
      sx = { { mb : 3 } } />

    <Divider />

    <Stack spacing = { 3 } sx = { { p : 3 } } >
      <Field.Text name = "ProductName"
        label = "نام محصول" autoComplete = "on" />

      <Stack spacing = { 1.5 } >
        <Typography
          variant = "subtitle2" >محتوا</Typography >
        <Field.Editor name = "Description"
          sx = { { maxHeight : 480 } } />
      </Stack >

      <Stack spacing = { 1.5 } >
        <Typography variant = "subtitle2" >عکس ها</Typography >
        <Field.Upload
          multiple
          thumbnail
          name = "ProductImage"
          maxSize = { 3145728 }
          onRemove = { handleRemoveFile }
          onRemoveAll = { handleRemoveAllFiles }
          onUpload = { ( files ) => handleUpload( files ) }

        />
      </Stack >
    </Stack >
  </Card > );

  const renderProperties = ( <Card >
    <CardHeader
      title = "ویژگی ها"
      subheader = "توابع و ویژگی‌های اضافی..."
      sx = { { mb : 3 } }
    />

    <Divider />

    <Stack spacing = { 3 } sx = { { p : 3 } } >
      <Box
        columnGap = { 2 }
        rowGap = { 3 }
        display = "grid"
        gridTemplateColumns = { {
          xs : "repeat(1, 1fr)" ,
          md : "repeat(2, 1fr)"
        } }
      >
        <Field.Text name = "AccCode"
          label = "کدحسابداری"
          type = "number"

        />

        <Field.Text name = "ProductCode"
          label = "کدمحصول"
          type = "number"

        />
        <Field.Select fullWidth
          name = "ProductType"
          label = "نوع محصول"
          InputLabelProps = { { shrink : true } } >
          { PRODUCT_TYPE_GROUP_OPTIONS.map( ( option ) => (
            <MenuItem key = { option }
              value = { option }
              sx = { { textTransform : "capitalize" } } >
              { option }
            </MenuItem > ) ) }
        </Field.Select >

        <Field.AutocompleteChip
          name = "Tag"
          label = "تگ ها"
          placeholder = "+ تگ ها"
          multiple
          freeSolo
          disableCloseOnSelect
          options = { [] }
          getOptionLabel = { ( option ) => option }
          renderOption = { ( props , option ) => (
            <li { ...props } key = { option } >
              { option }
            </li > ) }
          renderTags = { ( selected , getTagProps ) => selected.map( ( option , index ) => (
            <Chip
              { ...getTagProps( { index } ) }
              key = { option }
              label = { option }
              size = "small"
              color = "info"
              variant = "soft"
            /> ) ) }
          onChange = { ( event , value ) => setValue( "Tag" , value ) }
        />
      </Box >

      <Stack spacing = { 1 } >
        <Typography
          variant = "subtitle2" >جنسیت</Typography >
        <Field.RadioGroup row name = "Gender"
          options = { PRODUCT_GENDER_OPTIONS }
          sx = { { gap : 2 } } />
      </Stack >

      <Divider
        sx = { { borderStyle : "dashed" } } />

      <Box
        sx = { {
          display       : "flex" ,
          flexDirection : "column" ,
          gap           : "1rem" ,
        } }
      >
        <Box display = "flex"
          alignItems = "center" gap = { 2 } >
          <Field.Text name = "Size"
            label = "سایز"
            type = "number"
          />
          <Field.Text name = "FootLength"
            label = "سایزپا"
            type = "number"
          />

          <Field.Select
            name = "Color"
            label = "رنگ"
            InputLabelProps = { { shrink : true } }
          >
            { PRODUCT_COLOR_NAME_OPTIONS.map( ( color ) => (
              <MenuItem
                key = { color.value }
                value = { color.falabel }
                sx = { { backgroundColor : color.value,color:"black" } }
              >
                { color.falabel }
              </MenuItem > ) ) }
          </Field.Select >

          <Field.Text
            name = "Quantity"
            label = "تعداد موجودی"
            placeholder = "0"
            type = "number"
            disabled
            InputLabelProps = { { shrink : true } }
          />

        </Box >

      </Box >
    </Stack >
  </Card > );

  const renderPricing = ( <Card >
    <CardHeader title = "قیمت گذاری"
      subheader = "ورودی‌های مرتبط با قیمت"
      sx = { { mb : 3 } } />

    <Divider />

    <Stack spacing = { 3 } sx = { { p : 3 } } >
      <Field.Text
        name = "Price"
        label = "قیمت معمولی"
        placeholder = "0.00"
        type = "number"
        InputLabelProps = { { shrink : true } }
        InputProps = { {
          endAdornment : (
            <InputAdornment position = "end" >
              <Box component = "span"
                sx = { { color : "text.disabled" } } >
                ریال
              </Box >
            </InputAdornment > ) ,
        } }
      />

      {/*  <Field.Text
       name="priceSale"
       label="قیمت تخفیف‌خورده"
       placeholder="0.00"
       type="number"
       InputLabelProps={{ shrink: true }}
       InputProps={{
       endAdornment: (
       <InputAdornment position="end">
       <Box component="span" sx={{ color: 'text.disabled' }}>
       ریال
       </Box>
       </InputAdornment>
       ),
       }}
       /> */ }

    </Stack >
  </Card > );

  const renderActions = (
    <Stack spacing = { 3 } direction = "row"
      alignItems = "center" flexWrap = "wrap" >
      {/* <FormControlLabel
       control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
       label="انتشار"
       sx={{ pl: 3, flexGrow: 1 }}
       /> */ }

      <LoadingButton type = "submit"
        variant = "contained" size = "large"
        loading = { isSubmitting } >
        { !currentProduct ? "ساخت محصول" : `ذخیره تغییرات` }

      </LoadingButton >
    </Stack > );

  return ( <Form methods = { methods }
    onSubmit = { onSubmit } >
    <Stack spacing = { { xs : 3 , md : 5 } }
      sx = { {
        mx       : "auto" ,
        maxWidth : { xs : 720 , xl : 880 }
      } } >
      { renderDetails }

      { renderProperties }

      { renderPricing }

      { renderActions }
    </Stack >
  </Form > );
}
