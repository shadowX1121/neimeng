<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { mockApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { YEAR_OPTIONS } from "@/constants/index";
import AddProjectDialog from "./dialog/AddProjectDialog.vue";
import EditProjectDialog from "./dialog/EditProjectDialog.vue";
import DeleteAssessGistDialog from "./dialog/DeleteAssessGistDialog.vue";
import { formatProjectData } from "@/utils/common";
import { useAssessStore } from "@/store/useAssessStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const assessStore = useAssessStore();

const filter = reactive({
    year: "",
});
const yearOptions = ref(YEAR_OPTIONS);

const manageProjectDialogVisible = ref(false);
// 管理项目点击事件
const manageProjectClick = () => {
    manageProjectDialogVisible.value = true;
};
const addProjectDialogVisible = ref(false);
// 添加项目点击事件
const addProjectClick = () => {
    addProjectDialogVisible.value = true;
};

// 表格模块
const { isLoading: loading, assessData: classifyData } =
    storeToRefs(assessStore);
const spanMethod = ({
    row,
    column,
    rowIndex,
    columnIndex,
}: SpanMethodProps<AssessProjectStructType>) => {
    if (columnIndex === 0) {
        // projectName
        return {
            rowspan: row.projectRowSpan,
            colspan: row.projectRowSpan ? 1 : 0,
        };
    }

    if (columnIndex === 1) {
        // assessName
        return {
            rowspan: row.assessRowSpan,
            colspan: row.assessRowSpan ? 1 : 0,
        };
    }

    return { rowspan: 1, colspan: 1 };
};

// 获取表格数据
const getTableData = async () => {
    await assessStore.fetchData(true);
};
onMounted(() => {
    getTableData();
});

// 修改评估项点击事件
const editAssessItemClick = (row: any) => {
    router.push({
        name: "AssessBaseItemAdd",
        query: {
            id: row.assessId,
        },
    });
};

// 删除评估要点弹窗显示控制
const deleteGistDialogVisible = ref(false);
// 要删除的评估要点数据
const deleteGistData = ref<any>({});
// 删除评估要点点击事件
const deleteAssessGistClick = (row: any) => {
    console.log("row", row);
    deleteGistData.value = row;
    deleteGistDialogVisible.value = true;
};
// 删除评估要点后的回调函数、
const deleteAssessGistCallback = () => {
    getTableData();
};
</script>

<template>
    <div class="main-container-wrapper">
        <div class="main-header">
            <p class="title">评估项管理</p>
        </div>
        <div class="main-content">
            <div class="assess-base-item-list-page">
                <div class="table-filter">
                    <div class="table-filter_select flex-start">
                        <el-select
                            class="w108"
                            v-model="filter.year"
                            placeholder="选择年份"
                            @change="getTableData"
                        >
                            <el-option
                                v-for="item in yearOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </div>
                    <div class="table-filter_button flex-start">
                        <el-button @click="manageProjectClick">
                            管理项目
                        </el-button>
                        <el-button type="primary" @click="addProjectClick">
                            添加项目
                        </el-button>
                    </div>
                </div>
                <el-tabs
                    v-if="classifyData.length > 0"
                    class="assess-tabs"
                    addable
                    type="border-card"
                >
                    <template #add-icon>
                        <el-button
                            type="primary"
                            plain
                            @click="router.push({ name: 'AssessBaseItemAdd' })"
                        >
                            添加评估项
                        </el-button>
                    </template>
                    <el-tab-pane
                        v-for="classifyItem in classifyData"
                        :key="classifyItem.id"
                        :label="classifyItem.name"
                    >
                        <el-empty
                            v-if="classifyItem.project.length === 0"
                            description="暂无数据"
                        />
                        <template v-else>
                            <el-table
                                class="assess-project-table"
                                v-loading="loading"
                                :data="formatProjectData(classifyItem.project)"
                                border
                                :span-method="spanMethod"
                                style="width: 100%"
                            >
                                <el-table-column
                                    prop="projectName"
                                    label="项目"
                                    align="center"
                                    min-width="200"
                                />
                                <el-table-column
                                    prop="assessName"
                                    label="评估项"
                                    align="center"
                                    min-width="200"
                                />
                                <el-table-column
                                    prop="gistIndex"
                                    label="序号"
                                    align="center"
                                    width="60"
                                />
                                <el-table-column
                                    prop="gist"
                                    label="评估要点"
                                    align="center"
                                    min-width="200"
                                />
                                <el-table-column
                                    prop="fileName"
                                    label="实证材料（项）"
                                    align="center"
                                    min-width="200"
                                />
                                <el-table-column label="基础达标项" width="100">
                                    <template #default="{ row }">
                                        <div
                                            class="flex justify-content-center"
                                        >
                                            <p
                                                v-if="row.isBase"
                                                class="triangle-border"
                                            ></p>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    align="center"
                                    width="140"
                                >
                                    <template #default="{ row }">
                                        <el-button
                                            type="primary"
                                            link
                                            @click="editAssessItemClick(row)"
                                        >
                                            修改
                                        </el-button>
                                        <el-button
                                            type="danger"
                                            link
                                            @click="deleteAssessGistClick(row)"
                                        >
                                            删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <!--添加项目弹窗-->
        <AddProjectDialog v-model="addProjectDialogVisible" />
        <!--编辑项目弹窗-->
        <EditProjectDialog v-model="manageProjectDialogVisible" />
        <!--删除项目弹窗-->
        <DeleteAssessGistDialog
            v-model="deleteGistDialogVisible"
            :data="deleteGistData"
            @confirm="deleteAssessGistCallback"
        />
    </div>
</template>

<style lang="scss" scoped>
.assess-base-item-list-page {
    :deep(.el-tabs__new-tab) {
        margin: 0 24px 0 24px;
        width: auto;
    }
    :deep(.el-tabs__content) {
        padding: 0;
    }
}
</style>
