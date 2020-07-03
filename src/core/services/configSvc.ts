import merge from "lodash/merge";

export interface Config {
    jiraBaseUrl: string;
    jiraUsername: string;
    jiraApiToken: string;
    logging: {
        url: string;
        authHeader: string;
    };
}

class ConfigSvc {
    private initTask: Promise<void> = null;
    public async init(): Promise<void> {
        if (this.initTask)
            return this.initTask;

        this.initTask = (async (): Promise<void> => {
            const data = await fetch("/config.json");
            const json = await data.json();
            merge(this._value, json);
        })();
        return this.initTask;
    }

    private _value: Partial<Config> = {};
    public get value(): Partial<Config> {
        return this._value;
    }
}

export default new ConfigSvc();
