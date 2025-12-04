// 账号状态
export const ACCOUNT_STATUS_OPTIONS: LabelOption[] = [
    {
        value: 1,
        label: "激活",
        color: "#009F4D",
        description: "正常登录使用，正常统计数据",
    },
    {
        value: 2,
        label: "冻结",
        color: "#FF4B4B",
        description: "不能登录使用，正常统计数据",
    },
    {
        value: 3,
        label: "撤销",
        color: "#999999",
        description: "不能登录使用，不统计数据，但保留其数据",
    },
    {
        value: 4,
        label: "清除",
        color: "#999999",
        description: "不能登录使用，完全清除数据及账号",
    },
];
