import { ValidationOptions } from "react-hook-form/dist/types";
import { OptionType } from "./types";
import { ReactNode } from "react";

export type InputValueChanged<T> = (name: string, value: T) => void;

interface SharedProps {
    name?: string;
    placeholder?: string;
}

export interface InputProps<T> extends SharedProps {
    value?: T;
    onChange?: InputValueChanged<T>;
    onChangeForHook?: (value: T) => void;
    error?: string;
}

export interface ValidationRule {
    value: number | Date | string;
    message: string;
}

export declare type FormInputTypes = "string" | "number" | "select" | "date" | "file" | "files" | "bool" | "hidden";

export interface FormInputProps extends SharedProps {
    title?: ReactNode;
    type?: FormInputTypes;
    options?: string[] | OptionType[];
    errorMode?: string;
    layout?: "horizontal" | "vertical";
    nullable?: boolean;
    multi?: boolean;
    validation?: ValidationOptions;
    required?: boolean | string;
    max?: ValidationRule;
    min?: ValidationRule;
    fileId?: string;
    filesId?: string[];
    textarea?: boolean;
    readonly?: boolean;
    height?: number | string;
    password?: boolean;
    prefix?: string;
    titleWidth?: string;
}
