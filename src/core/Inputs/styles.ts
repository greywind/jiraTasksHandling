import { Theme } from "src/theme/jss";
import { Styles } from "jss";
import { createUseThemedStyles } from "@core/hooks";

const styles = (theme: Theme): Styles<"numberField" | "input" | "controls" | "form-control" | string> => {
    return ({
        "@global .form-control": {

        },
        numberField: {
            display: "flex",
            "& $input": {
                flex: 1,
            },
            "& $controls": {
                display: "flex",
                flexDirection: "column",
                marginTop: "-2px",
                marginLeft: "4px",
                "& svg": {
                    padding: "2px",
                    margin: "1px",
                    cursor: "pointer",
                },
                "& span": {
                    height: "20px",
                },
                "& svg:hover": {
                    background: theme.colors.highlightBackground,
                },
            },
        },
        dateField: {
            "@global .react-datepicker-wrapper": {
                width: "100%",
            },
            "@global .react-datepicker__input-container": {
                width: "100%",
            },
        },
        selectField: {
            "& $invalid": {
                border: "solid 1px red",
                borderRadius: "5px",
            },
        },
        input: {},
        controls: {},
        invalid: {},
    });
};

const useStyles = createUseThemedStyles(styles, "inputs");
export default useStyles;