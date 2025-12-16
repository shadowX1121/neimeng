// 固定项配置文件
import dayjs from "dayjs";
// 年份
export const YEAR_OPTIONS = Array.from(
    { length: dayjs().year() - 2025 + 1 },
    (_, i) => 2025 + i
).map((item) => ({ value: item, label: item.toString() }));
// 当前年份
export const CURRENT_YEAR = dayjs().year();

// 加减否决项对应值
export const PLUS_OPTIONS = {
    1: "加分项目",
    2: "减分项目",
    3: "一票否决",
};
