import { createUseStyles } from "react-jss";

export type StyleProps = {
    showPopup: false;
} | {
    showPopup: true;
    left?: number;
    width?: number;
    top?: number;
}

const horizontalPadding = 15;
const verticalPadding = 5;

const styles = {
    value: {
        cursor: "pointer",
    },
    popup: {
        position: "fixed",
        display: (props: StyleProps) => props.showPopup ? "flex" : "none",
        left: (props: StyleProps) => props.showPopup ? props.left - horizontalPadding : "unset",
        width: (props: StyleProps) => props.showPopup ? props.width + 2 * horizontalPadding : "unset",
        top: (props: StyleProps) => props.showPopup && !!props.top ? props.top - verticalPadding : "unset",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "space-between",
        cursor: "pointer",
        padding: `${verticalPadding}px ${horizontalPadding}px`,
        backgroundColor: "white",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.15)",
    },
    selected: {
        backgroundColor: "#ddf",
    },
    item: {
        "&:not(first-child)": {
            marginTop: 3,
        },
        "&:hover:not($selected)": {
            backgroundColor: "#eef",
        },
    },
};

const useStyles = createUseStyles(styles);
export default useStyles;