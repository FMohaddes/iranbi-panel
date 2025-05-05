import { CONFIG } from 'src/config-global';

import { ProductCreateView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `ساخت محصول جدید | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return <ProductCreateView />;
}
