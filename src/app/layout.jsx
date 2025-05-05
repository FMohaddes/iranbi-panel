import "src/global.css";

import { CONFIG } from "src/config-global";
import { primary } from "src/theme/core/palette";
import {
  LocalizationProvider
} from "src/locales";
import {
  detectLanguage
} from "src/locales/server";
import {
  I18nProvider
} from "src/locales/i18n-provider";
import {
  ThemeProvider
} from "src/theme/theme-provider";
import {
  getInitColorSchemeScript
} from "src/theme/color-scheme-script";

import {
  Snackbar
} from "src/components/snackbar";
import {
  ProgressBar
} from "src/components/progress-bar";
import {
  MotionLazy
} from "src/components/animate/motion-lazy";
import {
  detectSettings
} from "src/components/settings/server";
import {
  SettingsDrawer ,
  defaultSettings ,
  SettingsProvider
} from "src/components/settings";

import {
  AuthProvider as JwtAuthProvider
} from "src/auth/context/jwt";

// ----------------------------------------------------------------------

const AuthProvider = JwtAuthProvider;

export const viewport = {
  width        : "device-width" ,
  initialScale : 1 ,
  themeColor   : primary.main ,
};

const metadataBase = "https://tanteb.com";
export const metadata = async () => ({
  title: "iran-bi",
  description: "",
  applicationName: "iran-bi",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["iran-bi", "shoes"],
  metadataBase,
  openGraph: {
    type: "website",
    url: "https://tanteb-admin.com",
    title: "",
    description: "",
    siteName: "TanTeb",
    images: [{ url: "https://tanteb.com/logo.png" }],
    author: { name: "Fatemeh Mohaddes" },
  },
  icons: [
    { rel: "apple-icon", url: "/apple-icon.png" },
    { rel: "icon", url: "/favicon.ico" },
  ],
});


export default async function RootLayout( { children } ) {
  const lang = CONFIG.isStaticExport ? "fa" : await detectLanguage();

  const settings = CONFIG.isStaticExport ? defaultSettings : await detectSettings();

  return ( <html lang = { lang ?? "fa" }
    suppressHydrationWarning >
    <body >
      { getInitColorSchemeScript }

      <I18nProvider
        lang = { CONFIG.isStaticExport ? undefined : lang } >
        <LocalizationProvider >
          <AuthProvider >
            <SettingsProvider
              settings = { settings }
              caches = { CONFIG.isStaticExport ? "localStorage" : "cookie" }
            >
              <ThemeProvider >
                <MotionLazy >
                  <Snackbar />
                  <ProgressBar />
                  <SettingsDrawer />
                  { children }
                </MotionLazy >
              </ThemeProvider >
            </SettingsProvider >
          </AuthProvider >
        </LocalizationProvider >
      </I18nProvider >
    </body >
  </html > );
}
