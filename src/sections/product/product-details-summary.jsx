import { useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency, fShortenNumber } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Form, Field } from 'src/components/hook-form';
import { ColorPicker } from 'src/components/color-utils';

import {
  PRODUCT_COLOR_NAME_OPTIONS
} from "../../_mock";

// ----------------------------------------------------------------------

export function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disableActions,
  ...other
}) {
  const router = useRouter();

  const {
    id,
    name,
    Size,
    Price,
    ProductImage,
    Color,
    newLabel,
    available,
    PriceSale,
    saleLabel,
    totalRatings,
    totalReviews,
    inventoryType,
    Description,
  } = product;

  const existProduct = !!items?.length && items.map((item) => item.id).includes(id);

  const isMaxQuantity =
    !!items?.length &&
    items.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  const defaultValues = {
    id,
    name,
    ProductImage:ProductImage?.[0],
    available,
    Price,
    colors: [Color]?.[0],
    size: Size?.[4],
    quantity: available < 1 ? 0 : 1,
  };

  const methods = useForm({ defaultValues });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!existProduct) {
        onAddCart?.({ ...data, colors: [values.colors], subtotal: data.Price * data.quantity });
      }
      onGotoStep?.(0);
      router.push(paths.product.checkout);
    } catch (error) {
      console.error(error);
    }
  });

  const handleAddCart = useCallback(() => {
    try {
      onAddCart?.({ ...values, colors: [values.colors], subtotal: values.Price * values.quantity });
    } catch (error) {
      console.error(error);
    }
  }, [onAddCart, values]);


  const renderPrice = (
    <Box sx={{ typography: 'h5' }}>
      {PriceSale && (
        <Box
          component="span"
          sx={{ color: 'text.disabled', textDecoration: 'line-through', mr: 0.5 }}
        >
          {fCurrency(PriceSale)}
        </Box>
      )}

      {fCurrency(Price)}
    </Box>
  );

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center" />
  );
 const productColor=PRODUCT_COLOR_NAME_OPTIONS?.find(item => item?.falabel===Color)?.value
  const renderColorOptions = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        رنگ
      </Typography>

      <Controller
        name="colors"
        control={control}
        render={({ field }) => (
          <ColorPicker
            colors={productColor ? [productColor] :["black"]}
            selected={field.value}
            onSelectColor={(color) => field.onChange(color)}
            limit={4}
          />
        )}
      />
    </Stack>
  );

  const renderSizeOptions = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        اندازه
      </Typography>

      <Field.Select
        name="size"
        size="small"
        sx={{
          maxWidth: 88,
          [`& .${formHelperTextClasses.root}`]: { mx: 0, mt: 1, textAlign: 'right' },
        }}
      >
        {[Size]?.map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </Field.Select>
    </Stack>
  );

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Quantity
      </Typography>

      <Stack spacing={1}>

        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
          Available: {available}
        </Typography>
      </Stack>
    </Stack>
  );
  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {Description}
    </Typography>
  );

  const renderRating = (
    <Stack direction="row" alignItems="center" sx={{ color: 'text.disabled', typography: 'body2' }}>
      <Rating size="small" value={totalRatings} precision={0.1} readOnly sx={{ mr: 1 }} />
      {`(${fShortenNumber(totalReviews)} reviews)`}
    </Stack>
  );

  const renderLabels = (newLabel?.enabled || saleLabel?.enabled) && (
    <Stack direction="row" alignItems="center" spacing={1}>
      {newLabel?.enabled && <Label color="info">{newLabel?.content}</Label>}
      {saleLabel?.enabled && <Label color="error">{saleLabel?.content}</Label>}
    </Stack>
  );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: 'overline',
        color:
          (inventoryType === 'out of stock' && 'error.main') ||
          (inventoryType === 'low stock' && 'warning.main') ||
          'success.main',
      }}
    >
      {inventoryType}
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {renderLabels}

          {renderInventoryType}

          <Typography variant="h5">{name}</Typography>

          {renderRating}

          {renderPrice}

        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderColorOptions}

        {renderSizeOptions}

        {renderQuantity}

        <Divider sx={{ borderStyle: 'dashed' }} />

      </Stack>
    </Form>
  );
}
