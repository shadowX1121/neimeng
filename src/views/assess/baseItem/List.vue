<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { mockApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { YEAR_OPTIONS } from "@/constants/index";
import AddProjectDialog from "./dialog/AddProjectDialog.vue";
import EditProjectDialog from "./dialog/EditProjectDialog.vue";
import { formatProjectData } from "@/utils/common";

const router = useRouter();

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
const loading = ref(false);
const classifyData = ref<AssessClassifyType[]>([]);
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
    if (loading.value) return;
    loading.value = true;
    try {
        const { code } = await mockApi.mock({ ...filter }, null);
        if (code === 200) {
            ElMessage.success(`项目分类请求成功`);
            classifyData.value = [
                {
                    id: "account",
                    name: "党的建设",
                    project: [
                        {
                            id: 1,
                            name: "组织建设",
                            assessItem: [
                                {
                                    id: 1,
                                    name: "组织体系健全",
                                    gist: "党支部设立程序规范，支委会配备齐全、分工明确，按期换届。",
                                    file: [
                                        {
                                            id: 1,
                                            name: "上级党组织关于成立党支部的批复文件。",
                                            fileUrl: "",
                                            isBase: true,
                                        },
                                        {
                                            id: 2,
                                            name: "上级党组织关于成立党支部的批复文件1。",
                                            fileUrl: "",
                                            isBase: false,
                                        },
                                        {
                                            id: 3,
                                            name: "上级党组织关于成立党支部的批复文件2。",
                                            fileUrl: "",
                                            isBase: true,
                                        },
                                    ],
                                },
                                {
                                    id: 2,
                                    name: "制度根基牢固",
                                    gist: "党建入章程落实到位，基本工作制度健全，支部书记参与决策机制有效运行。",
                                    file: [
                                        {
                                            id: 1,
                                            name: "上级党组织关于成立党支部的批复文件。",
                                            fileUrl: "",
                                            isBase: true,
                                        },
                                        {
                                            id: 2,
                                            name: "上级党组织关于成立党支部的批复文件1。",
                                            fileUrl: "",
                                            isBase: false,
                                        },
                                        {
                                            id: 3,
                                            name: "上级党组织关于成立党支部的批复文件2。",
                                            fileUrl: "",
                                            isBase: true,
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 2,
                            name: "组织建设2",
                            assessItem: [
                                {
                                    id: 1,
                                    name: "组织体系健全",
                                    gist: "党支部设立程序规范，支委会配备齐全、分工明确，按期换届。",
                                    file: [
                                        {
                                            id: 1,
                                            name: "上级党组织关于成立党支部的批复文件。",
                                            fileUrl: "",
                                            isBase: true,
                                        },
                                        {
                                            id: 2,
                                            name: "上级党组织关于成立党支部的批复文件1。",
                                            fileUrl: "",
                                            isBase: false,
                                        },
                                        {
                                            id: 3,
                                            name: "上级党组织关于成立党支部的批复文件2。",
                                            fileUrl: "",
                                            isBase: true,
                                        },
                                    ],
                                },
                                {
                                    id: 2,
                                    name: "制度根基牢固",
                                    gist: "党建入章程落实到位，基本工作制度健全，支部书记参与决策机制有效运行。",
                                    file: [
                                        {
                                            id: 1,
                                            name: "上级党组织关于成立党支部的批复文件。",
                                            fileUrl: "",
                                            isBase: true,
                                        },
                                        {
                                            id: 2,
                                            name: "上级党组织关于成立党支部的批复文件1。",
                                            fileUrl: "",
                                            isBase: false,
                                        },
                                        {
                                            id: 3,
                                            name: "上级党组织关于成立党支部的批复文件2。",
                                            fileUrl: "",
                                            isBase: true,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                { id: "organization", name: "日常管理", project: [] },
                { id: "assess", name: "保障工作任务要求", project: [] },
            ];
        }
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    getTableData();
});
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
                                <el-table-column
                                    prop="isBase"
                                    label="基础达标项"
                                    align="center"
                                    min-width="200"
                                />
                                <el-table-column
                                    label="操作"
                                    align="center"
                                    width="140"
                                >
                                    <template #default="_scope">
                                        <el-button
                                            type="primary"
                                            link
                                            @click=""
                                        >
                                            修改
                                        </el-button>
                                        <el-button type="danger" link @click="">
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
