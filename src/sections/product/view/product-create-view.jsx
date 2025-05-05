'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductNewEditForm } from '../product-new-edit-form';

// ----------------------------------------------------------------------

export function ProductCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="ساخت محصول جدید"
        links={[
          { name: 'داشبورد', href: paths.dashboard.root },
          { name: 'محصول', href: paths.dashboard.product.root },
          { name: 'ساخت محصول' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewEditForm />
    </DashboardContent>
  );
}
