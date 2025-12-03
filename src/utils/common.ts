// 过滤掉对象中的 undefined 值
export function removeUndefined(obj: any) {
    if (!obj || typeof obj !== "object") return obj;
    for (const key in obj) {
        if (obj[key] === undefined || obj[key] === null) {
            delete obj[key];
        } else if (typeof obj[key] === "object") {
            removeUndefined(obj[key]); // 递归处理
        }
    }
    return obj;
}
