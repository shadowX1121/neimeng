<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref, watch } from "vue";
import { useOssUpload } from "@/utils/useOssUpload";

interface Props {
    modelValue?: any[];
    action?: string;
    headers?: Record<string, string>;
    name?: string;
    multiple?: boolean;
    accept?: string;
    limit?: number;
    listType?: "text" | "picture" | "picture-card";
    autoUpload?: boolean;
    drag?: boolean;
    disabled?: boolean;
    maxSize?: number; // MB
    minSize?: number; // MB
}

const { upload } = useOssUpload();

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    action: "#",
    headers: () => ({}),
    name: "file",
    multiple: true,
    accept: ".pdf",
    limit: 3,
    listType: "text",
    autoUpload: true,
    drag: false,
    disabled: false,
    maxSize: 100, // 10MB
    minSize: 0, // 0MB
});

const emit = defineEmits(["update:modelValue", "success", "error", "change"]);
const fileList = ref<any[]>([]);

// 父组件更新 v-model → 子组件同步
watch(
    () => props.modelValue,
    (val) => {
        console.log("文件列表", props.modelValue);
        fileList.value = [...val];
    },
    { deep: true, immediate: true }
);

// 子组件更新 → 通知父组件
const updateFileList = (val: any) => {
    emit("update:modelValue", val);
    emit("change");
};
// 上传前的钩子
const handleBeforeUpload = (file: File) => {
    const sizeInMB = file.size / 1024 / 1024;
    if (sizeInMB > props.maxSize) {
        ElMessage.error(`文件大小不能超过 ${props.maxSize} MB`);
        return false;
    }
    if (sizeInMB < props.minSize) {
        ElMessage.error(`文件大小不能小于 ${props.minSize} MB`);
        return false;
    }
    return true;
};
// 文件状态改变时的钩子
const handleChange = (file: any) => {
    const findFile = fileList.value.find((item) => item.uid === file.uid);
    if (findFile) {
        findFile.status = file.status;
        findFile.percentage = file.percentage;
    } else if (file.status === "ready") {
        fileList.value.push({
            name: file.name,
            fileUrl: "",
            percentage: file.percentage,
            status: file.status,
            size: file.size,
            uid: file.uid,
        });
    }
    updateFileList(fileList.value);
};
// 文件上传成功时的钩子
const handleSuccess = (response: any, file: any) => {
    const findFile = fileList.value.find((item) => item.uid === file.uid);
    if (findFile && response && response.url) {
        findFile.fileUrl = response.url;
    }
};
// 文件上传失败时的钩子
const handleError = (error: any, file: any, files: any[]) => {
    // console.log("error", file, files);
};
// 文件上传进度变化时的钩子
const handleProgress = (event: any, file: any, files: any[]) => {
    // console.log("Progress", file, files);
};
// 文件超出个数限制时的钩子
const handleExceed = () => {
    ElMessage.warning(`只能上传最多 ${props.limit} 个文件`);
};
// 自定义上传请求的钩子
const handleHttpRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    // try {
    //     const url = await upload(option.file, {
    //         dir: "files",
    //         onProgress: (p) => (progress.value = p),
    //     });

    //     option.onSuccess(url);
    // } catch (e) {
    //     option.onError(e);
    // }
    try {
        // ⭐ 自定义上传请求（可换成你的 API）
        const res = await upload(file);
        console.log("上传后的文件", res);
        onSuccess(res, file);
    } catch (e) {
        onError(e);
    }
};

// 模拟上传请求，你替换成 axios 即可
const fakeUploadRequest = (formData: FormData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                url: URL.createObjectURL(formData.get("file") as File),
                name: (formData.get("file") as File).name,
            });
        }, 10000);
    });
};
</script>
<template>
    <el-upload
        class="simple-upload"
        :accept="accept"
        :action="action"
        :multiple="multiple"
        :show-file-list="false"
        :limit="limit"
        :before-upload="handleBeforeUpload"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-progress="handleProgress"
        :on-exceed="handleExceed"
        :http-request="handleHttpRequest"
    >
        <slot>
            <el-button size="small" type="primary">点击添加</el-button>
        </slot>

        <template #tip>
            <slot name="tip">
                <p class="tip">支持上传最多10个文件（PDF格式）</p>
            </slot>
        </template>
    </el-upload>
</template>

<style lang="scss" scoped>
.simple-upload {
    display: flex;
    align-items: center;
    .tip {
        margin-left: 12px;
        font-size: 12px;
        color: #666666;
    }
}
</style>
