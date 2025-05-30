import { CONFIG } from 'src/config-global';

import { UserListView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = { title: `لیست کاربران | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return <UserListView />;
}
