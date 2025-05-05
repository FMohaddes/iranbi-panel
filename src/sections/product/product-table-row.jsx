

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency } from 'src/utils/format-number';

import {
  PRODUCT_COLOR_NAME_OPTIONS
} from "../../_mock";
import {  ColorPreview
} from "../../components/color-utils";

// ----------------------------------------------------------------------

export function RenderCellPrice({ params }) {
  return fCurrency(params.row.price);
}


// ----------------------------------------------------------------------

export function RenderCellDescription({ params }) {
  return (
    <Stack spacing={0.5}>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}
        dangerouslySetInnerHTML={{ __html: params.row.Description }} />
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function RenderCellStock({ params }) {
  return (
    <Stack justifyContent="center" sx={{ typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={(params.row.available * 100) / params.row.quantity}
        variant="determinate"
        color={
          (params.row.inventoryType === 'out of stock' && 'error') ||
          (params.row.inventoryType === 'low stock' && 'warning') ||
          'success'
        }
        sx={{ mb: 1, width: 1, height: 6, maxWidth: 80 }}
      />
      {!!params.row.available && params.row.available} {params.row.inventoryType}
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function RenderCellProduct({ params, onViewRow }) {
  const ImageSrc=`${process.env.NEXT_PUBLIC_ASSET_URL}${params.row?.ProductImage?.[0]}`
  const colorOption = PRODUCT_COLOR_NAME_OPTIONS.find(item => item.falabel===params.row.Color)

  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        alt={params.row.ProductName}
        src={ImageSrc}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: 'pointer'}}
          >
            {params.row.ProductName}
          </Link>
        }
        secondary={
          <Box component="div" sx={{display:'flex', gap:'.6rem', typography: 'body2', color: 'text.disabled' }}>
            <ColorPreview limit={3} colors={[colorOption?.value]} />
            <Box component="span">
              نوع: <Box component="span" sx={{ fontWeight: 'bold' }}>{params.row.ProductType}</Box>
            </Box>
            <Box component="span">
              سایز: <Box component="span" sx={{ fontWeight: 'bold' }}>{params.row.Size}</Box>
            </Box>
            <Box component="span">
              سایزپا: <Box component="span" sx={{ fontWeight: 'bold' }}>{params.row.FootLength}</Box>
            </Box>
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column', gap:'.3rem' }}
      />
    </Stack>
  );
}
