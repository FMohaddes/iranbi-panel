import { CONFIG } from 'src/config-global';

import { JwtSignInView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `ورود | ${CONFIG.site.name}` };

export default function Page() {
  return <JwtSignInView />;
}
