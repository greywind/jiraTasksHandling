import { useDialog, UseDialogResult } from "@core/hooks";
import { DialogProps, DialogPropsFromHook, DialogResult } from "@shared/dialog/types";

export type YesNoDialogProps = DialogProps<boolean>;
export type YesNoDialogResult = DialogResult<boolean>;
export type YesNoDialogPropsFromHook = DialogPropsFromHook<boolean>;

export function useYesNoDialog(): UseDialogResult<boolean> {
    return useDialog<boolean>();
}