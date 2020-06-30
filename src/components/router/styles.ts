import { Theme } from "src/theme/jss";
import { createUseStyles } from "react-jss";
import color from "color";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = (theme: Theme) => ({
    routerWrapper: {
        marginTop: 60,
    },
});
type Names = keyof ReturnType<typeof styles>;
export const useStyles = createUseStyles<Theme, Names>(styles);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const headerStyles = (theme: Theme) => ({
    logo: {
        fontWeight: 400,
        color: `${theme.colors.regularContrastColor} !important`,
        cursor: "pointer",
    },
    navLink: {
        paddingRight: 25,
    },
    container: {
        background: theme.colors.regularBackground,
        "& a": {
            color: color(theme.colors.regularContrastColor).darken(0.3).hex(),
            textDecoration: "none",
        },
        "& .active": {
            color: `${color(theme.colors.regularContrastColor)} !important`,
        },
    },
});

type HeaderNames = keyof ReturnType<typeof headerStyles>;
export const useHeaderStyles = createUseStyles<Theme, HeaderNames>(headerStyles);
