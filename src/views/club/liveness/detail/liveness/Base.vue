<!--活跃度评估的基础表格模块-->
<script setup lang="ts">
import { ref, reactive, computed, watch, inject } from "vue";
import { UploadFilled, Check } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { assessApi } from "@/api/index";
import UploadFileDialog from "@/components/dialog/UploadFileDialog.vue";
import DeleteFileDialog from "@/components/dialog/DeleteFileDialog.vue";
import { useAssessItemReviewStatus } from "@/utils/useOptions";

const route = useRoute();
const assessReviewStatus = useAssessItemReviewStatus();
const notifyRefresh = inject<() => void>("notifyRefresh");

const props = defineProps<{
    data: any;
}>();

const loading = ref(false);
const moduleData = ref<any>();
// 格式化表格数据
const formatTableData = (projects: any[]) => {
    const rows: any[] = [];
    projects.forEach((project) => {
        project.project_detail &&
            project.project_detail.length > 0 &&
            project.project_detail.forEach((item: any) => {
                item.detail_info &&
                    item.detail_info.length > 0 &&
                    item.detail_info.forEach((file: any, fileIndex: number) => {
                        rows.push({
                            project: {
                                id: project.id,
                                name: project.evaluate_project_name,
                                rowSpan: 0, // 后面填
                            }, // 项目相关数据
                            assess: {
                                id: item.id,
                                name: item.evaluate_detail_name,
                                gist: item.evaluate_points,
                                rowSpan: 0, // 后面填
                            }, // 评估项数据
                            gist: {
                                id: file.id,
                                index: fileIndex + 1,
                                name: file.content,
                                flag: file.flag,
                                status: file.status,
                                fileList: file.fileInfo.map((fileItem: any) => {
                                    return {
                                        name: fileItem.file_name,
                                        fileUrl: fileItem.file_path,
                                    };
                                }),
                                score: file.score,
                            }, // 评估要点数据
                        });
                    });
            });
    });

    // === 处理 project 合并行 ===
    let projectIndex = 0;
    for (const project of projects) {
        if (!project.project_detail || project.project_detail.length === 0) continue;
        const totalFiles = project.project_detail!.reduce(
            (sum: number, item: any) => sum + item.detail_info.length,
            0
        );
        rows[projectIndex].project.rowSpan = totalFiles;
        projectIndex += totalFiles;
    }

    // === 处理 assessItem 合并行 ===
    let idx = 0;
    for (const project of projects) {
        if (!project.project_detail) continue;
        for (const item of project.project_detail!) {
            const len = item.detail_info.length;
            rows[idx]!.assess.rowSpan = len;
            idx += len;
        }
    }
    // 处理最后一个project
    for (let i = rows.length - 1; i >= 0; i--) {
        if (rows[i].project.rowSpan > 0) {
            rows[i].project.isLast = true;
            break; // 找到第一个满足条件的就退出
        }
    }
    // 处理最后一个评估项和要点
    for (let i = rows.length - 1; i >= 0; i--) {
        if (rows[i].assess.rowSpan > 0) {
            rows[i].assess.isLast = true;
            break; // 找到第一个满足条件的就退出
        }
    }
    return rows;
};
watch(
    () => props.data,
    (newVal) => {
        moduleData.value = {
            ...newVal,
            project_info: formatTableData(props.data.project_info),
        };
    },
    { deep: true, immediate: true }
);

const spanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps<any>) => {
    if (columnIndex === 0) {
        // projectName
        return {
            rowspan: row.project.rowSpan,
            colspan: row.project.rowSpan ? 1 : 0,
        };
    }
    if (columnIndex === 1 || columnIndex === 2) {
        // assessName
        return {
            rowspan: row.assess.rowSpan,
            colspan: row.assess.rowSpan ? 1 : 0,
        };
    }

    return { rowspan: 1, colspan: 1 };
};
// 单元格类名函数
const cellClassName = ({ row, column, rowIndex, columnIndex }: any) => {
    if (
        (column.property === "project" && row.project.isLast) ||
        ((column.property === "assessName" || column.property === "assessGist") &&
            row.assess.isLast)
    ) {
        return "no-boder-bottom";
    }
};

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
        content: data.name,
        fileList: data.fileList,
    };
};
const confirmUploadFile = async (data: any) => {
    return assessApi.uploadEvaluateFile({
        content_id: uploadFileDialog.data.id,
        type: 4,
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
    props.data.project_info.some((item: any) =>
        item.project_detail.some((detail: any) =>
            detail.detail_info.some((file: any) => {
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
            })
        )
    );
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
        fileList: data.fileList,
    };
};
const confirmDeleteFile = async () => {
    return assessApi.deleteEvaluateFile({
        content_id: deleteFileDialog.data.id,
        type: 4,
    });
};
// 删除文件成功回调
const handleDeleteSuccess = () => {
    // 更新fileInfo数据
    props.data.project_info.some((item: any) =>
        item.project_detail.some((detail: any) =>
            detail.detail_info.some((file: any) => {
                if (file.id === deleteFileDialog.data.id) {
                    file.fileInfo = [];
                    file.score = 0;
                    file.status = 0;
                    return true; // 找到后立即终止所有循环
                }
                return false;
            })
        )
    );
    notifyRefresh?.();
};
</script>

<template>
    <div v-loading="loading">
        <el-empty v-if="moduleData.project_info.length === 0" description="暂无数据" />
        <template v-else>
            <el-table
                class="assess-project-table"
                :data="moduleData.project_info"
                :span-method="spanMethod"
                :cell-class-name="cellClassName"
                style="width: 100%"
            >
                <el-table-column prop="project" label="项目" align="center" min-width="200">
                    <template #default="{ row }">
                        <span>{{ row.project.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="assessName" label="评估项" align="center" min-width="200">
                    <template #default="{ row }">
                        <span>{{ row.assess.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="assessGist" label="评估要点" align="center" min-width="200">
                    <template #default="{ row }">
                        <span>{{ row.assess.gist }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="序号" align="center" width="60">
                    <template #default="{ row }">
                        <span>{{ row.gist.index }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="实证材料（项）" align="center" min-width="200">
                    <template #default="{ row }">
                        <span>{{ row.gist.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="基础达标项" align="center" width="100">
                    <template #default="{ row }">
                        <div class="flex justify-content-center">
                            <p v-if="row.gist.flag == 1" class="triangle-border"></p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="100">
                    <template #default="{ row }">
                        <span
                            v-if="row.gist.status"
                            :style="[
                                {
                                    color: assessReviewStatus.getColorByValue(row.gist.status),
                                },
                            ]"
                        >
                            {{ assessReviewStatus.getLabelByValue(row.gist.status) }}
                        </span>
                        <span v-else>/</span>
                    </template>
                </el-table-column>
                <el-table-column label="得分" align="center" width="80">
                    <template #default="{ row }">
                        <span v-if="row.gist.score">{{ row.gist.score }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="文件" align="center" width="100">
                    <template #default="{ row }">
                        <div class="file-box">
                            <div class="upload-box" @click="handleUploadFile(row.gist)">
                                <el-icon :size="20">
                                    <UploadFilled />
                                </el-icon>
                                <span>上传</span>
                            </div>
                            <div
                                class="upload-status"
                                v-if="row.gist.fileList && row.gist.fileList.length > 0"
                            >
                                <el-tooltip effect="dark" content="文件已上传" placement="top-end">
                                    <div class="triangle" @click="handleDeleteFile(row.gist)">
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
