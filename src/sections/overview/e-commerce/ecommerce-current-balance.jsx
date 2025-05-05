import useSWR from "swr";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { fCurrency } from 'src/utils/format-number';

import {
  fetcher ,
  endpoints
} from "../../../utils/axios";
import PRIMARY_COLOR
  from "../../../theme/with-settings/primary-color.json";

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateOnFocus     : false ,
  revalidateOnReconnect : false ,
};

export function EcommerceCurrentBalance({
  sx,
  title,
  earning,
  refunded,
  orderTotal,
  currentBalance,
  ...other
}) {
  const theme = useTheme();
  const urlSummary = `${ endpoints.report.preinvoices }`;

  const {
    data:summary ,
  } = useSWR( urlSummary , fetcher , {
    ...swrOptions ,
  } );

  const row = (label, value, color) => (
    <Box sx={{ display: 'flex', typography: 'body2', justifyContent: 'space-between' }}>
      <Box component="span" sx={{fontWeight:'600', color: color || 'text.secondary' }}>
        {label}
      </Box>
      <Box component="span" sx={{ fontWeight: 'bold', color: color || 'text.primary' }}>
        {value}
      </Box>
    </Box>
  );

  return (
    <Card sx={{ p: 3, ...sx }} {...other}>
      <Box sx={{ mb: 1, typography: 'subtitle2' }}>{ ` جمع کل ( تعداد پیش فاکتورها ${ summary?.totalPreInvoices } )` }</Box>

      <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ typography: 'h3', display: 'flex',gap:1 }}>
          {fCurrency(summary?.totalFinalAmount)}
          <Typography sx={{ color: 'text.secondary', alignSelf:'end' }}>
            ریال
          </Typography>
        </Box>
        {row('مجموع پرداخت شده', fCurrency(summary?.totalPaidAmount), theme.palette.success.main)}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            columnGap: 5,
            rowGap: 2,
          }}
        >
          {row('تعداد پرداخت شده', summary?.paidPreInvoices, theme.palette.success.main)}
          {row('تعداد در انتظار', summary?.pendingPreInvoices, theme.palette.warning.main)}
          {row('تعداد تولید شده', summary?.completedPreInvoices, theme.palette.info.main)}
          {row('تعداد ارسال شده', summary?.sentPreInvoices, theme.palette.text.secondary)}
          {row('تعداد لغو شده', summary?.cancelledPreInvoices, theme.palette.error.main)}
          {row('تعداد آماده ارسال', summary?.shippedPreInvoices, PRIMARY_COLOR.purple.light)}

        </Box>

      </Box>
    </Card>
  );
}
