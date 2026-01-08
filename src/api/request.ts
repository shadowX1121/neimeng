import axios, {
    type AxiosInstance,
    type InternalAxiosRequestConfig,
    type AxiosResponse,
} from "axios";
import { ElMessage } from "element-plus";
import { removeUndefined } from "@/utils/common";
const request: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
});

// 请求拦截
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    // 处理 GET 参数（params）
    // if (config.params) {
    //     config.params = removeUndefined(config.params);
    //     if (!config.params.hasOwnProperty("_token")) {
    //         config.params._token = token || "";
    //     }
    // }
    // 处理 POST
    if (config.data) {
        config.data = removeUndefined(config.data);
        if (!config.data.hasOwnProperty("_token") && config.method?.toLowerCase() === "post") {
            config.data._token = token || "";
        }
    }
    token && (config.headers["X-CSRF-TOKEN"] = token);
    return config;
});

// 响应拦截
request.interceptors.response.use(
    (response: AxiosResponse) => {
        const { code, msg } = response.data;
        console.log("response", response);

        if (code === 200) {
            return response.data;
        } else {
            if (msg) ElMessage.error(msg);
            if (code === 401 || code === 403) {
                // 跳转登录页
            }
        }
    },
    (error) => {
        let message = "请求失败，请稍后重试";
        if (typeof error === "string") {
            message = error;
        } else if (error.response) {
            // HTTP 状态码错误
            const status = error.response.status;
            switch (status) {
                case 400:
                    message = "请求参数错误";
                    break;
                case 401:
                    message = "未授权，请登录";
                    break;
                case 403:
                    message = "拒绝访问";
                    break;
                case 404:
                    message = "请求资源不存在";
                    break;
                case 500:
                    message = "服务器内部错误";
                    break;
                default:
                    message = `网络错误: ${status}`;
            }
            message = error.message;
        } else if (error.request) {
            // 请求已发出但无响应
            message = "服务器无响应，请检查网络";
        } else if (error.message) {
            // 其他错误
            message = error.message;
        }
        ElMessage.error(message);
        console.error("Axios Error:", error);
        return Promise.reject(error);
    }
);

export default request;
