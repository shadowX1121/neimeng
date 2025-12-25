<!--活跃度评估的加分项目表格模块-->
<script setup lang="ts">
import { ref, reactive, watch, computed, inject } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
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
watch(
    () => props.data,
    (newVal) => {
        console.log("newVal", newVal);
        moduleData.value = {
            ...newVal,
            list: newVal.list.map((listItem: any) => {
                return {
                    ...listItem,
                    fileList: listItem.fileInfo.map((fileItem: any) => {
                        return {
                            name: fileItem.file_name,
                            fileUrl: fileItem.file_path,
                        };
                    }),
                    scoreStatus: !!listItem.score,
                    updateScoreStatus: false,
                };
            }),
        };
    },
    { deep: true, immediate: true }
);

const viewFileDialog = reactive<{
    visible: boolean;
    data: any;
}>({
    visible: false,
    data: {},
});
const handleViewFile = async (data: any) => {
    const { fileList = [] } = data;
    if (fileList.length > 0) {
        if (fileList.length === 1) {
            const url = fileList[0].fileUrl;
            window.open(`/pdfPreview?url=${url}`, "_blank");
        } else {
            viewFileDialog.data = {
                name: data.content,
                fileList: fileList,
            };
            viewFileDialog.visible = true;
        }
        try {
            const { code } = await assessApi.updateEvaluateDetailStatus({
                type: 1,
                content_id: data.id,
            });
            if (code === 200) {
                data.status = 2;
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
    const oldValue = row.scoreStatus;
    // 1️⃣ 先更新 UI（乐观）
    row.scoreStatus = val;
    row.updateScoreStatus = true;
    try {
        // 2️⃣ 调接口
        const { code } = await assessApi.updateItemScoreControl({
            account_id: orgId.value,
            type: 1,
            content_id: row.id,
            score: val ? 1 : -1,
        });
        if (code === 200) {
            ElMessage.success("操作成功");
            notifyRefresh?.();
            // 通知父组件更新数据
        }
    } catch (e) {
        // 3️⃣ 失败回滚
        row.scoreStatus = oldValue;
    } finally {
        row.updateScoreStatus = false;
    }
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
                        <el-button
                            v-if="row.fileList.length > 0"
                            type="primary"
                            link
                            @click="handleViewFile(row)"
                        >
                            查看
                        </el-button>
                        <el-button v-else disabled link>未传</el-button>
                    </template>
                </el-table-column>
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
                <el-table-column label="批阅" align="center" width="100">
                    <template #default="{ row }">
                        <div class="score-status">
                            <el-checkbox
                                :model-value="row.scoreStatus"
                                v-loading="row.updateScoreStatus"
                                :disabled="row.status !== 2"
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
