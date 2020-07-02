import configSvc from "@core/services/configSvc";
import wget from "@core/wget";
import { FileInfo } from "src/models/file";

const baseUrl = configSvc.value.jiraBaseUrl;

export declare type ProgressDelegate =
    | ((this: XMLHttpRequest, ev: ProgressEvent) => any)
    | null;

interface FileUploadResult {
    id: string;
    url: string;
    size: number;
}

const upload = async (
    file: File,
    onprogress: ProgressDelegate
): Promise<FileInfo> => {
    return new Promise((resolve, reject) => {
        try {
            const formData = new FormData();
            formData.append("File", file);
            const xhr = new XMLHttpRequest();
            xhr.onload = response =>
                resolve(JSON.parse((response.currentTarget as any).responseText));
            xhr.onerror = reject;
            xhr.upload.onprogress = onprogress;
            xhr.open("POST", `${baseUrl}/file`, true);
            xhr.send(formData);
        } catch (e) {
            reject(e);
        }
    });
};

const download = async (fileId: string): Promise<void> => {
    const link = document.createElement("a");
    link.download = name;
    link.href = `${baseUrl}/file/${fileId}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const getFileInfo = async (fileId: string): Promise<FileInfo> => {
    const result = await wget.get<FileInfo>(`/file/${fileId}/info`);
    return result;
};
const getFilesInfo = async (filesId: string[]): Promise<FileInfo[]> => {
    const result = await wget.get<FileInfo[]>("/file/info", {
        qs: { ids: filesId.join(",") },
    });
    return result;
};

export default { upload, download, getFileInfo, getFilesInfo };
