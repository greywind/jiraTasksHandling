import theme from "@core/jssTheme";
import classnames from "classnames";
import React, { useCallback, useMemo } from "react";
import { createUseStyles } from "react-jss";
import Select from "react-select";
import { StylesConfig } from "react-select/src/styles";
import { Theme } from "react-select/src/types";
import { InputProps } from "./meta";
import { OptionType } from "./types";

export interface SelectInputProps extends InputProps<string> {
    placeholder?: string;
    options: OptionType[] | string[];
    nullable?: boolean;
    multi?: boolean;
    filterOption?: (option: OptionType, rawInput: string) => boolean;
}

function isStringArray(opts: OptionType[] | string[]): opts is string[] {
    return !!opts?.length && typeof opts[0] == "string";
}

const useStyles = createUseStyles(
    {
        "@global .react-select__control": {
            minHeight: 35,
        },
        "@global .react-select__value-container, .react-select__indicator": {
            padding: "0 8px",
        },
        selectError: {
            border: `solid 1px ${theme.current.colors.danger}`,
            borderRadius: theme.current.input.borderRadius,
            "& div:first-child": {
                borderStyle: "unset !important",
            },
        },
    },
    { name: "selectInput" }
);

const SelectInput: React.FunctionComponent<SelectInputProps> = ({
    name,
    placeholder,
    onChange,
    onChangeForHook,
    options,
    value,
    nullable,
    multi,
    error,
    filterOption,
}) => {
    const opts = useMemo((): OptionType[] => {
        let result;
        if (isStringArray(options)) {
            result = options.map((p: string): OptionType => ({ label: p, value: p }));
            if (nullable && !multi)
                result.unshift({
                    value: null,
                    label: placeholder || "select...",
                });
            return result;
        }
        result = [...options];
        if (nullable && !multi)
            result.unshift({ value: null, label: placeholder || "select..." });
        return result;
    }, [multi, nullable, options, placeholder]);
    const val = useMemo(() => {
        const vals = value?.split(",")?.map(p => p.trim());
        if (!vals || !vals.length)
            return [];
        return opts.filter(p => vals.includes(p.value?.toString()));
    }, [opts, value]);
    const onChangeProxy = useCallback(
        (param: OptionType | OptionType[]) => {
            if (param == null) {
                onChange?.(name, null);
                onChangeForHook?.(null);
                return;
            }
            if (Array.isArray(param))
                return void onChange(name, param.map(p => p.value).join(","));
            onChange?.(name, (param.value || "").toString());
            onChangeForHook?.((param.value || "").toString());
        },
        [name, onChange, onChangeForHook]
    );
    const classes = useStyles();
    const reactSelectStyles = useMemo<StylesConfig>(
        () => ({
            indicatorSeparator: () => ({
                display: "none",
            }),
            dropdownIndicator: base => ({
                ...base,
                color: theme.current.colors.fontDefault,
            }),
            control: base => ({
                ...base,
                borderRadius: theme.current.input.borderRadius,
            }),
        }),
        []
    );
    const reactSelectTheme = useCallback(
        (t: Theme): Theme => ({
            ...t,
            colors: {
                ...t.colors,
                primary: "#007bff",
            },
        }),
        []
    );

    return (
        <Select
            onChange={onChangeProxy}
            classNamePrefix="react-select"
            className={classnames({ [classes.selectError]: !!error })}
            value={val}
            isMulti={multi}
            placeholder={placeholder}
            options={opts}
            styles={reactSelectStyles}
            theme={reactSelectTheme}
            filterOption={filterOption}
        />
    );
};

export default SelectInput;
