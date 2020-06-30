import { registerLocale, registerUseLocale } from "@core/services/localeSvc";
import React from "react";

const values = {
    propName: {
        "en": "English version of page1",
        "ru": "Русская версия страницы 1",
    },
};
export type Locale = {
    [key in keyof typeof values]?: React.ReactNode;
};

const localeKey = "page1";

const useLocale = (): Locale => {
    const [locale, setLocale] = React.useState<Locale>({});
    React.useEffect(() => { registerUseLocale(localeKey, (l: Locale) => setLocale(l)); }, [setLocale]);

    return locale;
};

export default useLocale;

registerLocale(localeKey, values);
