import Logger from "@core/log";
import memoize from "fast-memoize";
import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import moment, { Moment } from "moment";
import React from "react";

declare let __DEV__: string;

export function bind<T>(obj: T, ...names: (keyof T)[]): void {
    names.forEach(
        name => (obj[name] = ((obj[name] as unknown) as Func).bind(obj))
    );
}

//This class ensures that only last called run will trigger callback
export class Runner {
    private fun: any;
    private callback: any;
    private errCallback: any;
    private lastRun: any = null;
    constructor(
        fun: any,
        callback?: (result: any) => void,
        errCallback?: (error: any) => void
    ) {
        this.fun = fun;
        this.callback = callback;
        this.errCallback = errCallback;
        this.lastRun = null;
        bind(this, "run");
    }

    public run(opt: any): Promise<any> {
        return new Promise<any>(resolve => {
            const {
                param,
                delay = 0,
                callback = this.callback,
                errCallback = this.errCallback,
            }: { param: any; delay: number; callback: any; errCallback: any } =
                opt || {};
            const run = async (): Promise<void> => {
                if (run !== this.lastRun) {
                    resolve({ canceled: true });
                    return;
                }
                let result;
                try {
                    result = await this.fun(param);
                } catch (e) {
                    if (run !== this.lastRun) {
                        resolve({ canceled: true });
                        return;
                    }
                    if (errCallback) errCallback(e);
                    throw e;
                }
                if (run !== this.lastRun) {
                    resolve({ canceled: true });
                    return;
                }
                this.lastRun = null;
                if (callback) callback(result);
                resolve(result);
            };
            this.lastRun = run;
            setTimeout(run, delay);
        });
    }
}

export function getEnumKeys(E: Record<string, unknown>): string[] {
    return Object.values(E)
        .filter(v => typeof v === "string")
        .map(v => v as string);
}

export function joinNonEmpty(...args: string[]): string {
    return args.filter(s => s && s.length).join(", ");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func = (...args: any[]) => any;

interface Decorator {
    (moduleName: string, funName: string, fun: Func): Func;
}

const asyncStackTracer: Decorator = (moduleName, funName, fun, log = false) => {
    //In IE for some cases stack is empty here
    const stack = new Error("<error placeholder>").stack || "<error placeholder>";
    const delimiter = "<End of async stack>\n---------------------\n";
    const name = `${moduleName + "." || ""}${funName ||
        fun.name ||
        "anonymous function"}`;
    return async function decorator(...args: unknown[]) {
        try {
            if (log) Logger.metrica("asyncStackTraceLogging", `${name} started`);
            const result = await fun.apply(this, args);
            if (log) Logger.metrica("asyncStackTraceLogging", `${name} finished`);
            return result;
        } catch (error) {
            let collectedAsyncStack: string;
            let e: Error;
            try {
                if (typeof error === "object") {
                    collectedAsyncStack =
                        error.stack && error.stack.indexOf(delimiter) !== -1
                            ? `${error.stack.substring(0, error.stack.indexOf(delimiter))}`
                            : "";
                    e = error;
                } else {
                    e = new Error(error);
                    collectedAsyncStack = "";
                }
                e.stack = `${collectedAsyncStack}[${name}]\n${delimiter}${stack.replace(
                    "<error placeholder>",
                    e.message
                )}`;
            } catch (e) {
                Logger.error(
                    "asyncStackTracerCatchError",
                    { stack, collectedAsyncStack, name, error },
                    e
                );
            }
            throw error;
        }
    };
};

export function withAsyncStackTracerOnAllMethods(
    className: string
): ClassDecorator {
    return target => {
        const elements = (target as any).elements as any[];
        elements
            .filter(el => el.kind === "method")
            .forEach(
                el =>
                    (el.descriptor.value = asyncStackTracer(
                        className,
                        el.key,
                        el.descriptor.value
                    ))
            );
    };
}

export function getAppVersion(): string {
    return __DEV__ ? "0.0.0" : "#{Webpack_Version}";
}

export function whyDidYouRender(
    component: React.Component<any, any, any> | React.FunctionComponent<any>
): void {
    (component as any).whyDidYouRender = true;
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
interface Validator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value: any): string | undefined;
}
interface Validators {
    [key: string]: Validator;
}

const _validators: Validators = {
    number: value => (!isNaN(+value) ? undefined : "Invalid number format"),
    sqlDate: value =>
        moment(value, moment.ISO_8601, true).isValid()
            ? undefined
            : "Invalid date format",
    date: value =>
        moment(value, ["L LT", "L"], true).isValid()
            ? undefined
            : "Invalid date format",
    require: value => (value ? undefined : "Value is required"),
    // eslint-disable-next-line no-useless-escape
    email: value =>
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
            value.toLowerCase()
        )
            ? undefined
            : "Invalid email format",
    null: value =>
        value == undefined || value == null || value == ""
            ? undefined
            : "Value should be null",
    time: value =>
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)
            ? undefined
            : "Invalid time format",
    cellNumber: value => {
        value = value.replace(/[+,\-,/(, /),\s]/im, "");
        return /(\d){9,}/im.test(value) ? undefined : "Invalid cell number format";
    },
};

export const Validators: Validators = {
    required: _validators.require,
    email: _validators.email,
    emailOrNull: value => _validators.null(value) && _validators.email(value),
    number: _validators.number,
    nullOrTime: value => _validators.null(value) && _validators.time(value),
    nullOrNumber: value => _validators.null(value) && _validators.number(value),
    date: value => _validators.date(value) && _validators.sqlDate(value),
    nullOrDate: value => _validators.null(value) && Validators.date(value),
    require: _validators.require,
    cellNumber: _validators.cellNumber,
    nullOrEmail: value => _validators.null(value) && _validators.email(value),
    cellNumberOrNull: value =>
        _validators.null(value) && _validators.cellNumber(value),
    nullOrDateRange: value =>
        _validators.null(value) &&
        (Validators.nullOrDate(value.gt) || Validators.nullOrDate(value.lt)),
    nullOrNumberRange: value =>
        _validators.null(value) &&
        (Validators.nullOrNumber(value.gt) || Validators.nullOrNumber(value.lt)),
};

export const parseSqlDateTime = (dt: string | Moment): Moment =>
    moment(dt, moment.ISO_8601, true);

const _formatDate = (date: Moment, format: string): string => {
    if (!date) return null;
    let momentDt = parseSqlDateTime(date);
    if (!momentDt.isValid()) momentDt = moment(date, ["L LT", "L"]);
    return momentDt.format(format);
};

export const formatDateTime = (date: Moment): string =>
    _formatDate(date, "L LT");
export const formatDate = (date: Moment): string => _formatDate(date, "L");

export const readableDataSize = (size: number): string => {
    if (!size) return "0";
    if (size < 1024) return "<1 Kb";
    let result = size / 1024;
    if (result < 1024) return `${Math.round(result * 100) / 100} Kb`;
    result = result / 1024;
    if (result < 1024) return `${Math.round(result * 100) / 100} Mb`;
    result = result / 1024;
    return `${Math.round(result * 100) / 100} Gb`;
};

export const dataTypes = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "bool", label: "Yes / No" },
    { value: "textarea", label: "Text area" },
    { value: "option", label: "Option list (single selection)" },
    { value: "multioption", label: "Option list (multiple selection)" },
];

export const dataTypesValidationMap = {
    number: Validators.nullOrNumber,
    time: Validators.nullOrTime,
    date: Validators.nullOrDate,
    dateRange: Validators.nullOrDateRange,
    numberRange: Validators.nullOrNumberRange,
};

export const stringFormat = (s: string, ...a: unknown[]): string => {
    if (!s) return "";
    return s.replace(/\{(\d+)\}/g, (m, n) =>
        a[n] === undefined ? m : `${a[n]}`
    );
};

export function applyDecorator<T>(
    decorator: Decorator,
    moduleName: string,
    obj: T,
    ...names: Extract<keyof T, string>[]
): void {
    names.forEach(
        name =>
            (((obj[name] as unknown) as Func) = decorator(
                moduleName,
                name,
                (obj[name] as unknown) as Func
            ))
    );
}

export const getDisplayName = (Component: React.ComponentClass): string =>
    Component.displayName || Component.name || "Component";

export const stringCrop = (s: string, length: number, ending = "..."): string =>
    s && s.length > length
        ? `${s.substring(0, length - ending.length)}${ending}`
        : s;

export const toSqlDateTime = (momentDt: Moment): string =>
    momentDt.format("YYYY-MM-DD[T]HH:mm:ss.SSS");

export function delay(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export function flattenObject(
    obj: Record<string, unknown>
): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = {} as any;
    for (const [key, value] of Object.entries(obj)) {
        if (isArray(value)) result[key] = value.join(",");
        else if (isPlainObject(value)) {
            const flattenedValue = flattenObject(value as Record<string, unknown>);
            for (const [valKey, valValue] of Object.entries(flattenedValue)) {
                result[`${key}.${valKey}`] = valValue;
            }
        } else result[key] = value;
    }
    return result;
}

export function getScrollParent(
    element: HTMLElement,
    includeHidden: boolean
): HTMLElement {
    let style = getComputedStyle(element);
    const excludeStaticParent = style.position === "absolute";
    const overflowRegex = includeHidden
        ? /(auto|scroll|hidden)/
        : /(auto|scroll)/;
    const scrollableClassName = "scrollable";

    if (style.position === "fixed") return document.body;
    for (let parent = element; (parent = parent.parentElement);) {
        style = getComputedStyle(parent);
        if (excludeStaticParent && style.position === "static") continue;

        if (
            overflowRegex.test(style.overflow + style.overflowY + style.overflowX) ||
            parent.classList.contains(scrollableClassName)
        )
            return parent;
    }

    return document.body;
}

export const generateScopedName = (scope: string, name: string): string =>
    `${scope || "global"}_${name}`;

export const validateDateGreaterThan = memoize(
    (minDate: Moment): Validator => value =>
        value && moment(value, ["L LT", "L"]).isBefore(minDate)
            ? "Too early date is chosen"
            : undefined
);

export const validateDateRangeGreaterThan = memoize(
    (minDate: Moment): Validator => value =>
        value &&
        (validateDateGreaterThan(minDate)(value.gt) ||
            validateDateGreaterThan(minDate)(value.lt))
);

export const memoDecorator: Decorator = (_moduleName, _name, fun) =>
    memoize(fun);
