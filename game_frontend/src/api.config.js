import axios from "axios";
import Cookies from "js-cookie";

export const instance = axios.create({
    withCredentials: true,
    baseURL: "http://127.0.0.1:8000",
});

instance.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${Cookies.get("token")}`
        return config
    }
)

instance.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        if (
            error.response.status === 401
        ) {
            console.log("401 error")
        }
        else {
            return Promise.reject(error);
        }
    }
);