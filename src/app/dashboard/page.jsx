import { CONFIG } from "src/config-global";

import {
  OverviewEcommerceView
} from "../../sections/overview/e-commerce/view";

// ----------------------------------------------------------------------

export const metadata = { title: `داشبورد- ${CONFIG.site.name}` };

export default function Page() {
  return <OverviewEcommerceView />;
}
