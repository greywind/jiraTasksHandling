import { getTheme, Theme } from "src/theme/jss";

const theme: { current: Theme } = { current: null };

export function refreshTheme(): void {
    theme.current = getTheme();
}

refreshTheme();

export default theme;
