import merge from "lodash/merge";

export interface Config {
    apiUrl: string;
    facebookId?: string;

    logging?: {
        url: string;
        authHeader: string;
    };
}

class ConfigSvc {
    private initTask: Promise<void> = null;
    public async init(): Promise<void> {
        if (this.initTask) return this.initTask;
        return (this.initTask = new Promise<Response>((resolve) => {
            resolve(fetch("/config.json"));
        })
            .then((data) => data.json())
            .then((json) => {
                merge(this._value, json);
            }));
    }

    private _value: Config = {} as any;
    public get value(): Config {
        return this._value;
    }
}

export default new ConfigSvc();
