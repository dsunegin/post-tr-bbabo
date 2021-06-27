import {AxiosRequestConfig} from "axios";
import {Api} from "axios-es6-class";

// this are the minimun properties the Api class expect
let apiConfig: AxiosRequestConfig = {
    timeout: 60000,
    baseURL: process.env.TRANSLATE_BASEURL
};
export interface  translateData{
    sl?: string,
    tl?:string,
    text?:string

}
export class TranslateApi extends Api {
    constructor (config: any) {
        super(config);

        // this middleware is been called right before the http request is made.
        this.interceptors.request.use(param => {
            return {
                ...param,
                headers: {
                    ...param.headers,
                    "Authorization": `Bearer ${this.getToken()}`
                },
            }
        });

        this.translate = this.translate.bind(this);
        this.test = this.test.bind(this);

    }

    translate (data: translateData): any {
        return this.post("/translate", data)
            .then(this.success)
    }
    test (): any {
        return this.get("/translate")
            .then(this.success)
    }
}

export const translateApi = new TranslateApi(apiConfig);