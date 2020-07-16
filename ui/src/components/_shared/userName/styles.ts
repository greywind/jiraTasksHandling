import { createUseStyles } from "react-jss";

const styles = {
    wrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        fontSize: 14,
    },
    image: {
        flex: "0 0 16px",
        marginRight: 10,
        borderRadius: "50%",
    },
};

export const useStyles = createUseStyles(styles, { name: "userName" });