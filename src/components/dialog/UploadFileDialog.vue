<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { CircleCheck, CircleClose, Loading, Delete } from "@element-plus/icons-vue";
import MySimpleUpload from "@/components/upload/MySimpleUpload.vue";

const router = useRouter();

const props = defineProps<{
    modelValue: boolean;
    data: any;
}>();

const content = ref("");
const fileList = ref<any[]>([]);

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            if (props.data) {
                content.value = props.data.name || "";
                fileList.value = props.data.fileList || [];
            }
        }
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();

const close = () => emit("update:modelValue", false);

// 上传文件回调
const handleChangeCallback = () => {
    console.log("fileList", fileList.value);
};
// 删除点击事件
const deleteClick = (index: number) => {
    fileList.value.splice(index, 1);
    // update();
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
            <p>{{ content }}</p>
            <MySimpleUpload v-model="fileList" @change="handleChangeCallback">
                <template #default>
                    <el-button size="small" type="primary" plain>上传文件</el-button>
                </template>
            </MySimpleUpload>
            <div class="file-list" v-if="fileList && fileList.length > 0">
                <div class="file-item" v-for="(file, index) in fileList" :key="index">
                    <div class="file-content">
                        <i class="iconfont icon-downloadbox"></i>
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
                        @click="deleteClick(index)"
                    ></el-button>
                </div>
            </div>
        </div>
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
