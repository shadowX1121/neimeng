<!--活跃度评估的基础表格模块-->
<script setup lang="ts">
import { ref, reactive, computed, watch, inject } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { assessApi } from "@/api/index";
import CheckFileDialog from "@/components/dialog/CheckFileDialog.vue";
import { useAssessItemReviewStatus } from "@/utils/useOptions";

const route = useRoute();
const assessReviewStatus = useAssessItemReviewStatus();
const notifyRefresh = inject<() => void>("notifyRefresh");

const orgId = computed(() => route.params.orgId);
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
                                scoreStatus: !!file.score,
                                updateScoreStatus: false,
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

const spanMethod = ({ row, columnIndex }: SpanMethodProps<any>) => {
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
const cellClassName = ({ row, column }: any) => {
    if (
        (column.property === "project" && row.project.isLast) ||
        ((column.property === "assessName" || column.property === "assessGist") &&
            row.assess.isLast)
    ) {
        return "no-boder-bottom";
    }
};

const viewFileDialog = reactive<{
    visible: boolean;
    data: any;
}>({
    visible: false,
    data: {},
});
// 查看文件点击事件
const handleViewFile = async (data: any) => {
    const { gist } = data;
    if (gist && gist.fileList && gist.fileList.length > 0) {
        if (gist.fileList.length === 1) {
            const url = gist.fileList[0].fileUrl;
            window.open(`/pdfPreview?url=${url}`, "_blank");
        } else {
            viewFileDialog.data = gist;
            viewFileDialog.visible = true;
        }
        try {
            const { code } = await assessApi.updateEvaluateDetailStatus({
                type: 4,
                content_id: gist.id,
            });
            if (code === 200) {
                data.gist.status = 2;
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        console.error("未找到文件");
    }
};
// 得分状态变化事件
const scoreStatusChange = async (val: boolean, row: any) => {
    const oldValue = row.gist.scoreStatus;
    // 1️⃣ 先更新 UI（乐观）
    row.gist.scoreStatus = val;
    row.gist.updateScoreStatus = true;
    try {
        // 2️⃣ 调接口
        const { code } = await assessApi.updateItemScoreControl({
            account_id: orgId.value,
            type: 4,
            content_id: row.gist.id,
            score: val ? 1 : -1,
        });
        if (code === 200) {
            ElMessage.success("操作成功");
            notifyRefresh?.();
            // 通知父组件更新数据
        }
    } catch (e) {
        // 3️⃣ 失败回滚
        row.gist.scoreStatus = oldValue;
    } finally {
        row.gist.updateScoreStatus = false;
    }
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
                <el-table-column label="文件" align="center" width="80">
                    <template #default="{ row }">
                        <el-button
                            v-if="row.gist.fileList.length > 0"
                            type="primary"
                            link
                            @click="handleViewFile(row)"
                        >
                            查看
                        </el-button>
                        <el-button v-else disabled link>未传</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="80">
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
                <el-table-column label="批阅" align="center" width="100">
                    <template #default="{ row }">
                        <div class="score-status">
                            <el-checkbox
                                :model-value="row.gist.scoreStatus"
                                v-loading="row.gist.updateScoreStatus"
                                :disabled="row.gist.status !== 2"
                                @change="(val: boolean) => scoreStatusChange(val, row)"
                            >
                                得分
                            </el-checkbox>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <!--查看文件弹窗-->
        <CheckFileDialog v-model="viewFileDialog.visible" :data="viewFileDialog.data" />
    </div>
</template>

<style lang="scss" scoped>
.score-status {
    display: flex;
    justify-content: center;
    :deep(.el-checkbox__label) {
        padding-left: 4px;
    }
    :deep(.el-checkbox__input) {
        &.is-checked {
            + .el-checkbox__label {
                color: #000000;
            }
        }
    }
    :deep(.el-loading-spinner) {
        svg {
            width: 20px;
        }
    }
}
</style>
