import { JssStyle } from "jss/src";
import { createUseStyles } from "react-jss";
import { Theme } from "src/theme/jss";

const columnStyles = (): JssStyle => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
});
function growingColumnStyles(weight = 100): JssStyle {
    return {
        ...columnStyles(),
        flex: `1 1 ${weight}px`,
    };
}
function fixedColumnStyles(width = 100): JssStyle {
    return {
        ...columnStyles(),
        flex: `0 0 ${width}px`,
    };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = () => ({
    numOrder: fixedColumnStyles(40),
    key: fixedColumnStyles(110),
    title: growingColumnStyles(300),
    assignee: fixedColumnStyles(160),
    status: fixedColumnStyles(140),
    qa: fixedColumnStyles(160),
    cr: fixedColumnStyles(160),
    header: {
        fontWeight: "bold",
        background: "#f9eccd",
    },
    headerRow: {
        height: 30,
    },
    alignedToTheLeft: {
        alignItems: "flex-start",
    },
    tableRow: {
        minHeight: 80,
        flexWrap: "nowrap",
        "&:nth-child(2n)": {
            background: "#e8eced",
        },
    },
});
type Names = keyof ReturnType<typeof styles>;

const useStyles = createUseStyles<Theme, Names>(styles);

export default useStyles;
