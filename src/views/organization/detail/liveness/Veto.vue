<!--活跃度评估的一票否决表格模块-->
<script setup lang="ts">
import { ref, reactive, watch, inject } from "vue";
import { UploadFilled, Check } from "@element-plus/icons-vue";
import { assessApi } from "@/api/index";
import UploadFileDialog from "@/components/dialog/UploadFileDialog.vue";
import DeleteFileDialog from "@/components/dialog/DeleteFileDialog.vue";

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
                    fileList:
                        listItem.fileInfo.map((file: any) => {
                            return {
                                name: file.file_name,
                                fileUrl: file.file_path,
                            };
                        }) || [],
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
    uploadFileDialog.data = data;
};
const confirmUploadFile = async (data: any) => {
    return assessApi.uploadEvaluateFile({
        content_id: uploadFileDialog.data.id,
        type: uploadFileDialog.data.type,
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
    props.data.list.forEach((item: any) => {
        if (item.id === uploadFileDialog.data.id) {
            item.fileInfo = uploadFileDialog.data.fileList.map((file: any) => {
                return {
                    file_name: file.name,
                    file_path: file.fileUrl,
                };
            });
        }
    });
    // 通知父组件更新数据
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
    deleteFileDialog.data = data;
};
const confirmDeleteFile = async () => {
    return assessApi.deleteEvaluateFile({
        content_id: deleteFileDialog.data.id,
        type: deleteFileDialog.data.type,
    });
};
// 删除文件成功回调
const handleDeleteSuccess = () => {
    // 更新fileInfo数据
    props.data.list.forEach((item: any) => {
        if (item.id === deleteFileDialog.data.id) {
            item.fileInfo = [];
        }
    });
    // 通知父组件更新数据
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
                <el-table-column label="文件" align="center" width="100">
                    <template #default="{ row }">
                        <div class="file-box">
                            <div class="upload-box" @click="handleUploadFile(row)">
                                <el-icon :size="20">
                                    <UploadFilled />
                                </el-icon>
                                <span>上传</span>
                            </div>
                            <div
                                class="upload-status"
                                v-if="row.fileList && row.fileList.length > 0"
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
.upload-status {
    position: absolute;
    width: 32px;
    height: 32px;
    right: 0;
    top: 0;
    .triangle {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        clip-path: polygon(100% 0, 100% 100%, 0 0);
        cursor: pointer;
        z-index: 1;
        background-color: #009f4d;
        .el-icon {
            position: absolute;
            right: 2px;
            top: 4px;
            color: #fff;
        }
    }
}
</style>
