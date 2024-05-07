import axios from 'axios';

// TODO for Marina: copy pasted from Client
const isBrowser = () => typeof window !== 'undefined'

export const createAxios = () => {
    const axiosInstance = axios.create();

    axiosInstance.interceptors.request.use(function (config) {
         if (!isBrowser()) {
             // passed from rails and set in createRequest
             const cookie = global.ssrFetchRequest.headers.get('cookie');
             if (cookie) {
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
    return axiosInstance;
}
