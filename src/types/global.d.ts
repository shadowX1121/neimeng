// 允许作为全局类型，无需 import
export {};

declare global {
    interface ResponseData<T = any> {
        code: number;
        msg: string;
        data: T;
    }

    interface LabelOption<T = any> {
        value: number | string;
        label: string;
        color?: string;
        description?: string;
        [key: string]: any;
    }

    interface MyMeta {
        title?: string;
        description?: string;
        acitveMenu?: string;
    }

    interface MyPagination {
        current: number;
        size: number;
        total: number | "";
    }

    interface MyPaneItem {
        label: string;
        name: string;
    }
    /**
     * 组织账号信息
     */
    interface OrgAccountType {
        id: string | number;
        name: string;
        status: number;
        score: number | string;
        level: number | string;
        userName: string;
        phone: string;
    }
}
