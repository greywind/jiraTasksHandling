interface DialogCanceled {
    __canceled: true;
}
export const dialogCanceled: DialogCanceled = {
    __canceled: true,
};

export type DialogResult<T> = T | DialogCanceled;

export function isDialogCanceled<T>(result: DialogResult<T>): result is DialogCanceled {
    return !!result && (result as unknown as DialogCanceled).__canceled;
}

export interface DialogPropsFromHook<TDialogResolve> {
    isOpen: boolean;
    close: (value: DialogResult<TDialogResolve> | Promise<DialogResult<TDialogResolve>>) => void;
}
interface ExternalDialogProps {
    title: string;
    closeButton?: boolean;
}

export type DialogProps<TDialogResolve> = ExternalDialogProps & DialogPropsFromHook<TDialogResolve>;