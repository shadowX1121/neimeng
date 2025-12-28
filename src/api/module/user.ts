// 用户相关 API
import request from "../request";
export const userApi = {
    login: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: "/auth/login",
            method: "POST",
            data: params,
        });
    },
    update: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: "/account/info",
            method: "POST",
            data: params,
        });
    },
    // 创建下载任务
    createDownload: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: "/create_evaluate_download",
            method: "POST",
            data: params,
        });
    },
    // 获取下载列表
    getDownloadList: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: "/get_download_list",
            method: "GET",
            params,
        });
    },
};
