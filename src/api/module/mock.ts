// 模拟相请求 API
import type { ResponseData } from "@/types/request";
export const mockApi = {
    mock: (params: any, data: any): Promise<ResponseData<any>> => {
        console.log("提交的参数是：", params);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    msg: "成功",
                    data: data,
                });
            }, Math.floor(Math.random() * (2000 - 500 + 1)) + 500);
        });
    },
};
