import { createUseStyles } from "react-jss";

const styles = {
    wrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        fontSize: 14,
    },
    image: {
        width: 16,
        marginRight: 10,
        borderRadius: "50%",
    },
};

export const useStyles = createUseStyles(styles, { name: "userName" });