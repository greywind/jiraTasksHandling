import { RegisterInput } from "react-hook-form/dist/types";
import { AvailableLocales } from "@core/services/localeSvc";

export interface InputProps {
    validation?: RegisterInput;
    required?: boolean;
    name: string;
}

export interface DateInputProps extends InputProps {
    format?: string;
}

export interface OptionType { label: string; value: string | number | Date }

export type OptionTypeEnum = {
    [key in AvailableLocales]: OptionType[];
}

export interface SelectInputProps extends InputProps {
    format?: string;
    options?: OptionType[];
}