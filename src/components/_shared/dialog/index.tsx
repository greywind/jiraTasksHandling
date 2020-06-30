import { whyDidYouRender } from "@core/utils";
import CloseButton from "@shared/closeButton";
import React from "react";
import { createUseStyles } from "react-jss";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { If } from "@core/types";
import styles from "./styles";
import { dialogCanceled, DialogProps } from "./types";

export const DialogContent: React.FunctionComponent<{}> = () => null;
export const DialogFooter: React.FunctionComponent<{}> = () => null;

const useStyles = createUseStyles(styles);

const Dialog: React.FunctionComponent<DialogProps<unknown>> = props => {
    const content = React.useMemo(() => {
        const dialogContent = React.Children.toArray(props.children).find(child => {
            return React.isValidElement(child) && child.type == DialogContent;
        });
        return React.isValidElement(dialogContent) ? dialogContent.props.children : null;
    }, [props.children]);
    const footer = React.useMemo(() => {
        const dialogFooter = React.Children.toArray(props.children).find(child => {
            return React.isValidElement(child) && child.type == DialogFooter;
        });
        return React.isValidElement(dialogFooter) ? dialogFooter.props.children : null;
    }, [props.children]);
    const classes = useStyles(props);

    return <Modal isOpen={props.isOpen}>
        <ModalHeader>
            {props.title}
            <If condition={props.closeButton}>
                <CloseButton onClick={() => props.close(dialogCanceled)} className={classes.closeButton} />
            </If>
        </ModalHeader>
        <If condition={!!content}>
            <ModalBody>
                {content}
            </ModalBody>
        </If>
        <If condition={!!footer}>
            <ModalFooter>
                {footer}
            </ModalFooter>
        </If>
    </Modal>;
};
whyDidYouRender(Dialog);

export default Dialog;
