import { fSub } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import {
  _id,
  _roles,
  _prices,
  _emails,
  _ratings,
  _percents,
  _booleans,
  _lastNames,
  _fullAddress,
  _descriptions,
  _phoneNumbers,
  _countryNames,
} from './assets';

// ----------------------------------------------------------------------

const { assetURL } = CONFIG.site;

export const _mock = {
  id: (index) => _id[index],
  time: (index) => fSub({ days: index, hours: index }),
  boolean: (index) => _booleans[index],
  role: (index) => _roles[index],
  // Text
  description: (index) => _descriptions[index],
  // Contact
  email: (index) => _emails[index],
  phoneNumber: (index) => _phoneNumbers[index],
  fullAddress: (index) => _fullAddress[index],
  // Name
  lastName: (index) => _lastNames[index],
  countryNames: (index) => _countryNames[index],
  // Number
  number: {
    percent: (index) => _percents[index],
    rating: (index) => _ratings[index],
    price: (index) => _prices[index],
  },
  // Image
  image: {
    cover: (index) => `${assetURL}/assets/images/cover/cover-${index + 1}.webp`,
    avatar: (index) => `${assetURL}/assets/images/avatar/avatar-${index + 1}.webp`,
    travel: (index) => `${assetURL}/assets/images/travel/travel-${index + 1}.webp`,
    product: (index) => `${assetURL}/assets/images/m-product/product-${index + 1}.webp`,
  },
};
