import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import JSONPretty from "react-json-pretty";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import { FileInfo } from "src/models/file";
import { FileInput, FilesInput } from "./fileInput";
import FormInput from "./formInput";
import MarkdownEditor from "./markdown";
import { InputValueChanged } from "./meta";
import SelectInput from "./selectInput";
import SshFormContext, { Layouts } from "./sshFormContext";
import { SshPanel, SshTabs } from "./tabs";
import TextInput from "./textInput";
import BoolInput from "./boolInput";

interface FakeFormProps {
    layout?: "vertical" | "horizontal";
    autoMargin?: boolean;
}

const FakeForm: React.FunctionComponent<FakeFormProps> = props => {
    const form = useForm();
    const [layout, setlayout] = useState<Layouts>("vertical");
    const [autoMargin, setAutoMargin] = useState<string>("true");
    const validate = form.handleSubmit(data => {
        alert(JSON.stringify(data));
    });
    const onLayoutChanged: InputValueChanged<Layouts> = useCallback(
        (_, value) => setlayout(value),
        []
    );
    const onAutoMarginChanged: InputValueChanged<string> = useCallback(
        (_, value) => setAutoMargin(value),
        []
    );
    return (
        <>
            <Row>
                <Col md={3}>
                    <SelectInput
                        name="layout"
                        onChange={onLayoutChanged}
                        placeholder="Layout"
                        value={layout}
                        options={["vertical", "horizontal"]}
                    />
                </Col>
                <Col md={3}>
                    <SelectInput
                        name="layout"
                        onChange={onAutoMarginChanged}
                        placeholder="Layout"
                        value={autoMargin}
                        options={["true", "false"]}
                    />
                </Col>
                <Col md={{ size: 2, offset: 4 }}>
                    <Button onClick={validate} color="primary">
                        Do
        </Button>
                </Col>
            </Row>
            <hr />
            <SshFormContext
                {...form}
                titleWidth={200}
                layout={layout}
                autoMargin={autoMargin == "true"}
            >
                <>{props.children}</>
                <hr />
                <JSONPretty json={form.getValues()} />
            </SshFormContext>
        </>
    );
};

storiesOf("Inputs2", module)
    .add("Form inputs", () => {
        const [file, setFile] = useState<FileInfo>();
        const onFileChanged: InputValueChanged<FileInfo> = useCallback(
            (_, file) => {
                setFile(file);
                setFile(null);
            },
            []
        );
        const [files, setFiles] = useState<FileInfo[]>();
        const onFilesChanged: InputValueChanged<FileInfo[]> = useCallback(
            (_, files) => {
                setFiles(files);
            },
            []
        );
        const clearFile = useCallback(() => {
            setFile(null);
        }, []);
        return (
            <Container fluid>
                <br />
                <Row>
                    <Col md={6}>
                        <FakeForm>
                            <FormInput
                                title="vertical value"
                                name="verticalStringValue"
                                type="string"
                                required
                            />
                            <FormInput
                                title="horizontal value"
                                name="horizontalStringValue"
                                type="string"
                                required
                            />
                            <FormInput
                                title="select"
                                options={["red", "green", "blue"]}
                                placeholder="select color"
                                name="selectColor"
                                type="select"
                                required
                                nullable
                            />
                            <FormInput
                                title="multi select"
                                options={["red", "green", "blue"]}
                                placeholder="select color"
                                name="multiSelectColor"
                                type="select"
                                multi
                                nullable
                            />
                            <FormInput
                                title="number value"
                                name="numberValue"
                                type="number"
                                required
                                min={{ value: 3, message: "min value is 3" }}
                                max={{ value: 15, message: "max value is 15" }}
                            />
                            <FormInput
                                title="Date value"
                                name="dateValue"
                                type="date"
                                required
                                min={{
                                    value: new Date("2012-09-12"),
                                    message: "min value is 2012-09-12",
                                }}
                                max={{
                                    value: new Date("2012-12-15"),
                                    message: "max value is 2012-12-15",
                                }}
                            />
                            <FormInput title="Image" name="image" type="file" required />
                            <FormInput title="Images" name="images" type="files" required />
                            <FormInput
                                placeholder="checkbox"
                                name="checkbox"
                                type="bool"
                                required
                            />
                        </FakeForm>
                    </Col>
                    <Col md={6}>
                        <div style={{ display: "flex" }}>
                            <div style={{ flex: 10 }}>
                                <FileInput
                                    name="image1c"
                                    onChange={onFileChanged}
                                    value={file}
                                    fileId="6ccb758c-2b32-4d53-a6c6-9696deba46cd"
                                />
                                <FilesInput
                                    name="files"
                                    value={files}
                                    onChange={onFilesChanged}
                                    filesId="6ccb758c-2b32-4d53-a6c6-9696deba46cd, b7a7b572-0c3a-4050-9b67-7fd3990f6abc"
                                />
                            </div>
                            <div style={{ flex: 1, paddingLeft: "15px" }}>
                                <Button onClick={clearFile}>Clear</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    })
    .add("markdown", () => {
        return <MarkdownEditor onChange={action("onChange")} value={""} />;
    })
    .add("verticalTabs", () => {
        const [p1, setP1] = useState("");
        const [p2, setP2] = useState("");
        const [b, setB] = useState(true);
        return (
            <SshTabs layout="vertical">
                <SshPanel title="panel1">
                    <h1>Panel1: {p1}</h1>
                    <TextInput name="panel1" onChange={(n, value) => setP1(value)} />
                </SshPanel>
                <SshPanel title="panel2">
                    <h1>Panel2: {p2}</h1>
                    <TextInput name="panel2" onChange={(n, value) => setP2(value)} />
                </SshPanel>
                <SshPanel title="panel3">
                    <h1>Panel3: {p2}</h1>
                    <SshTabs>
                        <SshPanel title="panel3">
                            <h1>Panel2: {p2}</h1>
                            <TextInput name="panel23" onChange={(n, value) => setP2(value)} />
                        </SshPanel>
                        <SshPanel title="panel4">
                            <h1>Panel21 {p2}</h1>
                            <TextInput name="panel23" onChange={(n, value) => setP2(value)} />
                            <BoolInput name="b1" value={b} onChange={() => setB(!b)} />
                            <BoolInput name="b2" value={!b} onChange={() => setB(!b)} />
                        </SshPanel>
                    </SshTabs>
                </SshPanel>
            </SshTabs>
        );
    })
    .add("horizontal tabs", () => {
        const [p1, setP1] = useState("");
        const [p2, setP2] = useState("");
        const [p3, setP3] = useState("");
        const [b, setB] = useState(true);
        return (
            <SshTabs layout="horizontal">
                <SshPanel title="panel1">
                    <h1>Panel1: {p1}</h1>
                    <TextInput name="panel1" onChange={(n, value) => setP1(value)} />
                </SshPanel>
                <SshPanel title="panel2">
                    <h1>Panel2: {p2}</h1>
                    <TextInput name="panel2" onChange={(n, value) => setP2(value)} />
                </SshPanel>
                <SshPanel title="panel3">
                    <h1>Panel3: {p3}</h1>
                    <SshTabs layout="vertical">
                        <SshPanel title="panel2">
                            <h1>Panel2: {p2}</h1>
                            <TextInput name="panel2" onChange={(n, value) => setP2(value)} />
                        </SshPanel>
                        <SshPanel title="panel3">
                            <h1>Panel3 {p3}</h1>
                            <TextInput name="panel3" onChange={(n, value) => setP3(value)} />
                            <BoolInput name="b1" value={b} onChange={() => setB(!b)} />
                            <BoolInput name="b2" value={!b} onChange={() => setB(!b)} />
                        </SshPanel>
                    </SshTabs>
                </SshPanel>
            </SshTabs>
        );
    })
    .add("separate tabs", () => {
        const [p1, setP1] = useState("");
        const [p2, setP2] = useState("");
        const [p3, setP3] = useState("");
        const [b, setB] = useState(true);
        return (
            <SshTabs layout="separateTabs">
                <SshPanel title="panel1">
                    <h1>Panel1: {p1}</h1>
                    <TextInput name="panel1" onChange={(n, value) => setP1(value)} />
                </SshPanel>
                <SshPanel title="panel2">
                    <h1>Panel2: {p2}</h1>
                    <TextInput name="panel2" onChange={(n, value) => setP2(value)} />
                </SshPanel>
                <SshPanel title="panel3">
                    <h1>Panel3: {p3}</h1>
                    <SshTabs layout="vertical">
                        <SshPanel title="panel2">
                            <h1>Panel2: {p2}</h1>
                            <TextInput name="panel2" onChange={(n, value) => setP2(value)} />
                        </SshPanel>
                        <SshPanel title="panel3">
                            <h1>Panel3 {p3}</h1>
                            <TextInput name="panel3" onChange={(n, value) => setP3(value)} />
                            <BoolInput name="b1" value={b} onChange={() => setB(!b)} />
                            <BoolInput name="b2" value={!b} onChange={() => setB(!b)} />
                        </SshPanel>
                    </SshTabs>
                </SshPanel>
            </SshTabs>
        );
    })
    .add(
        "separate tabs on small screen",
        () => {
            const [p1, setP1] = useState("");
            const [p2, setP2] = useState("");
            const [p3, setP3] = useState("");
            const [b, setB] = useState(true);
            return (
                <SshTabs layout="separateTabs">
                    <SshPanel title="panel1">
                        <h1>Panel1: {p1}</h1>
                        <TextInput name="panel1" onChange={(n, value) => setP1(value)} />
                    </SshPanel>
                    <SshPanel title="panel2">
                        <h1>Panel2: {p2}</h1>
                        <TextInput name="panel2" onChange={(n, value) => setP2(value)} />
                    </SshPanel>
                    <SshPanel title="panel3">
                        <h1>Panel3: {p3}</h1>
                        <SshTabs layout="vertical">
                            <SshPanel title="panel2">
                                <h1>Panel2: {p2}</h1>
                                <TextInput
                                    name="panel2"
                                    onChange={(n, value) => setP2(value)}
                                />
                            </SshPanel>
                            <SshPanel title="panel3">
                                <h1>Panel3 {p3}</h1>
                                <TextInput
                                    name="panel3"
                                    onChange={(n, value) => setP3(value)}
                                />
                                <BoolInput name="b1" value={b} onChange={() => setB(!b)} />
                                <BoolInput name="b2" value={!b} onChange={() => setB(!b)} />
                            </SshPanel>
                        </SshTabs>
                    </SshPanel>
                </SshTabs>
            );
        },
        { viewport: { defaultViewport: "iphonex" } }
    );
