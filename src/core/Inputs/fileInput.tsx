import theme from "@core/jssTheme";
import configSvc from "@core/services/configSvc";
import { For, If } from "@core/types";
import { readableDataSize } from "@core/utils";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fileSvc from "@services/fileSvc";
import classnames from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { createUseStyles } from "react-jss";
import { Tooltip } from "react-tippy";
import Button from "reactstrap/lib/Button";
import Progress from "reactstrap/lib/Progress";
import { FileInfo } from "src/models/file";
import { InputProps } from "./meta";

type Statuses = "NoFile" | "UploadingFile" | "File";
declare let file: FileInfo;

const useStyles = createUseStyles(
    {
        dropZone: {
            border: (p: Partial<NoFileViewProps>) =>
                `dashed 1px ${p?.error
                    ? theme.current.colors.danger
                    : theme.current.colors.regularBorder
                }`,
            borderRadius: theme.current.input.borderRadius,
            outline: "none",
            "&:hover": {
                backgroundColor: theme.current.colors.lightBorder,
                cursor: "pointer",
            },
        },
        dropZoneContent: {
            height: 36,
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: "0 15px",
        },
        dropZoneUploading: {
            border: `solid 1px ${theme.current.colors.regularBorder}`,
        },
        dropZoneUploadingContent: {
            height: 36,
            display: "flex",
            alignItems: "center",
            width: "100%",
            "& .progress": {
                width: "100%",
                margin: "0 15px",
            },
        },
        linkButton: {
            padding: "0",
            overflow: "hidden",
            textOverflow: "ellipsis",
        },
        imagePrevirew: {
            marginTop: "14px",
            border: `solid 1px ${theme.current.colors.regularBorder}`,
            background: "#fff",
            padding: 5,
            "& img": {
                maxWidth: "100px",
                maxheight: "100px",
            },
        },
        dropZoneContentExists: {
            border: `solid 1px ${theme.current.colors.regularBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 10px",
            width: "100%",
            height: "100%",
            minHeight: "38px",
            "& div": {
                cursor: "pointer",
                marginTop: 3,
            },
        },
        filesContainer: {
            border: (p: Partial<FilesInputProps>) =>
                `solid 1px ${p?.error
                    ? theme.current.colors.danger
                    : theme.current.colors.regularBorder
                }`,
            padding: 5,
        },
    },
    { name: "fileInput" }
);

export interface NoFileViewProps {
    onDrop: (files: File[]) => Promise<void>;
    error: string;
    innerRef?: React.LegacyRef<HTMLInputElement>;
}

const NoFileView: React.FunctionComponent<NoFileViewProps> = ({
    onDrop,
    error,
    innerRef,
}) => {
    const classes = useStyles({ error });
    return (
        <Dropzone preventDropOnDocument onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => {
                return (
                    <div {...getRootProps()} className={classes.dropZone}>
                        <div
                            className={classnames({
                                [classes.dropZoneContent]: true,
                            })}
                        >
                            Drop file here or click to upload
              <input {...getInputProps()} accept="*" />
                        </div>
                    </div>
                );
            }}
        </Dropzone>
    );
};

interface UploadingFileViewProps {
    progress: number;
}
const UploadingFileView: React.FunctionComponent<UploadingFileViewProps> = props => {
    const classes = useStyles();
    return (
        <div className={classes.dropZoneUploading}>
            <div className={classes.dropZoneUploadingContent}>
                <Progress value={props.progress} max={100} />
            </div>
        </div>
    );
};

export interface FilePreviewProps {
    file: FileInfo;
    wrapperClassName: string;
}
const FilePreview: React.FunctionComponent<FilePreviewProps> = ({
    file,
    wrapperClassName,
}) => {
    if (file.type == "Image") {
        const imageSrc = `${configSvc.value.apiUrl}/file/${file.id}`;
        return (
            <div className={wrapperClassName}>
                <img src={imageSrc} />
            </div>
        );
    }
    return (
        <div className={wrapperClassName}>
            Name: <b>{file.name}</b>
            <br />
      Size: <b>{readableDataSize(file.size)}</b>
            <br />
      Type: <b>{file.type}</b>
            <br />
        </div>
    );
};

interface FileViewProps {
    file: FileInfo;
    onCancel: (id: string) => void;
}
const FileView: React.FunctionComponent<FileViewProps> = ({
    file,
    onCancel,
}) => {
    const classes = useStyles();
    const download = useCallback((): void => {
        if (file) fileSvc.download(file.id);
    }, [file]);
    const onClose = useCallback(() => onCancel(file?.id), [file?.id, onCancel]);
    return (
        <div className={classes.dropZoneContentExists}>
            <Button className={classes.linkButton} onClick={download} color="link">
                <Tooltip
                    position="bottom"
                    html={
                        <FilePreview file={file} wrapperClassName={classes.imagePrevirew} />
                    }
                >
                    {file?.name}
                </Tooltip>
            </Button>
            <div onClick={onClose}>
                <FontAwesomeIcon icon={faTimes} />
            </div>
        </div>
    );
};

export interface FileInputProps extends InputProps<FileInfo> {
    fileId?: string;
    innerRef?: React.LegacyRef<HTMLInputElement>;
}
export const FileInput: React.FunctionComponent<FileInputProps> = ({
    name,
    value,
    onChange,
    error,
    fileId,
    innerRef,
}) => {
    const [file, setFile] = useState<FileInfo>();
    const [status, setStatus] = useState<Statuses>("NoFile");
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        (async () => {
            if (value) {
                setFile(value);
                setStatus("File");
            } else if (fileId) {
                const fileInfo = await fileSvc.getFileInfo(fileId);
                setFile(fileInfo);
                setStatus("File");
            } else {
                setFile(null);
                setStatus("NoFile");
            }
        })();
    }, [fileId, value]);
    const onDrop = useCallback(
        async (files: File[]) => {
            setStatus("UploadingFile");
            const result = await fileSvc.upload(files[0], p =>
                setProgress((p.loaded * 100) / p.total)
            );
            setStatus("File");
            setFile(result);
            onChange(name, result);
        },
        [name, onChange]
    );
    const onCancel = useCallback(() => {
        setStatus("NoFile");
        setFile(null);
        onChange(name, null);
    }, [name, onChange]);
    return (
        <div>
            <If condition={status === "NoFile"}>
                <NoFileView onDrop={onDrop} error={error} innerRef={innerRef} />
            </If>
            <If condition={status === "UploadingFile"}>
                <UploadingFileView progress={progress} />
            </If>
            <If condition={status === "File"}>
                <FileView file={file} onCancel={onCancel} />
            </If>
        </div>
    );
};

export interface FilesInputProps extends InputProps<FileInfo[]> {
    filesId?: string | string[];
}
export const FilesInput: React.FunctionComponent<FilesInputProps> = ({
    name,
    value,
    onChange,
    error,
    filesId,
}) => {
    const classes = useStyles({ error });
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [file, setFile] = useState<FileInfo>();
    useEffect(() => {
        (async () => {
            if (value) {
                setFiles(value);
            } else if (filesId?.length) {
                const ids =
                    typeof filesId === "string"
                        ? filesId.split(",").map(p => p.trim())
                        : filesId;
                const files = await fileSvc.getFilesInfo(ids);
                setFiles(files);
            }
        })();
    }, [filesId, value]);
    const onCancel = useCallback(
        (id: string) => {
            const index = files.findIndex(p => p.id == id);
            const newFiles = [...files];
            newFiles.splice(index, 1);
            setFiles(newFiles);
            onChange(name, newFiles);
        },
        [files, name, onChange]
    );
    const onFileUplaod = useCallback(
        (name: string, file: FileInfo) => {
            const newFiles = [...files, file];
            setFiles(newFiles);
            setFile(file);
            setFile(null);
            onChange(name, newFiles);
        },
        [files, onChange]
    );
    return (
        <div className={classes.filesContainer}>
            <For each="file" of={files}>
                <FileView file={file} onCancel={onCancel} />
            </For>
            <FileInput onChange={onFileUplaod} name="newFile" value={file} />
        </div>
    );
};
