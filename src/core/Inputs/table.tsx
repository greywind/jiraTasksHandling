import classnames from "classnames";
import get from "lodash/get";
import React, { CSSProperties, ReactNode, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { For, If } from "@core/types";
import coreOverrides from "src/theme/coreOverrides";
import theme from "@core/jssTheme";

export type Align = "left" | "center" | "right";

export interface Column<T> {
    value: string | ((p: T, i?: number) => React.ReactNode);
    title: React.ReactNode;
    width?: number | string;
    sortable?: boolean;
    align?: Align;

}

const columnStyle = (column: Column<unknown>): any => {
    const result: any = {};
    switch (column.align) {
        case "center": result.textAlign = "center"; break;
        case "right": result.textAlign = "right"; break;
        default: result.textAlign = "left"; break;
    }
    if (column.width)
        result.minWidth = column.width;
    return result;
};

interface CustomControlsProps {
    page?: number;
    pageCount?: number;
    customControls?: ReactNode;
}

export type CustomPanelPosition = "top" | "bottom" | "both";

export interface TableProps<T> extends CustomControlsProps {
    selectedValue?: T;
    name?: ReactNode;
    columns: Column<T>[];
    values: T[];
    view?: "lg" | "md" | "sm";
    customControlsPosition?: CustomPanelPosition;
    onRowClick?: (param: T, i?: number) => void;
}

export const tableStyles = {
    container: {
        margin: "15px 0",
    },
    table: {
        width: "100%",
        marginTop: "15px",
        tableLayout: "fixed",
    },
    header: {
        fontFamily: "Montserrat",
        background: "#002933",
        color: "#fff",
        fontSize: "10pt",
        lineHeight: "1.4",
        textTransform: "uppercase",
    },
    selected: {
        backgroundColor: `${theme.current.colors.blue} !important`,
    },
    body: {
        backgroundColor: "#fff",
        "& tr": {
            border: "solid 1px #fff",
        },
        "& tr:nth-child(even)": {
            backgroundColor: "#e9faff",
        },
        "& tr:hover": {
            backgroundColor: "#FCEBF5",
            cursor: "pointer",
        },
    },
    "table-lg": {
        "& $header": {
            "& td": {
                padding: "24px 0 20px 15px",
            },
        },
        "& $body": {
            "& td": {
                padding: "24px 0 20px 15px",
                overflow: "hidden",
                whiteSpace: "nowrap",
            },
        },
    },
    "table-md": {
        "& $header": {
            "& td": {
                padding: "10px 0 10px 15px",
            },
        },
        "& $body": {
            "& td": {
                padding: "10px 0 10px 15px",
                overflow: "hidden",
                whiteSpace: "nowrap",
            },
        },
    },
    "table-sm": {
        "& $header": {
            "& td": {
                padding: "10px 0 10px 15px",
            },
        },
        "& $body": {
            "& td": {
                padding: "5px 0 5px 15px",
                overflow: "hidden",
                whiteSpace: "nowrap",
            },
        },
    },
};

let tableStylesMerged: any = tableStyles;
if (coreOverrides.table)
    tableStylesMerged = { ...tableStylesMerged, ...coreOverrides.table };
const useTableStyles = createUseStyles(tableStylesMerged, { name: "table" });

declare var column: Column<unknown>;
declare var rowValue: unknown;
declare var i: number;

interface HeaderProps {
    columns: Column<unknown>[];
}

const ColumnHeader: React.FunctionComponent<Column<unknown>> = props => {
    const style: CSSProperties = { width: props.width };
    return <td style={columnStyle(props)} {...style}>{props.title}</td>;
};

const useCustomControlsStyles = createUseStyles({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
}, { name: "customControls" });
const CustomControls: React.FunctionComponent<CustomControlsProps> = props => {
    const classes = useCustomControlsStyles();
    return <div className={classes.container}>
        <div>
            <If condition={!!props.customControls}>
                {props.customControls}
            </If>
        </div>
        <div>
            <If condition={!!props.page && !!props.pageCount}>
                pagination
            </If>
        </div>
    </div>;
};

const Header: React.FunctionComponent<HeaderProps> = props => {
    const classes = useTableStyles();
    return <thead className={classes.header}>
        <tr>
            <For each="column" of={props.columns}  index="i">
                <ColumnHeader key={`col_${i}`} {...column} />
            </For>
        </tr>
    </thead>;
};

interface CellProps {
    column: Column<unknown>;
    value: unknown;
    index: number;
}
const Cell: React.FunctionComponent<CellProps> = props => {
    if (typeof props.column.value === "string")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return get(props.value, props.column.value);
    if (typeof props.column.value === "function")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (props.column.value as any)(props.value, props.index) || "";
    return "INVALID VALUE GETTER";
};

// TODO extract table row to external component or useMemo
const Body: React.FunctionComponent<TableProps<unknown>> = props => {
    const { onRowClick: propsOnRowClick } = props;
    const classes = useTableStyles();
    const onRowClick = React.useCallback((value: unknown, i: number) => {
        if (propsOnRowClick)
            propsOnRowClick(value, i);
    }, [propsOnRowClick]);
    return <tbody className={classes.body}>
        <For each="rowValue" of={props.values} index="i">
            <tr key={i} className={classnames({ [classes.selected]: rowValue == props.selectedValue })} onClick={() => onRowClick(rowValue, i)}>
                <For each="column" of={props.columns}>
                    <td style={columnStyle(column)} key={`${i}_${column.title}`}><Cell column={column} value={rowValue} index={i} /></td>
                </For>
            </tr>
        </For>
    </tbody>;
};

function Table<T>(props: TableProps<T>): React.ReactElement | null {
    const classes = useTableStyles();
    const view = props.view || "md";
    const tableClassName = useMemo(() => (classes as any)["table-" + view], [classes, view]);
    const customTop = useMemo(() => !props.customControlsPosition || props.customControlsPosition == "top", [props.customControlsPosition]);
    const customBottom = useMemo(() => !props.customControlsPosition || props.customControlsPosition == "bottom", [props.customControlsPosition]);
    return <div className={classes.container}>
        <If condition={customTop}>
            <CustomControls {...props} />
        </If>
        <table className={classnames(classes.table, tableClassName)}>
            <Header {...props} />
            <Body {...props} />
        </table>
        <If condition={customBottom}>
            <CustomControls {...props} />
        </If>
    </div>;
}

export default function createTable<T>(): React.FunctionComponent<TableProps<T>> {
    return props => Table<T>(props);
}