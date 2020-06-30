import { registerLocale, registerUseLocale } from "@core/services/localeSvc";
import React from "react";
import commonLocaleValues from "src/sharedLocales/common";


export type Locale = {
    [key in keyof typeof commonLocaleValues]?: React.ReactNode;
};

const localeKey = "common";

const useLocale = (): Locale => {
    const [locale, setLocale] = React.useState<Locale>({});
    React.useEffect(() => { registerUseLocale(localeKey, (l: Locale) => setLocale(l)); }, [setLocale]);

    return locale;
};

export default useLocale;

registerLocale(localeKey, commonLocaleValues);
