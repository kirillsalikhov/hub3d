import axios from 'axios';
import { spaceKeyFromUrl } from "@/util/url";
import { isBrowser } from './isBrowser';

export const createAxios = () => {
    const axiosInstance = axios.create();

    axiosInstance.interceptors.request.use(function (config) {
         if (!isBrowser()) {
             // passed from rails and set in createRequest
             const cookie = global.ssrFetchRequest.headers.get('cookie');
             if (cookie) {
                 config.headers = config.headers ?? {};
                 config.headers['Cookie'] = cookie;
             }
         }
         return config;
    });

    axiosInstance.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        return Promise.reject(error);
    });

    // TODO for Marina, not sure if it's write level for Api logic
    axiosInstance.interceptors.request.use(function (config) {
        // if header space-id is not set, try to get it from browser url
        // Note try to use space-id or space-key not both
        if (!config.headers?.["space-id"]) {
            // TODO probably use window.location.pathname or something global.ssrFetchRequest
            const spaceKey = spaceKeyFromUrl(window.location.pathname);
            if (spaceKey) {
                config.headers = config.headers ?? {};
                config.headers["space-key"] = spaceKey;
            }
        }
        return config;
    });

    return axiosInstance;
}
