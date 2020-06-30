import theme from "@core/jssTheme";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useCallback } from "react";
import { createUseStyles } from "react-jss";
import { Input } from "reactstrap";
import { InputProps } from "./meta";

export interface NumberInputProps extends InputProps<number> { }

const useStyles = createUseStyles(
    {
        numberField: {
            display: "flex",
            "& .number-input": {
                flex: 100,
            },
            "& .controls": {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                marginTop: "-2px",
                marginLeft: "4px",
                "& svg": {
                    padding: "2px",
                    margin: "1px",
                    cursor: "pointer",
                },
                "& span": {
                    height: "20px",
                },
                "& svg:hover": {
                    background: theme.current.colors.highlightBackground,
                },
            },
        },
    },
    { name: "numberInput" }
);

const NumberInput: React.FunctionComponent<NumberInputProps> = ({
    name,
    value,
    onChange,
    onChangeForHook,
    error,
}) => {
    const classes = useStyles();
    const onChangeProxy = useCallback(
        (param: ChangeEvent<HTMLInputElement>) => {
            const val = +param.target.value;
            if (isNaN(val)) {
                if (isNaN(+value)) onChange?.(name, 0);
                onChangeForHook?.(0);
                return;
            }
            onChange?.(name, val);
            onChangeForHook?.(val);
        },
        [name, onChange, onChangeForHook, value]
    );
    const up = (): void => onChange(name, +(value || 0) + 1);
    const down = (): void => onChange(name, +(value || 0) - 1);

    return (
        <div className={classes.numberField}>
            <div className="number-input">
                <Input
                    value={value}
                    invalid={!!error}
                    name={name}
                    onChange={onChangeProxy}
                />
            </div>
            <div className="controls">
                <span onClick={up}>
                    <FontAwesomeIcon icon={faChevronUp} />
                </span>
                <span onClick={down}>
                    <FontAwesomeIcon icon={faChevronDown} />
                </span>
            </div>
        </div>
    );
};

export default NumberInput;
