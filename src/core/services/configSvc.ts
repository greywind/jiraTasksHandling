import merge from "lodash/merge";

interface Config {
    apiUrl: string;
    facebookId?: string;

    logging?: {
        url: string;
        authHeader: string;
    }
}

class ConfigSvc {
    private initTask: Promise<void> = null;
    public async init(): Promise<void> {
        if (this.initTask)
            return this.initTask;
        return this.initTask = new Promise(async resolve => {
            const data = await fetch("/config.json");
            const json = await data.json();
            merge(this._value, json);
            resolve();
        });
    }

    private _value: Config = {} as any;
    public get value(): Config {
        return this._value;
    }
}

export default new ConfigSvc();
