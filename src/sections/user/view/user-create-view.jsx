'use client';

import useSWR from "swr";

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

export function UserCreateView() {
  const { data, isLoading: isRolesLoading, error: rolesError } = useSWR(
    endpoints.user.roles,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  );
  const userRoles=data?.data || []

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="ساخت کاربر جدید"
        links={[
          { name: 'داشبورد', href: paths.dashboard.root },
          { name: 'کاربر', href: paths.dashboard.user.root },
          { name: 'کاربر جدید' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm userRoles={userRoles}/>
    </DashboardContent>
  );
}
