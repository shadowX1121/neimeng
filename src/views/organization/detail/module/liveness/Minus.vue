<!--活跃度评估的减分项目表格模块-->
<script setup lang="ts">
import { ref, reactive, watch, watchEffect } from "vue";
import { ElMessage } from "element-plus";
import { mockApi } from "@/api/index";
import { UploadFilled, Check } from "@element-plus/icons-vue";
import { assessApi } from "@/api/module/assess";
import UploadFileDialog from "@/components/dialog/UploadFileDialog.vue";

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
                    fileList: [],
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

const handleDeleteFile = (data: any) => {
    ElMessage.success("删除成功");
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
                            <div class="upload-status">
                                <el-tooltip effect="dark" content="文件已上传" placement="top-end">
                                    <div class="triangle" @click="handleDeleteFile">
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
        <UploadFileDialog v-model="uploadFileDialog.visible" :data="uploadFileDialog.data" />
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
