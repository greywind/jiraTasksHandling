import { createUseStyles } from "react-jss";
import { Theme } from "src/theme/jss";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = (theme: Theme) => ({
    divClass: {
        fontSize: 62,
        fontWeight: 200,
    },
});
type Names = keyof ReturnType<typeof styles>;

const useStyles = createUseStyles<Theme, Names>(styles);

export default useStyles;
