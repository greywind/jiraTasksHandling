import { createUseStyles } from "react-jss";
import { Theme } from "src/theme/jss";

const spinnerSize = 100;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = (theme: Theme) => ({
    divClass: {
        fontSize: 62,
        fontWeight: 200,
    },
    spinner: {
        position: "fixed",
        height: spinnerSize,
        width: spinnerSize,
        top: `calc(45vh - ${spinnerSize / 2}px)`,
        left: `calc(50vw - ${spinnerSize / 2}px)`,
    },
});
type Names = keyof ReturnType<typeof styles>;

const useStyles = createUseStyles<Theme, Names>(styles);

export default useStyles;
