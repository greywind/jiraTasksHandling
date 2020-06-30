import { registerLocale, registerUseLocale } from "@core/services/localeSvc";
import React from "react";

const values = {};
export type Locale = {
  [key in keyof typeof values]?: React.ReactNode;
};

const localeKey = "route";

const useLocale = (): Locale => {
  const [locale, setLocale] = React.useState<Locale>({});
  React.useEffect(() => {
    registerUseLocale(localeKey, (l: Locale) => setLocale(l));
  }, [setLocale]);

  return locale;
};

export default useLocale;

registerLocale(localeKey, values);
