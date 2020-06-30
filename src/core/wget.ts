/* eslint-disable @typescript-eslint/no-explicit-any */
import { Locale as LocaleCommon } from "@core/locale.common";
import configSvc from "@core/services/configSvc";
import localeSvc from "@core/services/localeSvc";
import { withAsyncStackTracerOnAllMethods } from "@core/utils";
import queryString, { ParsedUrlQueryInput } from "querystring";
import Logger from "./log";
import { bind, delay, flattenObject } from "./utils";

@withAsyncStackTracerOnAllMethods("Wget")
class Wget {
    public siteId = "";
    public rayId = "";
    constructor() {
        bind(this, "get", "delete", "post", "put");
    }
    private async request(
        method: string,
        action: string,
        body: any,
        opt: any,
        retries = 4
    ): Promise<any> {
        opt = opt || {};
        opt.responseType = opt.responseType || "json";
        opt.qs = opt.qs || {};
        if (this.siteId) opt.qs.siteId = this.siteId;
        if (this.rayId) opt.qs.rayId = this.rayId;
        const qs = queryString.stringify(
            flattenObject(opt.qs) as ParsedUrlQueryInput
        );

        const composedUrl = `${configSvc.value.apiUrl}/${action}${qs ? `?${qs}` : ""
            }`;
        function logError(message: string, e: Error): void {
            Logger.network(message, {
                url: `${window.location.protocol}${composedUrl}`,
                method,
                action,
                body,
                opt,
                retries,
                exception: e,
            });
        }
        let response: Response;
        try {
            const args: RequestInit = {
                method,
                credentials: "include",
                headers: {},
            };
            if (body) args.body = JSON.stringify(body);
            if (["POST", "PUT", "DELETE"].includes(method)) {
                args.headers = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };
            }
            response = await fetch(composedUrl, args);
            let result;
            try {
                if (opt.responseType === "blob") result = await response.blob();
                else {
                    result = resolveReferences(await response.json());
                }
            } catch (e) {
                result = null;
            }
            if (!response.ok) throw result;
            return result;
        } catch (e) {
            if (!e?.message && e?.error && e?.error?.message)
                e.message = e.error.message;
            // Errors that came not from API
            if (e instanceof TypeError) {
                Logger.network(e.message, {
                    url: `${window.location.protocol}${composedUrl}`,
                    method,
                    action,
                    body,
                    opt,
                    retries,
                    response,
                    exception: e,
                });
                if (retries) {
                    // eslint-disable-next-line no-console
                    console.warn(
                        `Failed to make request to ${method}:${action}`,
                        body,
                        opt,
                        retries
                    );
                    await delay(500);
                    return this.request(method, action, body, opt, retries - 1);
                }
                throw {
                    message: (localeSvc.get("common") as LocaleCommon).tryAgainLater,
                    type: "critical",
                    skipLoggingIfNotCatched: true,
                };
            }
            if (response && response.status >= 400 && response.status < 500)
                Logger.metrica("wget4xx", e.message, {
                    method,
                    action,
                    opt,
                    retries,
                    status: response.status,
                });
            else logError(e.message, e);
            throw e;
        }
    }
    public get<T>(action: string, opt?: any): Promise<T> {
        return this.request("GET", action, null, opt);
    }
    public delete(action: string, body?: any, opt?: any): Promise<any> {
        return this.request("DELETE", action, body, opt);
    }
    public post(action: string, body: any, opt?: any): Promise<any> {
        return this.request("POST", action, body, opt);
    }
    public put(action: string, body: any, opt?: any): Promise<any> {
        return this.request("PUT", action, body, opt);
    }
}

function resolveReferences(json: any): any {
    if (typeof json === "string") json = JSON.parse(json);

    const byid: any = {}; // all objects by id
    const refs: any[] = []; // references to objects that could not be resolved
    json = (function recurse(obj, prop: any, parent: any) {
        if (typeof obj !== "object" || !obj)
            // a primitive value
            return obj;
        if (Object.prototype.toString.call(obj) === "[object Array]") {
            for (let i = 0; i < obj.length; i++)
                // check also if the array element is not a primitive value
                if (typeof obj[i] !== "object" || !obj[i])
                    // a primitive value
                    continue;
                else if ("$ref" in obj[i]) obj[i] = recurse(obj[i], i, obj);
                else obj[i] = recurse(obj[i], prop, obj);
            return obj;
        }
        if ("$ref" in obj) {
            // a reference
            const ref = obj.$ref;
            if (ref in byid) return byid[ref];
            // else we have to make it lazy:
            refs.push([parent, prop, ref]);
            return;
        } else if ("$id" in obj) {
            const id = obj.$id;
            delete obj.$id;
            if ("$values" in obj)
                // an array
                obj = obj.$values.map(recurse);
            // a plain object
            else for (const prop in obj) obj[prop] = recurse(obj[prop], prop, obj);
            byid[id] = obj;
        }
        return obj;
    })(json, null, null); // run it!

    for (let i = 0; i < refs.length; i++) {
        // resolve previously unknown references
        const ref = refs[i];
        ref[0][ref[1]] = byid[ref[2]];
        // Notice that this throws if you put in a reference at top-level
    }
    return json;
}

export default new Wget();
