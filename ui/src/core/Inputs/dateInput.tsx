import classnames from "classnames";
import React, { useCallback, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createUseStyles } from "react-jss";
import { InputProps, ValidationRule } from "./meta";

export interface DateInputProps extends InputProps<Date> {
    format?: string;
    readonly?: boolean;
    min?: ValidationRule;
}

const useStyles = createUseStyles(
    {
        wrapper: {
            "& .react-datepicker-wrapper": { width: "100%" },
            "& .react-datepicker__input-container": { width: "100%" },
        },
    },
    { name: "dateInput" }
);

const DateInput: React.FunctionComponent<DateInputProps> = ({
    name,
    value,
    onChange,
    onChangeForHook,
    error,
    format,
    readonly,
    min,
}) => {
    const classes = useStyles();
    const onChangeProxy = useCallback(
        (param: Date) => {
            onChange?.(name, param);
            onChangeForHook?.(param);
        },
        [name, onChange, onChangeForHook]
    );
    const selected = useMemo(() => (value ? new Date(value) : null), [value]);
    return (
        <div className={classes.wrapper}>
            <DatePicker
                selected={selected}
                readOnly={readonly}
                onChange={onChangeProxy}
                minDate={min?.value ? (min.value as Date) : undefined}
                className={classnames({
                    "form-control": true,
                    "w-100": true,
                    "is-invalid": !!error,
                })}
                dateFormat={format || "dd MMMM yyyy"}
            />
        </div>
    );
};

export default DateInput;
