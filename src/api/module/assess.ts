// 评估模块相请求 API
import request from "../request";
export const assessApi = {
    // 获取加减分、一票否决项列表
    getPlusList: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: "/plus_list",
            method: "GET",
            params,
        });
    },
    // 修改加减分、一票否决项
    updatePlus: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: "/plus",
            method: "PUT",
            data: params,
        });
    },
    // 删除加减分、一票否决项
    deletePlus: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: `/plus`,
            method: "DELETE",
            data: params,
        });
    },
    // 新增加减分、一票否决项
    addPlus: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: `/plus`,
            method: "POST",
            data: params,
        });
    },
    // 获取星级列表
    getStarList: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: `/star_list`,
            method: "GET",
            params,
        });
    },
    // 修改星级
    updateStar: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: `/star`,
            method: "PUT",
            data: params,
        });
    },
    // 获取项目列表
    getEvaluateList: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: `/evaluate_list`,
            method: "GET",
            params,
        });
    },
    // 添加项目
    addEvaluate: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: `/evaluate`,
            method: "POST",
            data: params,
        });
    },
    // 添加评估项
    addEvaluateDetail: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: `/evaluate_detail`,
            method: "POST",
            data: params,
        });
    },
};
