'use client';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

export default function Error({ error, reset }) {
  return (
    <DashboardContent sx={{ pt: 5 }}>
      <EmptyContent
        filled
        title="محصولی یافت نشد!"
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.product.root}
            startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
            sx={{ mt: 3 }}
          >
            بازگشت به لیست
          </Button>
        }
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    </DashboardContent>
  );
}
