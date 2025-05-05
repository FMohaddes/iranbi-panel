import { CONFIG } from 'src/config-global';

import { AccountView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

export const metadata = { title: `تنظیمات حساب کاربری | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return <AccountView />;
}
