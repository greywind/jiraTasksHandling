import React from "react";
import localeSvc, { AvailableLocales } from "../core/services/localeSvc";

interface LocaleSvcContext {
    locale: AvailableLocales;
}
export const LocaleSvcContext = React.createContext<LocaleSvcContext>(null);

const ServicesProvider: React.FunctionComponent = ({ children }) => {
    const [localeSvcValue, setLocaleSvcValue] = React.useState<LocaleSvcContext>({
        locale: "ru",
    });
    React.useEffect(() => {
        const localeChangeHandler = (): void => {
            const locale = localeSvc.getLocale();
            setLocaleSvcValue({ locale });
        };
        localeSvc.subscribeOnLocaleChange(localeChangeHandler);
        return () => localeSvc.unsubscribeOnLocaleChange(localeChangeHandler);
    }, []);

    return (
        <LocaleSvcContext.Provider value={localeSvcValue}>
            {children}
        </LocaleSvcContext.Provider>
    );
};

export default ServicesProvider;
