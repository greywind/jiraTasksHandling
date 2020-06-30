import theme from "@core/jssTheme";
import { If } from "@core/types";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import isArray from "lodash/isArray";
import moment from "moment";
import React, { ReactNode, useCallback, useMemo } from "react";
import { RegisterInput } from "react-hook-form/dist/types";
import { createUseStyles } from "react-jss";
import { Tooltip } from "react-tippy";
import { Alert } from "reactstrap";
import { FileInfo } from "src/models/file";
import BoolInput from "./boolInput";
import DateInput from "./dateInput";
import { FileInput, FilesInput } from "./fileInput";
import { FormInputProps, FormInputTypes } from "./meta";
import NumberInput from "./numberInput";
import SelectInput from "./selectInput";
import { SharedFormProps, useSshFormContext } from "./sshFormContext";
import TextInput from "./textInput";

interface LayoutProps extends SharedFormProps {
    content: JSX.Element;
    title: ReactNode;
    type: FormInputTypes;
}
const useHorizontalStyles = createUseStyles({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        margin: (p: Partial<SharedFormProps>) => p.autoMargin ? "0 0 10px 0" : "unset",
    },
    title: {
        minWidth: (p: Partial<SharedFormProps>) => p.titleWidth || "unset",
        padding: (p: Partial<SharedFormProps>) => p.autoMargin ? "6px 10px 0px 0px" : "unset",
        whiteSpace: "nowrap",
    },
    content: {
        width: "100%",
        whiteSpace: "nowrap",
    },
    file: {
        overflow: "hidden",
    },
    error: {
        fontSize: "12px",
        padding: "7px 0 0 7px",
    },
}, { name: "formInput" });
const HorizontalLayout: React.FunctionComponent<LayoutProps> = ({ content, title, autoMargin, type, titleWidth }) => {
    const formMethods = useSshFormContext();
    const name = useMemo(() => content.props.name, [content]);
    const autoMarginValue = useMemo(() => {
        return autoMargin === false
            ? false
            : formMethods.autoMargin === false ? false : true;
    }, [autoMargin, formMethods.autoMargin]);
    const error = useMemo(() => {
        return formMethods.errors[name];
    }, [formMethods.errors, name]);
    const classes = useHorizontalStyles({ ...formMethods, autoMargin: autoMarginValue, titleWidth: titleWidth || formMethods.titleWidth || "unset" });
    return <div className={classnames(classes.wrapper, "wrapper")}>
        <If condition={!!title}>
            <div className={classnames(classes.title, "title")}>{title}</div>
        </If>
        <div className={classnames(classes.content, "content", type)}>{content}</div>
        <If condition={!!error}>
            <div className={classnames(classes.error, "error")}>
                <Tooltip position="bottom" html={<Alert color="danger">{error.message}</Alert>}>
                    <FontAwesomeIcon icon={faExclamationCircle} color="#dc3545" size="lg" />
                </Tooltip>
            </div>
        </If>
    </div>;
};

const useVerticalStyles = createUseStyles({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    header: {
        display: "flex",
        contentAlign: "space-between",
        alignItems: "center",
        padding: (p: Partial<SharedFormProps>) => p.autoMargin ? "8px 0 5px 3px" : "unset",
        fontSize: "13px",
        lineHeight: "18px",
    },
    title: {
        whiteSpace: "nowrap",
        marginRight: 30,
        fontWeight: 300,
        color: "#A9A9A9",
    },
    error: {
        width: "100%",
        textAlign: "right",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        color: theme.current.colors.danger,
    },
}, { name: "formInput" });
const VerticalLayout: React.FunctionComponent<LayoutProps> = ({ content, title, autoMargin }) => {
    const name = content.props.name;
    const formMethods = useSshFormContext();
    const autoMarginValue = useMemo(() => {
        return autoMargin === false
            ? false
            : formMethods.autoMargin === false ? false : true;
    }, [autoMargin, formMethods.autoMargin]);
    const classes = useVerticalStyles({ ...formMethods, autoMargin: autoMarginValue });
    return <div className={classnames(classes.wrapper, "wrapper")}>
        <div className={classnames(classes.header, "header")}>
            <If condition={!!title}>
                <div className={classnames(classes.title, "title")}>{title}</div>
            </If>
            <If condition={formMethods.errors[name] && !!formMethods.errors[name].message}>
                <div className={classnames(classes.error, "error")}>{formMethods.errors[name] && formMethods.errors[name].message}</div>
            </If>
        </div>
        <div className="content">{content}</div>
    </div>;
};

const FormInput: React.FunctionComponent<FormInputProps> = ({ name, type = "string", title, layout, options, placeholder, nullable, multi,
    required, max, min, fileId, filesId, textarea, readonly, height, validation, password, prefix, titleWidth }) => {
    const formMethods = useSshFormContext();
    const { getValues, setValue } = formMethods;
    let value = getValues()[name];
    if (value === undefined)
        value = "";

    const onChangeProxy = useCallback((_: string, value: any) => {
        if (isArray(value))
            value = value.join(",");
        setValue(name, value);
    }, [name, setValue]);
    const onFileChangeProxy = useCallback((_: string, value: FileInfo) => {
        setValue(name, value?.id || null);
    }, [name, setValue]);
    const onFilesChangeProxy = useCallback((_: string, value: FileInfo[]) => {
        const result = value?.map(p => p.id) || null;
        setValue(name, result);
    }, [name, setValue]);
    const validationProxy = useMemo(() => {
        let result: RegisterInput = {};
        result.required = required === true ? "required" : required;
        switch (type) {
            case "date":
                result.validate = (data: number) => {
                    if (max && moment(data) > moment(max.value))
                        return max.message;
                    if (min && moment(data) < moment(min.value))
                        return min.message;
                    if (required && isNaN(data))
                        return required;
                    return true;
                };
                break;
            case "number":
                result.validate = (data: number) => {
                    if (max && +data > +max.value)
                        return max.message;
                    if (min && +data < +min.value)
                        return min.message;
                    if (required && isNaN(data))
                        return required;
                    return true;
                };
                break;
            case "string":
                result = validation || result;
                result.required = required === true ? "required" : required;
                break;
        }
        return result;
    }, [max, min, required, type, validation]);
    let proxyBooleanValue = useMemo(() => {
        if (value == "true" || value == true)
            return true;
        return false;
    }, [value]);
    const input = useMemo(() => {
        switch (type) {
            case "hidden":
                return <input name={name} type="hidden" value={value} />;
            case "date":
                return <DateInput
                    error={formMethods.errors?.[name]?.message}
                    value={value}
                    readonly={readonly}
                    min={min}
                    onChange={onChangeProxy}
                    name={name} />;
            case "string":
                return <TextInput onChange={onChangeProxy}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    password={password}
                    textarea={textarea || multi}
                    readonly={readonly}
                    height={height}
                    prefix={prefix}
                    error={formMethods.errors?.[name]?.message} />;
            case "number":
                return <NumberInput onChange={onChangeProxy}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    error={formMethods.errors?.[name]?.message} />;
            case "bool":
                return <BoolInput onChange={onChangeProxy}
                    name={name}
                    value={proxyBooleanValue}
                    placeholder={placeholder}
                    readonly={readonly}
                    error={formMethods.errors?.[name]?.message} />;
            case "select":
                return <SelectInput
                    error={formMethods.errors?.[name]?.message}
                    onChange={onChangeProxy}
                    options={options}
                    name={name}
                    nullable={nullable}
                    multi={multi}
                    placeholder={placeholder}
                    value={value} />;
            case "file":
                return <FileInput
                    name={name}
                    error={formMethods.errors?.[name]?.message}
                    onChange={onFileChangeProxy}
                    fileId={formMethods.getValues()?.[name]} />;
            case "files":
                return <FilesInput
                    filesId={formMethods.getValues()?.[name]}
                    name={name}
                    error={formMethods.errors?.[name]?.message}
                    onChange={onFilesChangeProxy} />;
        }
    }, [formMethods, height, min, multi, name, nullable, onChangeProxy, onFileChangeProxy, onFilesChangeProxy, options, password, placeholder, prefix, proxyBooleanValue, readonly, textarea, type, value]);
    const layoutElement = useMemo(() => {
        const layoutValue = layout || formMethods.layout;
        if (layoutValue == "vertical")
            return <VerticalLayout content={input} title={title} type={type} />;
        return <HorizontalLayout content={input} title={title} type={type} titleWidth={titleWidth} />;
    }, [layout, formMethods.layout, input, title, type, titleWidth]);
    return <>
        <If condition={type != "hidden"}>
            {layoutElement}
        </If>
        <input type="hidden" name={name} value={value} ref={formMethods.register(validationProxy)} />
    </>;
};

export default FormInput;