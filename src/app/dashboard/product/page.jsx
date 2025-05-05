import { CONFIG } from "src/config-global";

import {
  ProductListView
} from "src/sections/product/view";

// ----------------------------------------------------------------------

export const metadata = { title: `لیست محصولات | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return <ProductListView />;
}
