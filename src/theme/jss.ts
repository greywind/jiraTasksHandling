// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getTheme() {
    return {
        rtl: false,
        colors: {
            lightBorder: "#EEE",
            regularBorder: "#CCC",
            regularBackground: "#343A40",
            regularContrastColor: "#FFF",
            danger: "#DC3545",
            focusBackground: "#DD1414",
            focusFontColor: "#FFF",
            highlightBackground: "red",
        },
        breakpoint: {
            xs: 0,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
        },
    };
}

export type Theme = ReturnType<typeof getTheme>;
