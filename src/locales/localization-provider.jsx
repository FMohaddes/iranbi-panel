/* eslint-disable perfectionist/sort-imports */

'use client';

import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import 'dayjs/locale/fr';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/ar-sa';

import dayjs from 'dayjs';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { LocalizationProvider as Provider } from '@mui/x-date-pickers/LocalizationProvider';

import { useTranslate } from './use-locales';

// ----------------------------------------------------------------------
const cacheRtl = createCache({
  key: 'adapter-date-fns-jalali-demo',
  stylisPlugins: [prefixer, rtlPlugin],
});

export function LocalizationProvider({ children }) {
  const { currentLang } = useTranslate();

  dayjs.locale(currentLang.adapterLocale);

  return (
    <Provider dateAdapter={AdapterMomentJalaali}>
      {children}
    </Provider>
  );
}
