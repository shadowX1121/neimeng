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

    interface Column {
        prop: string;
        label: string;
        width?: number;
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
     * id，value类型
     */
    type IdValueType = number | string;
    /**
     * 表格合并行或列方法的参数类型
     */
    interface SpanMethodProps<T = any> {
        row: T;
        column: TableColumnCtx<T>;
        rowIndex: number;
        columnIndex: number;
    }

    /**
     * 组织账号信息
     */
    interface OrgAccountType {
        id: IdValueType;
        name: string;
        status: number;
        score: number | string;
        level: number | string;
        userName: string;
        phone: string;
    }
    /**
     * 评估分类信息
     */
    interface AssessClassifyType {
        id?: IdValueType;
        evaluate_name: string;
        project_info: AssessProjectType[];
    }
    /**
     * 评估项目信息
     */
    interface AssessProjectType {
        id?: IdValueType;
        evaluate_project_name: string;
        project_detail?: AssessItemBaseType[];
    }
    /**
     * 结构化后的评估项目信息
     */
    interface AssessProjectStructType {
        id: IdValueType;
        projectId: IdValueType;
        projectName: string;
        projectRowSpan: number;
        assessId: IdValueType;
        assessName: string;
        assessRowSpan: number;
        gistId: IdValueType;
        gistIndex: number;
        gist: string;
        fileName: string;
        fileUrl: string;
        isBase: boolean;
    }
    /**
     * 评估项信息
     */
    interface AssessItemBaseType {
        id?: IdValueType;
        evaluate_detail_name: string;
        evaluate_points: string;
        detail_info: AssessItemMaterialType[];
    }
    interface AssessItemType extends AssessItemBaseType {
        classifyId: IdValueType;
        evaluateId: IdValueType;
    }
    /**
     * 评估项材料项
     */
    interface AssessItemMaterialType {
        id?: IdValueType;
        content: string;
        flag: 0 | 1;
    }
    /**
     * 加减/否决项key对应值
     */
    type PlusValueType = 1 | 2 | 3;
}
