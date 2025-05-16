import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosRequestHeaders } from 'axios';
import queryString from 'query-string';
import { KEY_LOCAL_STORAGE } from '../../constants/general.constant';

const baseURL = process.env.REACT_APP_API_URL;

const privateClient: AxiosInstance = axios.create({
    baseURL,
    paramsSerializer: (params: any) => queryString.stringify(params),
});

privateClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
    return {
        ...config,
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem(KEY_LOCAL_STORAGE.AUTHEN)}`,
        } as AxiosRequestHeaders,
    };
});

privateClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: any) => {
        return Promise.reject(error.response);
    }
);

export default privateClient;
