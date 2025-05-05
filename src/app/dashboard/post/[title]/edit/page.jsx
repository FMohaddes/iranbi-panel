import { CONFIG } from 'src/config-global';

import { PostEditView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Post edit | داشبورد - ${CONFIG.site.name}` };

export default async function Page({ params }) {
  return <PostEditView />;
}
