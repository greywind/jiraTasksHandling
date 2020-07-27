import localeSvc, { AvailableLocales } from "@core/services/localeSvc";
import tasksSvc from "@services/tasksSvc";
import React from "react";
import { Issue } from "src/models/task";

interface LocaleSvcContext {
    locale: AvailableLocales;
}
export const LocaleSvcContext = React.createContext<LocaleSvcContext>(null);

export const TasksSvcContext = React.createContext<typeof tasksSvc>({
    getAllIssuesInTheCurrentSprint: async () => [],
    createQASubtask: async () => ({} as unknown as Issue),
    createCRSubtask: async () => ({} as unknown as Issue),
    getAllUsers: async () => [],
    assignUser: async () => undefined,
});

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
            <TasksSvcContext.Provider value={tasksSvc}>
                {children}
            </TasksSvcContext.Provider>
        </LocaleSvcContext.Provider>
    );
};

export default ServicesProvider;
