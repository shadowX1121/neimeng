<script setup lang="ts">
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps<{
    modelValue: boolean;
    data: any;
    onConfirm: () => Promise<{ code: number }>;
}>();

const fileList = ref<any[]>([]);

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            if (props.data) {
                fileList.value = props.data.fileList || [];
            }
        }
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();

const close = () => emit("update:modelValue", false);

const submitLoading = ref(false);
const confirmClick = async () => {
    if (submitLoading.value) return; // 二次保险
    submitLoading.value = true;
    try {
        const { code } = await props.onConfirm();
        if (code === 200) {
            ElMessage.success(`删除成功`);
            props.data.fileList = [];
            close();
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
            <p>是否要删除已传文件？</p>
            <div class="file-list" v-if="fileList && fileList.length > 0">
                <div class="file-item" v-for="(file, index) in fileList" :key="index">
                    <div class="file-content">
                        <i class="iconfont icon-downloadbox"></i>
                        <p class="file-name">{{ file.name }}</p>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="close">取消</el-button>
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
            min-width: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .file-content {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 4px 8px;
            background: #f6f9fb;
            line-height: 22px;
            border-radius: 6px;
        }
    }
}
</style>
