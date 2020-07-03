import { useCustomDialog } from "@core/hooks";
import useLocale from "@core/locale.common";
import { whyDidYouRender } from "@core/utils";
import Dialog, { DialogFooter } from "@shared/dialog";
import React from "react";
import { Button } from "reactstrap";
import { YesNoDialogProps } from "./meta";

const YesNoDialog: React.FunctionComponent<YesNoDialogProps> = props => {
    const { dialogProps } = useCustomDialog<boolean>(props);

    const l = useLocale();

    return (
        <Dialog
            title={props.title}
            closeButton={props.closeButton}
            {...dialogProps}
        >
            <DialogFooter>
                <Button onClick={() => dialogProps.close(true)}>{l.yes}</Button>
                <Button color="danger" onClick={() => dialogProps.close(false)}>
                    {l.no}
                </Button>
            </DialogFooter>
            {props.children}
        </Dialog>
    );
};
whyDidYouRender(YesNoDialog);

export default YesNoDialog;
