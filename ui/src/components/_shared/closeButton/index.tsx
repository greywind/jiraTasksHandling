import React from "react";
import { createUseStyles } from "react-jss";
import styles from "./styles";
import { Props } from "./types";
import classnames from "classnames";

const useStyles = createUseStyles(styles);

const CloseButton: React.FunctionComponent<Props> = props => {
    const classes = useStyles(props);
    return (
        <svg
            viewBox="0 0 40 40"
            onClick={props.onClick}
            className={classnames(classes.closeButton, props.className)}
        >
            <path className="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30" />
        </svg>
    );
};

export default CloseButton;
