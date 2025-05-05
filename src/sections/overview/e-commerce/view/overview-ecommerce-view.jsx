'use client';

import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { _ecommerceSalesOverview } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { AuthContext } from '../../../../auth/context/auth-context';
import { EcommerceSalesOverview } from '../ecommerce-sales-overview';

// ----------------------------------------------------------------------

export function OverviewEcommerceView() {
  const { user } = useContext(AuthContext);
  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={12} lg={12}>
          <EcommerceSalesOverview title="مرور فروش" data={_ecommerceSalesOverview} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
