import React, { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { If } from "@core/types";
import { InputValueChanged } from "./meta";
import { SshPanel, SshTabs } from "./tabs";
import TextInput from "./textInput";

interface MarkdownInputProps {
    minHeight?: number | string;
    customControl?: React.ReactNode;
    onChange: InputValueChanged<string>;
    value: string;
    customPreview?: (content: ReactNode) => ReactNode;
}

const MarkdownEditor: React.FunctionComponent<MarkdownInputProps> = props => {
    return <SshTabs customControl={props.customControl}>
        <SshPanel title="Редактор">
            <TextInput onChange={props.onChange}
                value={props.value}
                height={props.minHeight}
                name="source"
                textarea
            />
        </SshPanel>
        <SshPanel title="Предпросмотр">
            <div style={{ minHeight: props.minHeight }}>
                <If condition={!!props.customPreview}>
                    {props.customPreview(props.value)}
                </If>
                <If condition={!props.customPreview}>
                    <ReactMarkdown source={props.value} />
                </If>
            </div>
        </SshPanel>
    </SshTabs>;
};

export default MarkdownEditor;