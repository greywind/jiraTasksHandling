import React from "react";
import { FormContextValues } from "react-hook-form";

export declare type Layouts = "vertical" | "horizontal";

export interface SharedFormProps {
    titleWidth?: number | string;
    layout?: Layouts;
    autoMargin?: boolean;
}

interface SshFormProps extends FormContextValues, SharedFormProps { }

const SshFormContextBase = React.createContext<Partial<SshFormProps>>({});

export const useSshFormContext = (): SshFormProps =>
    React.useContext(SshFormContextBase) as SshFormProps;

const SshFormContext: React.FunctionComponent<SshFormProps> = props => (
    <SshFormContextBase.Provider value={props}>
        {props.children}
    </SshFormContextBase.Provider>
);

export default SshFormContext;
