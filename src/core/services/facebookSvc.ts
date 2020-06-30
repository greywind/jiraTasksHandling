import configSvc, { Config } from "./configSvc";

declare var FB: any;

export interface FacebookAccountInfo {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

interface FacebookLogin {
    id?: string;
    success: boolean;
    account?: FacebookAccountInfo;
}

class FacebookService {
    constructor(config: Config) {
        (window as any).fbAsyncInit = function () {
            FB.init({
                appId: config.facebookId,
                cookie: true,
                xfbml: true,
                version: "v4.0",
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            (js as any).src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, "script", "facebook-jssdk"));
    }

    public async authorize(): Promise<FacebookLogin> {
        let result = await this.isConnected();
        if (!result.success)
            result = await this.login();
        if (!result.success)
            return result;
        const info = await this.getInfo();
        return { ...result, account: { ...info, id: result.id } };
    }

    public async getInfo(): Promise<FacebookAccountInfo> {
        return new Promise((resolve, reject) => {
            FB.api("/me?fields=first_name,last_name,address,email,picture", (response: any) => {
                if (response?.error)
                    return reject(response.error);
                resolve({ firstName: response.first_name, lastName: response.last_name, email: response.email, avatar: response.picture.data.url });
            });
        });
    }

    public async login(): Promise<FacebookLogin> {
        return new Promise(resolve => {
            FB.login((response: any) => {
                if (response.status == "connected")
                    resolve({ id: response.authResponse.userID, success: true });
                else
                    resolve({ success: false });
            });
        });
    }

    public async isConnected(): Promise<FacebookLogin> {
        return new Promise(resolve => {
            FB.getLoginStatus((response: any) => {
                if (response.status == "connected")
                    resolve({ id: response.authResponse.userID, success: true });
                else
                    resolve({ success: false });
            });
        });
    }

}

export default new FacebookService(configSvc.value);