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
};
