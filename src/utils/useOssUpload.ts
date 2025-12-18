import OSS from "ali-oss";
import request from "@/api/request";

interface StsInfo {
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
    expiration: string;
    region: string;
    bucket: string;
}
interface UploadOptions {
    dir?: string; // oss 目录
    fileName?: string;
    onProgress?: (percent: number) => void;
}

let cachedSts: StsInfo | null = null;
let expireTime = 0;
let ossClient: OSS | null = null;
let currentAccessKeyId: string | null = null;

// 获取 STS
const getUploadStsKey = (): Promise<ResponseData<any>> => {
    return request.request({
        url: "/admin/upload_sts_key",
        method: "GET",
    });
};
// 获取 STS（带缓存 & 过期判断）
async function getSts(): Promise<any> {
    const now = Date.now();
    // 提前 2 分钟刷新
    if (cachedSts && now < expireTime - 2 * 60 * 1000) {
        return cachedSts;
    }
    const { code, data } = await getUploadStsKey();
    console.log("data", data);
    if (code !== 200) throw new Error("获取 STS 失败");
    const sts = data;
    cachedSts = sts;
    expireTime = new Date(sts.Expiration).getTime();
    return sts;
}

async function getClient(): Promise<OSS> {
    const sts = await getSts();
    if (!ossClient || currentAccessKeyId !== sts.AccessKeyId) {
        ossClient = new OSS({
            region: sts.region,
            bucket: sts.bucket,
            accessKeyId: sts.AccessKeyId,
            accessKeySecret: sts.AccessKeySecret,
            stsToken: sts.SecurityToken,
        });
        currentAccessKeyId = sts.AccessKeyId;
    }
    return ossClient;
}

export function useOssUpload() {
    // 上传文件
    const upload = async (file: File, options: UploadOptions = {}): Promise<string> => {
        const client = await getClient();
        const dir = options.dir ?? "upload";
        const ext = file.name.substring(file.name.lastIndexOf("."));
        const name =
            options.fileName ?? `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
        const objectKey = `${dir}/${name}`;

        const result = await client.put(objectKey, file, {
            progress(p: number) {
                options.onProgress?.(Math.floor(p * 100));
            },
        } as any);

        // ⭐⭐ 关键：手动判断是否真的成功 ⭐⭐
        if (!result || result.res?.status !== 200) {
            throw new Error(`OSS upload failed, status=${result?.res?.status}`);
        }

        return result.url;
    };

    // 手动清空（如退出登录）
    const clear = () => {
        cachedSts = null;
        ossClient = null;
        expireTime = 0;
    };
    return {
        upload,
        clear,
    };
}
