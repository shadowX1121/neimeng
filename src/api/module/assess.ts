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
    // 获取活跃度评估信息
    getEvaluateListInfo: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: `/evaluate_list_info`,
            method: "GET",
            params,
        });
    },
    // 上传评估证明文件
    uploadEvaluateFile: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: `/upload_evaluate_file`,
            method: "POST",
            data: params,
        });
    },
    // 删除评估证明文件
    deleteEvaluateFile: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: `/evaluate_file`,
            method: "DELETE",
            params,
        });
    },
    // 获取星级相关信息
    getStarInfo: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: `/get_star_info`,
            method: "GET",
            params,
        });
    },
    // 得分/取消得分操作
    updateItemScoreControl: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: `/add_score`,
            method: "POST",
            data: params,
        });
    },
};
