import React, { ChangeEvent, CSSProperties, useCallback, useMemo } from "react";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import InputGroupAddon from "reactstrap/lib/InputGroupAddon";
import InputGroupText from "reactstrap/lib/InputGroupText";
import { InputProps } from "./meta";

export interface TextInputProps extends InputProps<string> {
    textarea?: boolean;
    password?: boolean;
    height?: string | number;
    readonly?: boolean;
    prefix?: string;
}

const TextInput: React.FunctionComponent<TextInputProps> = ({ name, value, onChange, onChangeForHook, error, placeholder, textarea, password, height, readonly, prefix }) => {
    const onChangeProxy = useCallback((param: ChangeEvent<HTMLInputElement>) => {
        onChange?.(name, param.target.value);
        onChangeForHook?.(param.target.value);

    }, [name, onChange, onChangeForHook]);
    const style = useMemo<CSSProperties>(() => ({ height, resize: "none" }), [height]);

    const input = <Input
        prefix={prefix}
        type={textarea ? "textarea" : (password ? "password" : "text")}
        onChange={onChangeProxy}
        placeholder={placeholder}
        value={value}
        readOnly={readonly}
        style={style}
        invalid={!!error}
        name={name}
    />;

    if(prefix){
        return <InputGroup>
            <InputGroupAddon addonType="prepend">
                <InputGroupText>{prefix}</InputGroupText>
            </InputGroupAddon>
            {input}
        </InputGroup>;
    }
    return input;
};

export default TextInput;