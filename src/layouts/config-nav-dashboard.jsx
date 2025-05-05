import { paths } from "src/routes/paths";

import { CONFIG } from "src/config-global";

import {
  SvgColor
} from "src/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  production: icon('ic-ecommerce'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'نمای کلی',
    items: [
      { title: 'فروشگاه', path: paths.dashboard.general.ecommerce, icon: ICONS.ecommerce },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'مدیریت',
    items: [
      {
        title: 'کاربر',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'لیست کاربران', path: paths.dashboard.user.list },
          { title: 'ساخت کاربر', path: paths.dashboard.user.new },
        ],
      },
      {
        title: 'محصول',
        path: paths.dashboard.product.root,
        icon: ICONS.product,
        children: [
          { title: 'لیست محصولات', path: paths.dashboard.product.root },
          { title: 'ساخت محصول', path: paths.dashboard.product.new },
        ],
      },

      {
        title: 'بلاگ',
        path: paths.dashboard.post.root,
        icon: ICONS.blog,
        children: [
          { title: 'لیست پست ها', path: paths.dashboard.post.root },
          { title: 'ساخت پست', path: paths.dashboard.post.new },
        ],
      },

    ],
  },

];
