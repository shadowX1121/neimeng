// 允许作为全局类型，无需 import
export {};

declare global {
    interface LabelOption<T = any> {
        value: number | string;
        label: string;
        color?: string;
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
}
