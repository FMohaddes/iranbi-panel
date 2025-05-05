import { formatNumberLocale } from 'src/locales';

// ----------------------------------------------------------------------

const DEFAULT_LOCALE = { code: 'fa-IR', currency: 'IRR' };


function processInput(inputValue) {
  if (inputValue == null || Number.isNaN(inputValue)) return null;
  return Number(inputValue);
}

// ----------------------------------------------------------------------

export function fNumber(inputValue, options) {
  const locale = formatNumberLocale() || DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat(locale.code, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm;
}

// ----------------------------------------------------------------------

export function fCurrency(inputValue, options) {
  const locale = formatNumberLocale() || DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat(locale.code).format(number);

  return `${fm}`;
}

// ----------------------------------------------------------------------

export function fPercent(inputValue, options) {
  const locale = formatNumberLocale() || DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat(locale.code, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    ...options,
  }).format(number / 100);

  return fm;
}

// ----------------------------------------------------------------------

export function fShortenNumber(inputValue, options) {
  const locale = formatNumberLocale() || DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat(locale.code, {
    notation: 'compact',
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm.replace(/[A-Z]/g, (match) => match?.toLowerCase());
}

// ----------------------------------------------------------------------

export function fData(inputValue) {
  const number = processInput(inputValue);
  if (number === null || number === 0) return '0 bytes';

  const units = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
  const decimal = 2;
  const baseValue = 1024;

  const index = Math.floor(Math.log(number) / Math.log(baseValue));
  const fm = `${parseFloat((number / baseValue ** index).toFixed(decimal))} ${units[index]}`;

  return fm;
}


export const toPersianDigits = (str) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const specialCharMap = {
    ",": "،",
    "(": "﴿",
    ")": "﴾",
    ";": "؛",
    "?": "؟",
    "-": "−",
    "_": "ـ"
  };

  return str.split('').map(char => {
    if (/\d/.test(char)) {
      return persianDigits[+char];
    }
    if (specialCharMap[char]) {
      return specialCharMap[char];
    }
    return char;
  }).join('');
};

const decodeHtmlEntities = (text) => {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&nbsp;': ' ',
    '&zwnj;': '', // Zero-width non-joiner
    '&iexcl;': '¡',
    '&cent;': '¢',
    '&pound;': '£',
    '&curren;': '¤',
    '&yen;': '¥',
    '&brvbar;': '¦',
    '&sect;': '§',
    '&uml;': '¨',
    '&copy;': '©',
    '&ordf;': 'ª',
    '&laquo;': '«',
    '&not;': '¬',
    '&shy;': '­',
    '&reg;': '®',
    '&macr;': '¯',
    '&deg;': '°',
    '&plusmn;': '±',
    '&sup2;': '²',
    '&sup3;': '³',
    '&acute;': '´',
    '&micro;': 'µ',
    '&para;': '¶',
    '&middot;': '·',
    '&cedil;': '¸',
    '&sup1;': '¹',
    '&ordm;': 'º',
    '&raquo;': '»',
    '&frac14;': '¼',
    '&frac12;': '½',
    '&frac34;': '¾',
    '&iquest;': '¿',
    '&Agrave;': 'À',
    '&Aacute;': 'Á',
    '&Acirc;': 'Â',
    '&Atilde;': 'Ã',
    '&Auml;': 'Ä',
    '&Aring;': 'Å',
    '&AElig;': 'Æ',
    '&Ccedil;': 'Ç',
    '&Egrave;': 'È',
    '&Eacute;': 'É',
    '&Ecirc;': 'Ê',
    '&Euml;': 'Ë',
    '&Igrave;': 'Ì',
    '&Iacute;': 'Í',
    '&Icirc;': 'Î',
    '&Iuml;': 'Ï',
    '&ETH;': 'Ð',
    '&Ntilde;': 'Ñ',
    '&Ograve;': 'Ò',
    '&Oacute;': 'Ó',
    '&Ocirc;': 'Ô',
    '&Otilde;': 'Õ',
    '&Ouml;': 'Ö',
    '&times;': '×',
    '&Oslash;': 'Ø',
    '&Ugrave;': 'Ù',
    '&Uacute;': 'Ú',
    '&Ucirc;': 'Û',
    '&Uuml;': 'Ü',
    '&Yacute;': 'Ý',
    '&THORN;': 'Þ',
    '&szlig;': 'ß',
    '&agrave;': 'à',
    '&aacute;': 'á',
    '&acirc;': 'â',
    '&atilde;': 'ã',
    '&auml;': 'ä',
    '&aring;': 'å',
    '&aelig;': 'æ',
    '&ccedil;': 'ç',
    '&egrave;': 'è',
    '&eacute;': 'é',
    '&ecirc;': 'ê',
    '&euml;': 'ë',
    '&igrave;': 'ì',
    '&iacute;': 'í',
    '&icirc;': 'î',
    '&iuml;': 'ï',
    '&eth;': 'ð',
    '&ntilde;': 'ñ',
    '&ograve;': 'ò',
    '&oacute;': 'ó',
    '&ocirc;': 'ô',
    '&otilde;': 'õ',
    '&ouml;': 'ö',
    '&divide;': '÷',
    '&oslash;': 'ø',
    '&ugrave;': 'ù',
    '&uacute;': 'ú',
    '&ucirc;': 'û',
    '&uuml;': 'ü',
    '&yacute;': 'ý',
    '&thorn;': 'þ',
    '&yuml;': 'ÿ',
  };

  return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
};
export const stripHtmlTags = (html) => {
  let text = html.replace(/<\/?[^>]+(>|$)/g, "");
  text = decodeHtmlEntities(text);
  return text;
};
