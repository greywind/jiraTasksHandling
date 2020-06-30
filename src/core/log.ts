import moment from "moment";
import configSvc from "./services/configSvc";

const config = configSvc.value;

declare var __DEV__: string;

const loggerLevels = {
    verbose: "Verbose",
    debug: "Debug",
    information: "Information",
    warning: "Warning",
    error: "Error",
    fatal: "Fatal",
    network: "Network",
};

interface LogEvent {
    action: string;
    message: string;
    data: any;
    level?: string;
    exception?: any;
}

class Logger {
    private baseUrl: string;
    private authHeader: string;
    private environment = __DEV__ ? "debug" : process.env.APP_ENV;
    private app = "jiraTasksHandling";
    private version: string;
    private initTask: Promise<void>;
    private reactApp: string;
    private userAgent: string;
    private protocol: string;
    private rayId: string;
    private enabled: boolean;
    private stringFormat: (s: string, ...a: unknown[]) => string;

    constructor() {
        this.userAgent = navigator.userAgent;
        this.initTask = (async () => {
            await configSvc.init();
            const initModule = await import("./utils");
            this.version = initModule.getAppVersion();
            this.stringFormat = initModule.stringFormat;
            this.authHeader = `Basic ${window.btoa(configSvc.value.logging?.authHeader)}`;
            this.baseUrl = configSvc.value.logging?.url;
            this.enabled = !!configSvc.value.logging;
        })();
        this.protocol = location.protocol;
    }

    public async log({ action, message, data, level, exception }: LogEvent): Promise<void> {
        await this.initTask;
        if (!this.enabled)
            return;
        const CustomData = data || {};
        let Exception;
        if (exception) {
            Exception = { ...exception };
            delete Exception.message;
            delete Exception.stack;
            Exception.Message = exception.message;
            Exception.StackTrace = exception.stack;
        }
        const body = {
            App: this.app,
            Timestamp: new Date(),
            Envirenment: this.environment,
            Version: this.version,
            Level: level,
            Exception,
            CustomData,
            Action: action,
            Message: message,
            UserAgent: this.userAgent,
            Protocol: this.protocol,
            RayId: this.rayId,
        };
        if (this.environment == "debug") {
            // eslint-disable-next-line no-console
            console.log(body.Message, body);
            return;
        }
        if (process.env.LOGGING_DISABLED == "Y")
            return;
        fetch(this.stringFormat(this.baseUrl, moment().format("YYYY.MM.DD")),
            {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: this.authHeader },
                body: JSON.stringify(body),
            }
            // eslint-disable-next-line no-console
        ).catch(error => console.error(error));
    }

    public error(message: string, data: any, exception: Error): void {
        if (typeof exception !== "object")
            exception = new Error(exception);
        this.log({ action: `error${this.reactApp ? `.${this.reactApp}` : ""}`, message, data, level: loggerLevels.error, exception });
    }
    public metrica(action: string, message?: string, data?: any): void {
        this.log({ action: `metrica${this.reactApp ? `.${this.reactApp}` : ""}.${action}`, message, data, level: loggerLevels.information });
    }
    public startLastingMetrica(action: string, message?: string, data?: any): { end: () => void } {
        const start = Date.now();
        data = data || {};
        return {
            end: () => {
                data.duration = Date.now() - start;
                this.metrica(action, message, data);
            },
        };
    }
    public warning(message: string, data: any): void {
        this.log({ action: `warning${this.reactApp ? `.${this.reactApp}` : ""}`, message, data, level: loggerLevels.warning });
    }

    public network(message: string, data: any): void {
        this.log({ action: `network${this.reactApp ? `.${this.reactApp}` : ""}`, message, data, level: loggerLevels.network });
    }

    public setReactApp(app: string): void {
        this.reactApp = app;
    }

    public setRayId(id: string): void {
        this.rayId = id;
    }
}

export default new Logger();
