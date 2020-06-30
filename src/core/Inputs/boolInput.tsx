import React, { useCallback } from "react";
import { createUseStyles } from "react-jss";
import Switch from "react-switch";
import { InputProps } from "./meta";

export interface BoolInputProps extends InputProps<boolean> {
    height?: string | number;
    readonly?: boolean;
}

const useStyles = createUseStyles({
    container: {
        display: "flex",
        alignItems: "center",
        "& .content": {
            marginLeft: 15,
        },
    },
}, { name: "boolInput" });

const BoolInput: React.FunctionComponent<BoolInputProps> = ({ name, value, onChange, onChangeForHook, placeholder, readonly }) => {
    const classes = useStyles();
    const onChangeProxy = useCallback((param: boolean) => {
        onChange?.(name, param ? true : null);
        onChangeForHook?.(param ? true : null);
    }, [name, onChange, onChangeForHook]);
    return <div className={classes.container}>
        <Switch height={22} width={45} checked={value} onChange={onChangeProxy} disabled={readonly} />
        <span className="content">
            {placeholder}
        </span>
    </div>;
};

export default BoolInput;