import { CONFIG } from 'src/config-global';

import { ProductEditView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `ویرایش محصول | داشبورد - ${CONFIG.site.name}` };

export default async function Page({ params }) {
  return <ProductEditView />;
}
