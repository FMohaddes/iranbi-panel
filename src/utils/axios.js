import axios from "axios";

import { CONFIG } from "src/config-global";
// ----------------------------------------------------------------------
const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(
      (error.response && (error?.response?.data?.message || error?.response?.data?.error)) || "یک ارور غیرمنتظره رخ داده است."
    )
);


export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  report: {
    preinvoices: '/reports/preinvoices/summary',
  },
  upload: {
    files: 'upload/file',
    video: 'upload/video',
    image: 'upload/image',
    delete: 'upload/delete',
    invoiceDelete: '/upload/delete-invoice-image',
  },
  auth: {
    me: 'users/me',
    signIn: 'users/login',
    logout: 'auth/logout',
    signUp: '/api/auth/sign-up',
  },
  post: {
    new: 'blog/create',
    update : ( id ) =>  `blog/update/${ id }`  ,
    delete : ( id ) =>  `blog/delete/${ id }`  ,
    list: 'blog/posts',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
    detail : ( id ) =>  `blog/posts/${ id }`  ,

  },
  invoice: {
    list: 'preInvoices',
    items: 'preinvoices/items',
    new: 'preInvoices/createPreInvoiceWithItems',
    update: 'preInvoices',
    create: 'preInvoices/create',
    updateBijak: 'preInvoices/bijak',
    delete: 'preInvoices',
    bulkDelete: 'preInvoices',
    detail : ( id ) =>  `preInvoices/${ id }`  ,
  },
  production: {
    list: 'preInvoices/with-items',
    stages : ( id ) =>  `production/${ id }/stages`  ,
    new: 'production/createPreInvoiceWithItems',
    update: 'production/update',
    quickUpdate: 'production/update-production',
    productionItems : ( id ) =>  `production/${ id }/items`  ,
    updateBijak: 'production/bijak',
    delete: 'production',
    bulkDelete: 'production',
    detail : ( id ) =>  `production/${ id }`  ,
  },
  product: {
    list: 'products',
    miniList: 'products/names-ids',
    delete: 'products',
    bulkDelete: 'products',
    upload: 'products',
    new: 'products/create',
    update : ( id ) =>  `products/update${ id }`  ,
    detail : ( id ) =>  `product/${ id }`  ,
  },
  user: {
    roles: 'users/roles',
    list: 'users/users-with-roles',
    delete: 'users',
    bulkDelete: 'users/bulk-delete',
    new: 'auth/createUser',
    update: 'users',
    updateCurrent: 'users/current/update',
    detail : ( id ) =>  `users/${ id }`  ,
  },
  customer: {
    list: 'customers',
    delete: 'customers',
    bulkDelete: 'customers/bulk-delete',
    new: 'customers',
    update: 'customers/admin',
    detail : ( id ) =>  `customers/${ id }`  ,
  },
};
