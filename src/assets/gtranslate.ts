import {AxiosRequestConfig} from "axios";
import {Api} from "axios-es6-class";

// this are the minimun properties the Api class expect
export const apiConfig: AxiosRequestConfig = {
    timeout: 60000,
    baseURL: "https://bbabo.net"
};

export class TranslateApi extends Api {
    constructor (config: any) {
        super(config);

        this.translate = this.translate.bind(this);
    }

    translate (credentials: any) {
        return this.post("/translate", credentials)
            .then(this.success)
    }
}

export const gtranslateApi = new TranslateApi(apiConfig);