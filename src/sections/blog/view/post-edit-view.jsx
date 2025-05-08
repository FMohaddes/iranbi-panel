'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PostNewEditForm } from '../post-new-edit-form';
import {
  fetcher , endpoints,
} from '../../../utils/axios';

// ----------------------------------------------------------------------
const swrOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function PostEditView({ post }) {
  const { title } = useParams();

  const { data, isLoading, error, isValidating } = useSWR(endpoints.post.detail(title), fetcher, swrOptions)
  const currentItem=data || {}

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="ویرایش"
        links={[
          {
            name: 'داشبورد',
            href: paths.dashboard.root,
          },
          {
            name: 'بلاگ',
            href: paths.dashboard.post.root,
          },
          { name: post?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PostNewEditForm currentPost={currentItem} />
    </DashboardContent>
  );
}
