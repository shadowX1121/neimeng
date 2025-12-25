// 评估模块相请求 API
import request from "../request";
export const institutionApi = {
    // 添加机构账号
    add: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: "/institution",
            method: "POST",
            data: params,
        });
    },
    // 获取机构账号列表
    getList: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: "/institution_list",
            method: "GET",
            params,
        });
    },
    // 修改机构管理员信息
    updateManager: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: "/institution_manager",
            method: "POST",
            data: params,
        });
    },
};
