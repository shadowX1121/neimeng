<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { userApi } from "@/api/index";
// import { useRoute, useRouter } from "vue-router";
import { useDownloadFilePrepareStatus } from "@/utils/useOptions";
import { useDownloadCountStore } from "@/store/useDownloadCountStore";

// const route = useRoute();
// const router = useRouter();
const filePrepareStatus = useDownloadFilePrepareStatus();
const downloadCountStore = useDownloadCountStore();

// 创建下载任务点击事件
// const createDownloadClick = (event: Event) => {
//     flyTo({
//         from: event.target as HTMLElement,
//     });
// };

// 表格模块
const loading = ref(false);
const tableData = ref<any[]>([]);
// 下载点击事件
const manageClick = (_event: Event, item: any) => {
    const url = item.file_path;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    a.target = "_blank";
    a.click();
};

// 分页模块
const pagination = reactive<MyPagination>({
    current: 1,
    size: 10,
    total: "",
});
const handleSizeChange = (size: number) => {
    pagination.size = size;
    getTableData();
};
const handleCurrentChange = (current: number) => {
    pagination.current = current;
    getTableData();
};

// 获取表格数据
const getTableData = async () => {
    loading.value = true;
    try {
        const { code, data } = await userApi.getDownloadList({
            page: pagination.current,
            page_size: pagination.size,
        });
        if (code === 200) {
            tableData.value = data.data;
            pagination.total = data.total;
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    downloadCountStore.count = 0;
    getTableData();
});
</script>

<template>
    <div class="main-container-wrapper">
        <div class="main-header">
            <p class="title">下载任务列表</p>
        </div>
        <div class="main-content">
            <div class="download-task-list-page">
                <div class="table-filter">
                    <div class="table-filter_select flex-start">
                        <p class="flex flex-align-center">下载任务：{{ pagination.total }} 个</p>
                    </div>
                    <!-- <div class="table-filter_button flex-start">
                        <el-button type="primary" @click="createDownloadClick">
                            创建下载任务
                        </el-button>
                    </div> -->
                </div>
                <el-empty v-if="pagination.total === 0" description="暂无下载任务" />
                <template v-else>
                    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
                        <el-table-column prop="created_at" label="创建任务时间" width="180" />
                        <el-table-column prop="source" label="下载文件来源" min-width="200" />
                        <el-table-column prop="content" label="文件内容" min-width="200" />
                        <el-table-column label="数据准备" width="140">
                            <template #default="{ row }">
                                <span
                                    :style="[
                                        {
                                            color: filePrepareStatus.getColorByValue(row.status),
                                        },
                                    ]"
                                >
                                    {{ filePrepareStatus.getLabelByValue(row.status) }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="80">
                            <template #default="{ row }">
                                <el-button
                                    v-if="row.status == 1"
                                    type="primary"
                                    link
                                    @click="(event: Event) => manageClick(event, row)"
                                >
                                    下载
                                </el-button>
                                <el-button v-else disabled link>下载</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        v-if="pagination.total"
                        class="my-pagination"
                        v-model:current-page="pagination.current"
                        v-model:page-size="pagination.size"
                        :page-sizes="[10, 20, 30, 40]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pagination.total"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
