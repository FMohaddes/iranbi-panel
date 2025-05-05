import { CONFIG } from 'src/config-global';

import { PostCreateView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export const metadata = { title: `ساخت پست جدید | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return <PostCreateView />;
}
