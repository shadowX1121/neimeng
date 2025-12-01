// 用户相关 API
import request from "../request";
import type { ResponseData } from "@/types/request";
export const userApi = {
    login: (params: any): Promise<ResponseData<any>> => {
        return request.request({
            url: "/api/user/login",
            method: "POST",
            data: params,
        });
    },
    getInfo: (): Promise<ResponseData<any>> => {
        return request.request({
            url: "/api/user/info",
            method: "GET",
        });
    },
    // 更新用户信息
    updateUser: (
        id: number,
        data: Partial<any>
    ): Promise<ResponseData<any>> => {
        return request.request({
            url: `/api/user/info/${id}`,
            method: "POST",
            data,
        });
    },
    // // 用户登录
    // login: (params: LoginParams): Promise<ResponseData<LoginResult>> => {
    //     return request.post<LoginResult>("/auth/login", params, {
    //         showLoading: true,
    //         showError: true,
    //     });
    // },

    // // 获取用户信息
    // getUserInfo: (userId: number): Promise<ResponseData<User>> => {
    //     return request.get<User>(`/user/${userId}`, null, {
    //         showLoading: true,
    //     });
    // },

    // // 获取用户列表（带分页）
    // getUserList: (
    //     params: PaginationParams
    // ): Promise<ResponseData<PaginationResult<User>>> => {
    //     return request.get<PaginationResult<User>>("/user/list", params, {
    //         showLoading: true,
    //     });
    // },

    // // 更新用户信息
    // updateUser: (
    //     userId: number,
    //     data: Partial<User>
    // ): Promise<ResponseData<User>> => {
    //     return request.put<User>(`/user/${userId}`, data, {
    //         showLoading: true,
    //     });
    // },

    // // 删除用户
    // deleteUser: (userId: number): Promise<ResponseData<boolean>> => {
    //     return request.delete<boolean>(`/user/${userId}`, {
    //         showLoading: true,
    //     });
    // },
};
