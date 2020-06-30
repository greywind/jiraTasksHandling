import { useScreenSize } from "@core/hooks";
import theme from "@core/jssTheme";
import { For, If } from "@core/types";
import { Page, useNavigation } from "@services/useNavigation";
import CarouselWithPreview, {
    CarouselWithPreviewPropsControls,
} from "@shared/carouselWithPreview";
import classnames from "classnames";
import React, {
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { createUseStyles } from "react-jss";
import { Redirect, Route, Switch } from "react-router-dom";
import useRouter from "use-react-router";

declare let panel: React.Component<SshPanelProps>;
declare let i: number;
declare let tabTitle: ReactNode;
declare let navTab: SshNavTabRoute;

const useHorizontalStyles = createUseStyles(
    {
        panelHeaderContainer: {
            display: "flex",
            borderBottom: `solid 1px ${theme.current.colors.regularBorder}`,
            justifyContent: "space-between",
            "& $title": {
                padding: "10px 0 5px 0",
                "font-size": "14pt",
                "font-weight": "lighter",
            },
            "& $headerControls": {
                padding: "10px 0 5px 0",
            },
        },
        tabHeaderContainer: {
            display: "flex",
        },
        tabsHeader: {
            color: "#534741",
            padding: "10px 30px",
            fontSize: 18,
            fontWeight: "bold",
            cursor: "pointer",
            opacity: 0.8,
            "&:hover": {
                opacity: 1,
            },
            "@global .errorMark": {
                marginLeft: 10,
                display: "inline",
            },
        },
        content: {
            padding: "10px",
        },
        active: {
            opacity: 1,
            borderBottom: "solid 5px #EC3147",
        },
        hidden: {
            display: "none",
        },
        tabs: {
            display: "flex",
            flexDirection: "row",
        },
        containerWrapper: {
            backgroundColor: "#fff",
        },
        contentWrapper: {},
        footer: {},
        title: {},
        headerControls: {},
    },
    { name: "sshTabsHorizontal" }
);

const useVerticalStyles = createUseStyles(
    {
        panelHeaderContainer: {
            display: "flex",
            borderBottom: `solid 1px ${theme.current.colors.regularBorder}`,
            justifyContent: "space-between",
            "& $title": {
                padding: "10px 0 5px 0",
                "font-size": "14pt",
                "font-weight": "lighter",
            },
            "& $headerControls": {
                padding: "10px 0 5px 0",
            },
        },
        tabHeaderContainer: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingTop: 15,
        },
        tabsHeader: {
            display: "flex",
            paddingRight: 5,
            borderColor: "transparent",
            borderStyle: "solid",
            cursor: "pointer",
            width: 200,
            minHeight: 20,
            marginBottom: 15,
            marginLeft: 25,
            justifyContent: "space-between",
            borderWidth: "0 5px 0 0",
            flex: 1,
            "&:hover": {
                color: theme.current.colors.danger,
            },
            "@global .errorMark": {
                marginLeft: 10,
            },
        },
        content: {
            borderWidth: "0 0 0 1px",
            borderColor: theme.current.colors.regularBorder,
            borderStyle: "solid",
            padding: "10px",
            flex: 100,
        },
        active: {
            borderRight: `solid 5px ${theme.current.colors.danger}`,
        },
        hidden: {
            display: "none",
        },
        tabs: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
        },
        containerWrapper: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            backgroundColor: "#fff",
            border: "1px solid #E5E5E5",
        },
        contentWrapper: {
            width: "100%",
            display: "flex",
        },
        footer: {
            padding: 10,
            borderWidth: "0 1px 1px 1px",
            borderColor: theme.current.colors.lightBorder,
            borderStyle: "solid",
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "flex-end",
        },
        title: {},
        headerControls: {},
    },
    { name: "sshTabsVertical" }
);

const useSeparateTabsLayout = createUseStyles(
    {
        panelHeaderContainer: {
            display: "flex",
            borderBottom: `solid 1px ${theme.current.colors.regularBorder}`,
            justifyContent: "space-between",
            "& $title": {
                padding: "10px 0 5px 0",
                "font-size": "14pt",
                "font-weight": "lighter",
            },
            "& $headerControls": {
                padding: "10px 0 5px 0",
            },
        },
        tabHeaderContainer: {
            display: "flex",
            justifyContent: "space-between",
        },
        tabs: {
            display: "flex",
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
        },
        tabsHeader: {
            color: "#534741",
            fontSize: 18,
            fontWeight: "bold",
            cursor: "pointer",
            opacity: 0.8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "0 40px",
            height: "100%",
            [`@media (min-width: ${theme.current.breakpoint.sm}px)`]: {
                padding: "20px 50px",
            },
            "&:hover": {
                opacity: 1,
            },
            "@global .errorMark": {
                marginLeft: 10,
                display: "inline",
            },
        },
        content: {
            padding: "10px",
        },
        active: {
            opacity: 1,
            [`@media (min-width: ${theme.current.breakpoint.sm}px)`]: {
                borderBottom: "solid 5px #EC3147",
            },
        },
        hidden: {
            display: "none",
        },
        containerWrapper: {
            backgroundColor: "#fff",
        },
        contentWrapper: {},
        footer: {},
        title: {},
        headerControls: {},
    },
    { name: "sshTabsSeparated" }
);

const useSshPanelStyles = createUseStyles(
    {
        panelHeaderContainer: {
            display: "flex",
            borderBottom: `solid 1px ${theme.current.colors.regularBorder}`,
            justifyContent: "space-between",
            "& $title": {
                padding: "5px 0 5px 0",
                "font-size": "12pt",
                "font-weight": "lighter",
            },
            "& $headerControls": {
                padding: "10px 0 5px 0",
            },
        },
        tabHeaderContainer: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingTop: 15,
        },
        content: {
            borderWidth: "0 1px 1px 1px",
            borderColor: theme.current.colors.regularBorder,
            borderStyle: "solid",
            padding: "10px",
            flex: 100,
            overflow: "auto",
            height: "calc(100% - 34px)",
        },
        title: {},
        headerControls: {},
    },
    { name: "sshPanel" }
);

export interface SshPanelProps {
    title: ReactNode;
    wrapperClassName?: string;
    state?: "normal" | "warning" | "danger";
    headerControls?: ReactNode;
    className?: string;
    height?: string | number;
}

export const SshPanel: React.FunctionComponent<SshPanelProps> = props => {
    const classes = useSshPanelStyles();
    const styles = useMemo<React.CSSProperties>(() => ({}), []);
    if (props.height) styles.height = props.height;
    return (
        <div
            className={`${props.wrapperClassName} ${props.className}`}
            style={styles}
        >
            <div className={classnames({ [classes.panelHeaderContainer]: true })}>
                <div className={classnames({ [classes.title]: true })}>
                    {props.title}
                </div>
                <If condition={!!props.headerControls}>
                    <div className={classes.headerControls}>{props.headerControls}</div>
                </If>
            </div>
            <div className={classes.content}>{props.children}</div>
        </div>
    );
};

type SshTabsLayout = "vertical" | "horizontal" | "separateTabs";

interface SshTabsFooterProps { }

export const SshTabsFooter: React.FunctionComponent<SshTabsFooterProps> = props => {
    return <div>{props.children}</div>;
};

interface SshTabsHeaderProps {
    activeTab?: number;
    customControl?: ReactNode;
    layout?: SshTabsLayout;
    tabs: ReactNode[];
    tabClick: (index: number) => void;
}

const SshTabsHeader: React.FunctionComponent<SshTabsHeaderProps> = props => {
    const useStyles =
        props.layout == "vertical"
            ? useVerticalStyles
            : props.layout == "separateTabs"
                ? useSeparateTabsLayout
                : useHorizontalStyles;
    const classes = useStyles();
    const screenSize = useScreenSize();
    const controls = useMemo<CarouselWithPreviewPropsControls>(
        () => ({
            size: 30,
            gapToSide: 20,
        }),
        []
    );

    if (screenSize.let("sm") && props.layout == "separateTabs") {
        return (
            <CarouselWithPreview
                interval={false}
                activePageChanged={props.tabClick}
                height={50}
                controls={controls}
            >
                <For each="tabTitle" of={props.tabs} index="i">
                    <div
                        key={typeof tabTitle === "string" && tabTitle ? tabTitle : i}
                        className={classnames(classes.tabsHeader, {
                            [classes.active]: i == props.activeTab,
                        })}
                    >
                        {tabTitle}
                    </div>
                </For>
                <If condition={!!props.customControl}>
                    <div>{props.customControl}</div>
                </If>
            </CarouselWithPreview>
        );
    }

    return (
        <div className={classes.tabHeaderContainer}>
            <div className={classes.tabs}>
                <For each="tabTitle" of={props.tabs} index="i">
                    <div
                        key={typeof tabTitle === "string" && tabTitle ? tabTitle : i}
                        onClick={() => props.tabClick(i)}
                        className={classnames(classes.tabsHeader, {
                            [classes.active]: i == props.activeTab,
                        })}
                    >
                        {tabTitle}
                    </div>
                </For>
            </div>
            <If condition={!!props.customControl}>
                <div>{props.customControl}</div>
            </If>
        </div>
    );
};

interface SshTabsProps {
    activeTab?: number;
    wrapperClassName?: string;
    customControl?: ReactNode;
    layout?: SshTabsLayout;
    height?: number | string;
    headerControls?: ReactNode;
}

export const SshTabs: React.FunctionComponent<SshTabsProps> = props => {
    const useStyles =
        props.layout == "vertical"
            ? useVerticalStyles
            : props.layout == "separateTabs"
                ? useSeparateTabsLayout
                : useHorizontalStyles;
    const classes = useStyles();
    const childrenArray = React.Children.toArray(props.children).filter(
        p => React.isValidElement<SshPanelProps>(p) && p.type == SshPanel
    ) as React.Component<SshPanelProps>[];
    const footer = React.Children.toArray(props.children).find(
        p => React.isValidElement<SshTabsFooterProps>(p) && p.type == SshTabsFooter
    );
    const [activeTab, setActiveTab] = useState(0);
    const tabStyle = useMemo(() => {
        const result: React.CSSProperties = {};
        result.height = props.height;
        return result;
    }, [props.height]);
    useEffect(() => {
        setActiveTab(props.activeTab || 0);
    }, [props.activeTab]);
    const tabClick = useCallback((index: number) => {
        setActiveTab(index);
    }, []);
    const tabs = childrenArray.map(panel => panel.props.title);

    return (
        <>
            <div
                className={classnames(props.wrapperClassName, classes.containerWrapper)}
            >
                <SshTabsHeader
                    activeTab={activeTab}
                    customControl={props.customControl}
                    layout={props.layout}
                    tabs={tabs}
                    tabClick={tabClick}
                />
                <div className={classes.contentWrapper}>
                    <div className={classes.content}>
                        <For each="panel" of={childrenArray} index="i">
                            <div
                                style={tabStyle}
                                onClick={() => tabClick(i)}
                                className={classnames({
                                    [classes.hidden]: i != activeTab,
                                })}
                            >
                                {panel.props.children}
                            </div>
                        </For>
                    </div>
                </div>
            </div>
            <If condition={!!footer}>
                <div className={classes.footer}>{footer}</div>
            </If>
        </>
    );
};

export interface SshNavTabRoute {
    title: string | ReactNode;
    page: Page;
    route?: string;
    component: React.ComponentType<unknown>;
    exact?: boolean;
}

export interface SshNavTabsProps {
    wrapperClassName?: string;
    contentClassName?: string;
    customControl?: ReactNode;
    layout?: SshTabsLayout;
    height?: number | string;
    tabs: SshNavTabRoute[];
    defaultFrom?: string;
    defaultTo?: string;
}

export const SshNavTabs: React.FunctionComponent<SshNavTabsProps> = props => {
    const useStyles =
        props.layout == "vertical"
            ? useVerticalStyles
            : props.layout == "separateTabs"
                ? useSeparateTabsLayout
                : useHorizontalStyles;
    const { history } = useRouter();
    const { links, currentPage, to } = useNavigation();
    const classes = useStyles();
    const tabClick = useCallback(
        (i: number) => {
            if (props.tabs[i].route) return history.push(props.tabs[i].route);
            to(props.tabs[i].page);
        },
        [history, props.tabs, to]
    );
    const activeTab = props.tabs.findIndex(tab => tab.page == currentPage);
    const tabs = props.tabs.map(tab => tab.title);
    const routes = props.tabs.map(
        tab => tab.route || (links[tab.page] as string)
    );

    return (
        <div
            className={classnames(props.wrapperClassName, classes.containerWrapper)}
        >
            <SshTabsHeader
                activeTab={activeTab}
                customControl={props.customControl}
                layout={props.layout}
                tabs={tabs}
                tabClick={tabClick}
            />
            <div className={classnames(props.contentClassName, classes.content)}>
                <Switch>
                    <For each="navTab" of={props.tabs} index="i">
                        <Route
                            key={routes[i]}
                            path={routes[i]}
                            component={navTab.component}
                            exact={navTab.exact}
                        />
                    </For>
                    <If condition={!!props.defaultFrom}>
                        <Redirect path={props.defaultFrom} to={routes[0]} />
                    </If>
                </Switch>
            </div>
        </div>
    );
};
