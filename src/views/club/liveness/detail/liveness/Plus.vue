<!--活跃度评估的加分项目表格模块-->
<script setup lang="ts">
import { ref, reactive, watch, inject } from "vue";
import { Check } from "@element-plus/icons-vue";
import { assessApi } from "@/api/index";
import UploadFileDialog from "@/components/dialog/UploadFileDialog.vue";
import DeleteFileDialog from "@/components/dialog/DeleteFileDialog.vue";
import { useAssessItemReviewStatus } from "@/utils/useOptions";

const assessReviewStatus = useAssessItemReviewStatus();
const notifyRefresh = inject<() => void>("notifyRefresh");

const props = defineProps<{
    data: any;
}>();

const loading = ref(false);
const moduleData = ref<any>();
watch(
    () => props.data,
    (newVal) => {
        moduleData.value = {
            ...newVal,
            list: newVal.list.map((listItem: any) => {
                return {
                    ...listItem,
                    fileInfo: listItem.fileInfo.map((fileItem: any) => {
                        return {
                            name: fileItem.file_name,
                            fileUrl: fileItem.file_path,
                        };
                    }),
                };
            }),
        };
    },
    { deep: true, immediate: true }
);

const uploadFileDialog = reactive<{
    visible: boolean;
    data: any;
}>({
    visible: false,
    data: {},
});
const handleUploadFile = (data: any) => {
    uploadFileDialog.visible = true;
    uploadFileDialog.data = {
        id: data.id,
        content: data.content,
        fileList: data.fileInfo,
    };
};
const confirmUploadFile = async (data: any) => {
    return assessApi.uploadEvaluateFile({
        content_id: uploadFileDialog.data.id,
        type: 1,
        files_info: JSON.stringify(
            data.map((item: any) => {
                return {
                    name: item.name,
                    path: item.fileUrl,
                };
            })
        ),
    });
};
// 上传成功回调
const handleUploadSuccess = () => {
    // 更新fileInfo数据
    props.data.list.some((file: any) => {
        if (file.id === uploadFileDialog.data.id) {
            file.fileInfo = uploadFileDialog.data.fileList.map((fileItem: any) => ({
                file_name: fileItem.name,
                file_path: fileItem.fileUrl,
            }));
            file.score = 0;
            file.status = 1;
            return true; // 找到后立即终止所有循环
        }
        return false;
    });
    notifyRefresh?.();
};

// 删除上传文件弹窗数据
const deleteFileDialog = reactive<{
    visible: boolean;
    data: any;
}>({
    visible: false,
    data: {},
});
const handleDeleteFile = (data: any) => {
    deleteFileDialog.visible = true;
    deleteFileDialog.data = {
        id: data.id,
        fileList: data.fileInfo,
    };
};
const confirmDeleteFile = async () => {
    return assessApi.deleteEvaluateFile({
        content_id: deleteFileDialog.data.id,
        type: 1,
    });
};
// 删除文件成功回调
const handleDeleteSuccess = () => {
    // 更新fileInfo数据
    props.data.list.some((file: any) => {
        if (file.id === deleteFileDialog.data.id) {
            file.fileInfo = [];
            file.score = 0;
            file.status = 0;
            return true; // 找到后立即终止所有循环
        }
        return false;
    });
    notifyRefresh?.();
};
</script>

<template>
    <div v-loading="loading">
        <el-empty v-if="moduleData.list.length === 0" description="暂无数据" />
        <template v-else>
            <el-table class="assess-project-table" :data="moduleData.list" style="width: 100%">
                <el-table-column label="序号" type="index" align="center" width="80" />
                <el-table-column
                    label="实证材料（项）"
                    prop="content"
                    align="center"
                    min-width="200"
                />
                <el-table-column label="状态" align="center" width="100">
                    <template #default="{ row }">
                        <span
                            v-if="row.status"
                            :style="[
                                {
                                    color: assessReviewStatus.getColorByValue(row.status),
                                },
                            ]"
                        >
                            {{ assessReviewStatus.getLabelByValue(row.status) }}
                        </span>
                        <span v-else>/</span>
                    </template>
                </el-table-column>
                <el-table-column label="得分" align="center" width="80">
                    <template #default="{ row }">
                        <span v-if="row.score">{{ row.score }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="文件" align="center" width="100">
                    <template #default="{ row }">
                        <div class="file-box">
                            <div class="upload-box" @click="handleUploadFile(row)">
                                <i class="iconfont icon-Upload" style="margin-right: 4px"></i>
                                <span>上传</span>
                            </div>
                            <div
                                class="upload-status"
                                v-if="row.fileInfo && row.fileInfo.length > 0"
                            >
                                <el-tooltip effect="dark" content="文件已上传" placement="top-end">
                                    <div class="triangle" @click="handleDeleteFile(row)">
                                        <el-icon><Check /></el-icon>
                                    </div>
                                </el-tooltip>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <!--上传文件弹窗-->
        <UploadFileDialog
            v-model="uploadFileDialog.visible"
            :data="uploadFileDialog.data"
            :onConfirm="confirmUploadFile"
            @success="handleUploadSuccess"
        />
        <!--删除文件弹窗-->
        <DeleteFileDialog
            v-model="deleteFileDialog.visible"
            :data="deleteFileDialog.data"
            :onConfirm="confirmDeleteFile"
            @success="handleDeleteSuccess"
        />
    </div>
</template>

<style lang="scss" scoped>
.file-box {
    display: flex;
    justify-content: center;
}
.upload-box {
    display: flex;
    align-items: center;
    cursor: pointer;
}
</style>
