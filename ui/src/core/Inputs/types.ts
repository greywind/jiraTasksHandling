import { AvailableLocales } from "@core/services/localeSvc";
import { ReactNode } from "react";
import { ValidationOptions } from "react-hook-form/dist/types";

export interface InputProps {
    validation?: ValidationOptions;
    required?: boolean;
    name: string;
}

export interface DateInputProps extends InputProps {
    format?: string;
}

export interface OptionType {
    label: ReactNode;
    value: string | number | Date;
}

export type OptionTypeEnum = {
    [key in AvailableLocales]: OptionType[];
};

export interface SelectInputProps extends InputProps {
    format?: string;
    options?: OptionType[];
}
