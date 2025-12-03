// 手机号验证
export function isPhone(value: string) {
    const phonePattern = /^1[3-9]\d{9}$/;
    return phonePattern.test(value);
}
// 身份证号验证
export function isIdCard(value: string) {
    const idCardPattern =
        /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])([0-2][1-9]|[12][0-9]|3[01])\d{3}(\d|X)$/;
    return idCardPattern.test(value);
}
// 邮箱验证
export function isEmail(value: string) {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailPattern.test(value);
}
// 社会统一信用代码验证
export function isUnifyCode(value: string) {
    const emailPattern =
        /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/;
    return emailPattern.test(value);
}
