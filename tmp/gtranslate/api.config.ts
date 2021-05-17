import * as qs from "qs";
import { PathLike } from "fs";

export const apiConfig = {
    returnRejectedPromiseOnError: true,
    withCredentials: false,
    timeout: 30000,
    baseURL: "https://bbabo.net/translate",
    headers: {
        common: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            "Content-Type": "plain/text",
            Accept: "plain/text",
        },
    },
    paramsSerializer: (params: PathLike) => qs.stringify(params, { indices: false }),
}