import theme from "@core/jssTheme";
import classnames from "classnames";
import React from "react";
import { createUseStyles } from "react-jss";

export interface BadgeProps { }

const styles = {
    badge: {
        display: "inline",
        padding: "5px 10px",
        margin: "0 5px 5px 0",
        border: `solid 2px ${theme.current.colors.lightBorder}`,
        fontSize: "10pt",
        "&:hover": {
            background: theme.current.colors.lightBorder,
            transition: "all .3s ease",
            cursor: "pointer",
        },
    },
    badgeSelected: {
        background: theme.current.colors.focusBackground,
        color: theme.current.colors.focusFontColor,
        border: `solid 2px ${theme.current.colors.focusBackground}`,
        "&:hover": {
            background: theme.current.colors.focusBackground,
            color: theme.current.colors.focusFontColor,
        },
    },
};
const useStyles = createUseStyles(styles, { name: "badge" });

export interface BadgeProps {
    isSelected?: boolean;
    backgroundColor?: string;
    foregroundColor?: string;
    fontWidth?: string;
    onClick?: () => void;
}

const Badge: React.FunctionComponent<BadgeProps> = props => {
    const classes = useStyles();
    const style = {
        backgroundColor: props.backgroundColor,
        color: props.foregroundColor,
        fontWidth: props.fontWidth,
    };
    return (
        <div
            style={style}
            onClick={() => props.onClick()}
            className={classnames({
                [classes.badge]: true,
                [classes.badgeSelected]: props.isSelected,
            })}
        >
            {props.children}
        </div>
    );
};

export default Badge;
