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
  UserNewEditForm
} from "../user-new-edit-form";
import {
  fetcher , endpoints
} from "../../../utils/axios";

// ----------------------------------------------------------------------

export function UserEditView() {
  const { id } = useParams();

  const { data, isLoading: isRolesLoading, error: rolesError } = useSWR(
    endpoints.user.roles,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  );
  const userRoles=data?.data || []


  const { data: currentItem } = useSWR(
    endpoints.user.detail(id),
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="ویرایش"
        links={[
          { name: 'داشبورد', href: paths.dashboard.root },
          { name: 'کاربر', href: paths.dashboard.user.list },
          { name: currentItem?.FirstName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm userRoles={userRoles} currentItem={currentItem}/>
    </DashboardContent>
  );
}
