<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mockApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { CaretBottom } from "@element-plus/icons-vue";
import { YEAR_OPTIONS, CURRENT_YEAR } from "@/constants/index";
import CreateDownLoadDialog from "./dialog/CreateDownLoadDialog.vue";

const router = useRouter();
const route = useRoute();

const id = computed(() => route.query.id);

const year = ref(CURRENT_YEAR);
const yearOptions = ref(YEAR_OPTIONS);
// 年份切换事件
const yearChange = (command: any) => {
    if (year.value != command) {
        year.value = command;
        console.log("command", command);
    }
};

// 表格模块
const loading = ref(false);
const detailData = reactive<any>({});
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

const mockData = [
    {
        id: "1",
        name: "组织建设",
        assessItem: [
            {
                id: "1-1",
                name: "组织体系健全",
                gist: "党支部设立程序规范，支委会配备齐全、分工明确，按期换届。",
                gistItem: [
                    {
                        id: "1-1-1",
                        name: "上级党组织关于成立党支部的批复文件。",
                        fileUrl: "/1-1-1.pdf",
                        isBase: true,
                        fileList: [
                            {
                                url: "/1-1-1.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件.pdf",
                            },
                            {
                                url: "/1-1-2.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件1.pdf",
                            },
                        ],
                        status: 2,
                        scoreStatus: 1,
                    },
                    {
                        id: "1-1-2",
                        name: "上级党组织关于成立党支部的批复文件1。",
                        fileUrl: "/1-1-2.pdf",
                        isBase: false,
                        fileList: [
                            {
                                url: "/1-1-1.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件.pdf",
                            },
                            {
                                url: "/1-1-2.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件1.pdf",
                            },
                        ],
                        status: 2,
                        scoreStatus: 0,
                    },
                    {
                        id: "1-1-3",
                        name: "上级党组织关于成立党支部的批复文件3。",
                        fileUrl: "/1-1-3.pdf",
                        isBase: true,
                        fileList: [],
                        status: 0,
                        scoreStatus: 0,
                    },
                    {
                        id: "1-1-4",
                        name: "上级党组织关于成立党支部的批复文件4。",
                        fileUrl: "/1-1-4.pdf",
                        isBase: false,
                        fileList: [
                            {
                                url: "/1-1-1.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件.pdf",
                            },
                            {
                                url: "/1-1-2.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件1.pdf",
                            },
                        ],
                        status: 1,
                        scoreStatus: 0,
                    },
                ],
            },
            {
                id: "1-2",
                name: "组织体系健全2",
                gist: "党支部设立程序规范，支委会配备齐全、分工明确，按期换届2。",
                gistItem: [
                    {
                        id: "1-2-1",
                        name: "上级党组织关于成立党支部2的批复文件。",
                        fileUrl: "/1-2-1.pdf",
                        isBase: true,
                        fileList: [
                            {
                                url: "/1-2-1.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件.pdf",
                            },
                            {
                                url: "/1-1-2.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件1.pdf",
                            },
                        ],
                        status: 2,
                        scoreStatus: 1,
                    },
                ],
            },
        ],
    },
    {
        id: "2",
        name: "组织建设2",
        assessItem: [
            {
                id: "2-1",
                name: "组织体系健全",
                gist: "党支部设立程序规范，支委会配备齐全、分工明确，按期换届2。",
                gistItem: [
                    {
                        id: "2-1-1",
                        name: "上级党组织关于成立党支部的批复文件。",
                        fileUrl: "/1-1-1.pdf",
                        isBase: true,
                        fileList: [
                            {
                                url: "/1-1-1.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件.pdf",
                            },
                            {
                                url: "/1-1-2.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件1.pdf",
                            },
                        ],
                        status: 2,
                        scoreStatus: 1,
                    },
                    {
                        id: "2-1-2",
                        name: "上级党组织关于成立党支部的批复文件1。",
                        fileUrl: "/1-1-2.pdf",
                        isBase: false,
                        fileList: [
                            {
                                url: "/1-1-1.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件.pdf",
                            },
                            {
                                url: "/1-1-2.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件1.pdf",
                            },
                        ],
                        status: 2,
                        scoreStatus: 0,
                    },
                    {
                        id: "1-1-3",
                        name: "上级党组织关于成立党支部的批复文件3。",
                        fileUrl: "/1-1-3.pdf",
                        isBase: true,
                        fileList: [],
                        status: 0,
                        scoreStatus: 0,
                    },
                    {
                        id: "1-1-4",
                        name: "上级党组织关于成立党支部的批复文件4。",
                        fileUrl: "/1-1-4.pdf",
                        isBase: false,
                        fileList: [
                            {
                                url: "/1-1-1.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件.pdf",
                            },
                            {
                                url: "/1-1-2.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件1.pdf",
                            },
                        ],
                        status: 1,
                        scoreStatus: 0,
                    },
                ],
            },
            {
                id: "2-2",
                name: "组织体系健全2",
                gist: "党支部设立程序规范，支委会配备齐全、分工明确，按期换届2。",
                gistItem: [
                    {
                        id: "1-2-1",
                        name: "上级党组织关于成立党支部2的批复文件。",
                        fileUrl: "/1-2-1.pdf",
                        isBase: true,
                        fileList: [
                            {
                                url: "/1-2-1.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件.pdf",
                            },
                            {
                                url: "/1-1-2.pdf",
                                fileName: "上级党组织关于成立党支部的批复文件1.pdf",
                            },
                        ],
                        status: 2,
                        scoreStatus: 1,
                    },
                ],
            },
        ],
    },
];
// 格式化表格数据
const formatTableData = (data: any[]) => {
    const rows: any[] = [];
    data.forEach((project) => {
        project.assessItem &&
            project.assessItem.length > 0 &&
            project.assessItem.forEach((item: any) => {
                item.gistItem &&
                    item.gistItem.length > 0 &&
                    item.gistItem.forEach((gistItem: any, gistIndex: number) => {
                        rows.push({
                            project: {
                                id: project.id,
                                name: project.name,
                                rowSpan: 0, // 后面填
                            }, // 项目相关数据
                            assess: {
                                id: item.id,
                                name: item.name,
                                gist: item.gist,
                                rowSpan: 0, // 后面填
                            }, // 评估项数据
                            gist: {
                                id: gistItem.id,
                                index: gistIndex + 1,
                                name: gistItem.name,
                                isBase: gistItem.isBase,
                                fileUrl: gistItem.fileUrl,
                                fileList: gistItem.fileList,
                                status: gistItem.status,
                                scoreStatus: gistItem.scoreStatus,
                            }, // 评估要点数据
                        });
                    });
            });
    });
    // === 处理 project 合并行 ===
    let projectIndex = 0;
    for (const project of data) {
        if (!project.assessItem) continue;
        const totalFiles = project.assessItem!.reduce(
            (sum: number, item: any) => sum + item.gistItem.length,
            0
        );
        rows[projectIndex]!.project.rowSpan = totalFiles;
        projectIndex += totalFiles;
    }
    // === 处理 assessItem 合并行 ===
    let idx = 0;
    for (const project of data) {
        if (!project.assessItem) continue;
        for (const item of project.assessItem!) {
            const len = item.gistItem.length;
            rows[idx]!.assess.rowSpan = len;
            idx += len;
        }
    }
    return rows;
};
// 获取详情
const getDetail = async () => {
    loading.value = true;
    try {
        const { code } = await mockApi.mock(
            {
                id: id,
            },
            null
        );
        if (code === 200) {
            ElMessage.success(`请求成功`);
            detailData.id = id;
            detailData.name = "张三";
            detailData.score = 80;
            detailData.level = 3;
            detailData.uploadFile = 37;
            detailData.classify = [
                {
                    id: 1,
                    name: "党的建设",
                    score: 8,
                    projectData: formatTableData(mockData),
                },
            ];
        }
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    if (id.value) {
        getDetail();
    }
});

const downloadFileDialog = reactive<{
    visible: boolean;
    data: any;
}>({
    visible: false,
    data: {},
});
// 下载文件点击事件
const downloadClick = () => {
    downloadFileDialog.visible = true;
    // 将当前激活tab项的列表数据传给弹窗
    downloadFileDialog.data = {
        id: 1,
        projectData: mockData,
    };
};
</script>

<template>
    <div class="org-detail-liveness-module" v-loading="loading">
        <div class="liveness-header">
            <div class="item">
                <el-dropdown class="my-year-dropdown" trigger="click" @command="yearChange">
                    <span class="el-dropdown-link">
                        {{ year }}年
                        <el-icon><CaretBottom /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item
                                v-for="item in yearOptions"
                                :key="item.value"
                                :command="item.value"
                            >
                                {{ item.label }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="item">
                <span>年度积分：</span>
                <span class="score">{{ detailData.score }}</span>
            </div>
            <div class="item">
                <span>星级：</span>
                <el-rate
                    v-if="detailData.level"
                    v-model="detailData.level"
                    :disabled="true"
                    :max="detailData.level"
                />
                <span v-else>取消评星资格</span>
            </div>
            <div class="item">
                <p>上传材料：{{ detailData.uploadFile }}项</p>
            </div>
        </div>
        <el-tabs
            v-if="detailData.classify && detailData.classify.length > 0"
            class="assess-tabs"
            addable
            type="border-card"
        >
            <template #add-icon>
                <el-button type="primary" @click="downloadClick">下载文件</el-button>
            </template>
            <el-tab-pane
                v-for="classifyItem in detailData.classify"
                :key="classifyItem.id"
                :label="`${classifyItem.name} (${classifyItem.score}分)`"
            >
                <el-empty v-if="classifyItem.projectData.length === 0" description="暂无数据" />
                <template v-else>
                    <el-table
                        class="assess-project-table"
                        v-loading="loading"
                        :data="classifyItem.projectData"
                        border
                        :span-method="spanMethod"
                        style="width: 100%"
                    >
                        <el-table-column label="项目" align="center" min-width="200">
                            <template #default="{ row }">
                                <span>{{ row.project.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="评估项" align="center" min-width="200">
                            <template #default="{ row }">
                                <span>{{ row.assess.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="评估要点" align="center" min-width="200">
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
                        <el-table-column label="基础达标项" width="100">
                            <template #default="{ row }">
                                <div class="flex justify-content-center">
                                    <p v-if="row.isBase" class="triangle-border"></p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="文件" align="center" width="100">
                            <template #default="{ row }">
                                <el-button type="primary" link @click="">查看</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="center" width="100">
                            <template #default="{ row }">
                                <span>{{ row.gist.status }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="批阅" align="center" width="100">
                            <template #default="{ row }">
                                <span>{{ row.gist.scoreStatus }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-tab-pane>
        </el-tabs>
        <!--创建下载任务弹窗-->
        <CreateDownLoadDialog
            v-model="downloadFileDialog.visible"
            :data="downloadFileDialog.data"
        />
    </div>
</template>

<style lang="scss" scoped>
.org-detail-liveness-module {
    .liveness-header {
        display: flex;
        align-items: center;
        height: 60px;
        margin: 24px 0;
        .item {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 28px;
            width: 25%;
            border-right: 1px solid #ebeef5;
            box-sizing: border-box;
            font-family: PingFang SC, PingFang SC;
            &:nth-last-child(1) {
                border-right: none;
            }
        }
    }
    :deep(.el-tabs__new-tab) {
        margin: 0 24px 0 24px;
        width: auto;
    }
    :deep(.el-tabs__content) {
        padding: 0;
    }
}
</style>
