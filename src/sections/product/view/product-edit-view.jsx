'use client';

import useSWR from "swr";
import { useParams } from "next/navigation";

import { paths } from "src/routes/paths";

import {
  DashboardContent
} from "src/layouts/dashboard";

import {
  CustomBreadcrumbs
} from "src/components/custom-breadcrumbs";

import {
  fetcher , endpoints
} from "../../../utils/axios";
import {
  ProductNewEditForm
} from "../product-new-edit-form";

// ----------------------------------------------------------------------
const swrOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function ProductEditView() {
  const { id } = useParams();

  const { data, isLoading, error, isValidating } = useSWR(endpoints.product.detail(id), fetcher, swrOptions)
  const currentItem=data?.data || {}

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="ویرایش"
        links={[
          { name: 'داشبورد', href: paths.dashboard.root },
          { name: 'محصول', href: paths.dashboard.product.root },
          { name: currentItem?.ProductName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewEditForm currentProduct={currentItem} />
    </DashboardContent>
  );
}
