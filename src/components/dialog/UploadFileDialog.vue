<script setup lang="ts">
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { CircleCheck, CircleClose, Loading, Delete } from "@element-plus/icons-vue";
import MySimpleUpload from "@/components/upload/MySimpleUpload.vue";

const props = defineProps<{
    modelValue: boolean;
    data: any;
    onConfirm: (data: any[]) => Promise<{ code: number }>;
}>();

const content = ref("");
const fileList = ref<any[]>([]);

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            if (props.data) {
                console.log("props.data", props.data);
                content.value = props.data.content || "";
                fileList.value =
                    props.data.fileList.map((item: any) => {
                        return {
                            ...item,
                            status: "success",
                        };
                    }) || [];
            }
        }
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "success"): void;
}>();

const close = () => emit("update:modelValue", false);

// 上传文件回调
const handleChangeCallback = () => {
    console.log("fileList", fileList.value);
};
// 删除点击事件
const deleteClick = (index: number) => {
    fileList.value.splice(index, 1);
};
const submitLoading = ref(false);
const confirmClick = async () => {
    if (!fileList.value.length) {
        ElMessage.warning(`请上传文件`);
        return;
    }
    const hasReady = fileList.value.some((item: any) => item.status === "ready");
    const hasFail = fileList.value.some((item: any) => item.status === "fail");
    if (hasReady) {
        ElMessage.warning(`请等待所有文件上传完成`);
        return;
    }
    if (hasFail) {
        ElMessage.warning(`请删除上传失败的文件`);
        return;
    }
    if (submitLoading.value) return; // 二次保险
    submitLoading.value = true;
    try {
        const { code } = await props.onConfirm(fileList.value);
        if (code === 200) {
            ElMessage.success(`上传成功`);
            props.data.fileList = fileList.value;
            close();
            emit("success");
        }
    } catch (error) {
        console.log(error);
    } finally {
        submitLoading.value = false;
    }
};
</script>

<template>
    <el-dialog
        :model-value="props.modelValue"
        title="上传文件"
        width="480"
        @close="close"
        :close-on-click-modal="false"
        align-center
        :append-to-body="true"
    >
        <div class="dialog-start-wrapper">
            <p style="margin-bottom: 16px">{{ content }}</p>
            <MySimpleUpload v-model="fileList" @change="handleChangeCallback">
                <template #default>
                    <el-button size="small" type="primary" plain>上传文件</el-button>
                </template>
            </MySimpleUpload>
            <div class="file-list" v-if="fileList && fileList.length > 0">
                <div class="file-item" v-for="(file, index) in fileList" :key="index">
                    <div class="file-content">
                        <svg class="my-icon" aria-hidden="true">
                            <use xlink:href="#icon-PDF"></use>
                        </svg>
                        <p class="file-name">{{ file.name }}</p>
                        <p class="file-status">
                            <el-icon v-if="file.status === 'success'" color="#009F4D" size="16">
                                <CircleCheck />
                            </el-icon>
                            <el-icon v-else-if="file.status === 'fail'" color="#f56c6c" size="16">
                                <CircleClose />
                            </el-icon>
                            <el-icon v-else size="16" class="spinner">
                                <Loading />
                            </el-icon>
                        </p>
                    </div>
                    <el-button
                        class="delete-icon"
                        link
                        :icon="Delete"
                        :disabled="file.status === 'ready'"
                        @click="deleteClick(index)"
                    ></el-button>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" :loading="submitLoading" @click="confirmClick">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.file-list {
    width: 100%;
    padding-top: 8px;
    .file-item {
        display: flex;
        align-items: center;
        width: 100%;
        margin-top: 6px;
        .file-name {
            flex: 1;
            margin-left: 8px;
            margin-right: 12px;
            min-width: 10px;
            /* 超出隐藏  */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .file-status {
            display: flex;
            align-items: center;
        }
        .spinner {
            animation: spin 1.5s linear infinite;
            will-change: transform;
        }
        .file-content {
            display: flex;
            align-items: center;
            width: 400px;
            padding: 4px 8px;
            background: #f6f9fb;
            line-height: 22px;
            border-radius: 6px;
        }
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        .delete-icon {
            margin-left: 12px;
            color: #ff4b4b;
            font-size: 16px;
        }
    }
}
</style>
