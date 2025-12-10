// 固定项配置文件
import dayjs from "dayjs";
// 年份
export const YEAR_OPTIONS = Array.from(
    { length: dayjs().year() - 2025 + 1 },
    (_, i) => 2025 + i
).map((item) => ({ value: item, label: item.toString() }));
// 当前年份
export const CURRENT_YEAR = dayjs().year();
