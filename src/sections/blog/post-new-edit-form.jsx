import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { toast } from 'src/components/snackbar';
import { Field, Form, schemaHelper } from 'src/components/hook-form';

import { PostDetailsPreview } from './post-details-preview';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { Iconify } from '../../components/iconify';
import { varFade } from '../../components/animate';
import axios, { endpoints } from '../../utils/axios';
import Chip from '@mui/material/Chip';
import { PRODUCT_TYPE_GROUP_OPTIONS } from '../../_mock';
import MenuItem from '@mui/material/MenuItem';
import { useImageUpload } from '../../hooks/use-image-upload';
// ----------------------------------------------------------------------

export const NewPostSchema = zod.object({
  title_fa: zod.string().min(1, { message: 'عنوان الزامی است!' }),
  title_en: zod.string().min(1, { message: 'عنوان الزامی است!' }),
  content_fa: schemaHelper.editor().min(10, { message: 'محتوا حداقل ۱۰۰ کاراکتر باشد' }),
  content_en: schemaHelper.editor().min(10, { message: 'محتوا حداقل ۱۰۰ کاراکتر باشد' }),
  cover: schemaHelper.file().optional(),
  tags: zod.array(zod.string()).min(2, { message: 'حداقل ۲ مورد الزامی است!' }),
  metaTitle_fa: zod.string().optional(),
  metaTitle_en: zod.string().optional(),
  metaDescription_fa: zod.string().optional(),
  metaDescription_en: zod.string().optional(),
  excerpt_fa: zod.string().optional(),
  excerpt_en: zod.string().optional(),
  ogTitle_fa: zod.string().optional(),
  ogTitle_en: zod.string().optional(),
  ogDescription_fa: zod.string().optional(),
  ogDescription_en: zod.string().optional(),
  structuredData: zod.string().optional(),
  ogImage: schemaHelper.file().optional(),
  status: zod.string().optional(),
  isFeatured: zod.boolean().optional(),
});

// ----------------------------------------------------------------------

export function PostNewEditForm({ currentPost }) {
  const router = useRouter();

  const [propertiesOpen, setPropertiesOpen] = useState(false);

  const preview = useBoolean();

  const defaultValues = {
    title_fa: '',
    title_en: '',
    content_fa: '',
    content_en: '',
    excerpt_fa: '',
    excerpt_en: '',
    cover: null,
    tags: [],
    metaTitle_fa: '',
    metaTitle_en: '',
    metaDescription_fa: '',
    metaDescription_en: '',
    ogTitle_fa: '',
    ogTitle_en: '',
    ogDescription_fa: '',
    ogDescription_en: '',
    structuredData: '',
    ogImage: null,
    status: 'published',
    isFeatured: false,
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = methods;

  console.log(watch());

  const { handleRemoveFile, handleRemoveAllFiles, handleUpload } = useImageUpload({
    watch,
    setValue,
    fieldName: 'cover',
  });

  const {
    handleRemoveFile: removeOgImage,
    handleRemoveAllFiles: removeAllOgImage,
    handleUpload: uploadOgImage,
  } = useImageUpload({
    watch,
    setValue,
    fieldName: 'ogImage',
  });

  const values = watch();

  useEffect(() => {
    if (currentPost) {
      const resetValue = {
        title_fa: currentPost?.title?.fa || '',
        title_en: currentPost?.title?.en || '',
        content_fa: currentPost?.content?.fa || '',
        content_en: currentPost?.content?.en || '',
        excerpt_fa: currentPost?.excerpt?.fa || '',
        excerpt_en: currentPost?.excerpt?.en || '',
        cover: currentPost?.cover || null,
        tags: currentPost?.tags || [],
        metaTitle_fa: currentPost?.metaTitle?.fa || '',
        metaTitle_en: currentPost?.metaTitle?.en || '',
        metaDescription_fa: currentPost?.metaDescription?.fa || '',
        metaDescription_en: currentPost?.metaDescription?.en || '',
        ogTitle_fa: currentPost?.ogTitle?.fa || '',
        ogTitle_en: currentPost?.ogTitle?.en || '',
        ogDescription_fa: currentPost?.ogDescription?.fa || '',
        ogDescription_en: currentPost?.ogDescription?.en || '',
        structuredData: currentPost?.structuredData || '',
        ogImage: currentPost?.ogImage || null,
        status: currentPost?.status || 'published',
        isFeatured: currentPost?.isFeatured || false,
      };

      reset(resetValue);
    }
  }, [currentPost, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const url = currentPost
      ? `${endpoints.post.update}/${currentPost.ProductID}`
      : endpoints.post.new;
    const method = currentPost ? 'patch' : 'post';
    try {
      const res = await axios({
        method,
        url,
        data,
      });

      if (res?.status === 200) {
        reset();
        toast.success(currentPost ? `آپدیت با موفقیت انجام شد!` : `ساخت با موفقیت انجام شد!`);
        router.push(paths.dashboard.post.root);
      }
    } catch (error) {
      toast.error(error);
    }
  });

  const renderDetails = (
    <Card>
      <CardHeader title="جزئیات" subheader="عنوان, توضیحات, عکس..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="title_fa" label="عنوان پست به فارسی" />
        <Field.Text name="title_en" label="عنوان پست به انگلیسی" />

        {/*   <Stack spacing={1.5}>
         <Typography variant="subtitle2">محتوا فارسی</Typography>
         <Field.Editor name="content_fa" sx={{ maxHeight: 480 }} />
         </Stack>
         <Stack spacing={1.5}>
         <Typography variant="subtitle2">محتوا انگلیسی</Typography>
         <Field.Editor name="content_en" sx={{ maxHeight: 480 }} />
         </Stack>*/}

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">کاور</Typography>

          <Field.Upload
            name="cover"
            label="کاور"
            maxSize={3145728}
            onRemove={handleRemoveFile}
            maxFiles={1}
            onUpload = { ( files ) => handleUpload( files ) }

          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Accordion
      variants={varFade({ distance: 24 }).inUp}
      expanded={propertiesOpen}
      onChange={() => setPropertiesOpen(!propertiesOpen)}
    >
      <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
        <Typography
          variant="subtitle1"
          sx={{
            width: '33%',
            flexShrink: 0,
          }}
        >
          ویژگی‌ها
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={3}>
          <Field.Text name="metaTitle_fa" label="عنوان متا فارسی" />
          <Field.Text name="metaTitle_en" label="عنوان متا انگلیسی" />
          <Field.Text name="metaDescription_fa" label="توضیحات متا فارسی" multiline rows={3} />
          <Field.Text name="metaDescription_en" label="توضیحات متا انگلیسی" multiline rows={3} />
          <Field.Text name="excerpt_fa" label="خلاصه‌ی فارسی پست" />
          <Field.Text name="excerpt_en" label="خلاصه‌ی انگلیسی پست" />
          <Field.Text name="ogTitle_fa" label="OG عنوان فارسی" />
          <Field.Text name="ogTitle_en" label="OG عنوان انگلیسی" />
          <Field.Text name="ogDescription_fa" label="OG توضیح فارسی" multiline rows={3} />
          <Field.Text name="ogDescription_en" label="OG توضیح انگلیسی" multiline rows={3} />
          <Field.Select
            fullWidth
            name="category"
            label="دسته بندی"
            InputLabelProps={{ shrink: true }}
          >
            {PRODUCT_TYPE_GROUP_OPTIONS.map((option) => (
              <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                {option}
              </MenuItem>
            ))}
          </Field.Select>
          <Field.AutocompleteChip
            name="tags"
            label="تگ ها"
            placeholder="+ تگ ها"
            multiple
            freeSolo
            disableCloseOnSelect
            options={[]}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
            onChange={(event, value) => setValue('tags', value)}
          />
          <Field.Text name="structuredData" label="Structured Data (JSON)" multiline rows={4} />
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">OG تصویر</Typography>

          <Field.Upload
            name="ogImage"
            label="OG تصویر"
            maxSize={3145728}
            onRemove={removeOgImage}
            maxFiles={1}
            onUpload = { ( files ) => uploadOgImage( files ) }

          />
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );

  const renderActions = (
    <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="flex-end">
      <FormControlLabel
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        label="وضعیت انتشار"
        sx={{ pl: 3, flexGrow: 1 }}
      />

      <div>
        <Button color="inherit" variant="outlined" size="large" onClick={preview.onTrue}>
          پیش نمایش
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentPost ? `ساخت` : `ذخیره تغییرات`}
        </LoadingButton>
      </div>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack
        spacing={5}
        sx={{
          mx: 'auto',
          maxWidth: { xs: 720, xl: 880 },
        }}
      >
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Stack>

      <PostDetailsPreview
        isValid={isValid}
        onSubmit={onSubmit}
        title={values.title}
        open={preview.value}
        content={values.content}
        onClose={preview.onFalse}
        cover={values.cover}
        isSubmitting={isSubmitting}
        description={values.description}
      />
    </Form>
  );
}
