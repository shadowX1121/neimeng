<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { institutionApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { Plus, Search, ArrowRight } from "@element-plus/icons-vue";
import { useAccountStatus } from "@/utils/useOptions";
import { useRouter } from "vue-router";
import { YEAR_OPTIONS, CURRENT_YEAR } from "@/constants/index";

const accountStatus = useAccountStatus();
const router = useRouter();

// 筛选模块
const goAddPage = () => {
    router.push({
        name: "AddAccount",
    });
};
const filter = reactive({
    year: CURRENT_YEAR,
    level: "",
    status: "",
    accountStatus: "",
    search: "",
});
const yearOptions = ref(YEAR_OPTIONS);
const levelOptions = ref([
    { value: "0", label: "全部星级" },
    { value: "1", label: "一星" },
    { value: "2", label: "二星" },
    { value: "3", label: "三星" },
    { value: "4", label: "无星级" },
]);
// const statusOptions = ref([
//     { value: "0", label: "待审核" },
//     { value: "1", label: "审核通过" },
//     { value: "2", label: "审核未通过" },
// ]);
const accountStatusOptions = accountStatus.options.value.filter((item) => item.value !== 4);

// 表格模块
const loading = ref(false);
const tableData = ref<any[]>([]);
// 评估tag点击事件
const evaluateTagClick = (item: any) => {
    window.open(`/admin/orgManage/${item.id}/liveness?year=${filter.year}`, "_blank");
};
// 修改tag点击事件
const reviewTagClick = (tag: any) => {
    ElMessage.success(`点击了标签：${tag}`);
};
// 管理点击事件
const manageClick = (item: any) => {
    window.open(`/admin/orgManage/${item.id}/home`, "_blank");
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
        const { code, data } = await institutionApi.getList({
            start: (pagination.current - 1) * pagination.size,
            count: pagination.size,
            account_status: filter.accountStatus,
            year: filter.year,
            star: filter.level,
            serach: filter.search,
        });
        if (code === 200) {
            const { institutions, total } = data;
            tableData.value = institutions;
            pagination.total = total;
        }
    } catch (error) {
        console.error(error);
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
            <p class="title">体育社会组织列表</p>
            <p class="des">体育社会组织：{{ pagination.total }}个</p>
        </div>
        <div class="main-content">
            <div class="org-list-page">
                <div class="table-filter">
                    <div class="table-filter_button">
                        <el-button :icon="Plus" type="primary" @click="goAddPage">
                            添加账号
                        </el-button>
                    </div>
                    <div class="table-filter_select">
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
                        <el-select
                            class="w108"
                            v-model="filter.level"
                            clearable
                            placeholder="选择星级"
                            @change="getTableData"
                        >
                            <el-option
                                v-for="item in levelOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                        <!-- <el-select
                            class="w108"
                            v-model="filter.status"
                            clearable
                            placeholder="审核状态"
                            @change="getTableData"
                        >
                            <el-option
                                v-for="item in statusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select> -->
                        <el-select
                            class="w108"
                            v-model="filter.accountStatus"
                            placeholder="账号状态"
                            @change="getTableData"
                        >
                            <el-option
                                v-for="item in accountStatusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                        <el-input
                            class="w300"
                            v-model.trim="filter.search"
                            clearable
                            size="default"
                            placeholder="请输入体育社会组织名称"
                            @clear="getTableData"
                            @keyup.enter="getTableData"
                        >
                            <template #append>
                                <el-button @click="getTableData" :icon="Search" />
                            </template>
                        </el-input>
                    </div>
                </div>
                <el-empty v-if="pagination.total === 0" description="暂无体育社会组织" />
                <template v-else>
                    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
                        <el-table-column prop="name" label="体育社会组织名称" min-width="200" />
                        <el-table-column prop="score" label="年度积分" width="140" />
                        <el-table-column label="星级" width="140">
                            <template #default="{ row }">
                                <el-rate
                                    v-if="row.star"
                                    v-model="row.star"
                                    disabled
                                    :max="row.star"
                                />
                                <span v-else style="color: #666666">取消评星资格</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="评估审核" width="140">
                            <template #default="{ row }">
                                <el-tag
                                    v-if="row.evaluate_count"
                                    class="cursor-pointer"
                                    type="danger"
                                    effect="dark"
                                    round
                                    @click="evaluateTagClick(row)"
                                >
                                    <span>{{ row.evaluate_count }}条</span>
                                    <el-icon><ArrowRight /></el-icon>
                                </el-tag>
                                <span v-else>/</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="修改审核" width="140">
                            <template #default="{ row }">
                                <el-tag
                                    v-if="row.update_review_count"
                                    class="cursor-pointer"
                                    type="danger"
                                    effect="dark"
                                    round
                                    @click="reviewTagClick(row.update_review_count)"
                                >
                                    <span>{{ row.update_review_count }}条</span>
                                    <el-icon><ArrowRight /></el-icon>
                                </el-tag>
                                <span v-else>/</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="账号状态" width="140">
                            <template #default="{ row }">
                                <div class="account-status">
                                    <div
                                        class="dot"
                                        :style="{
                                            backgroundColor: accountStatus.getColorByValue(
                                                row.account_status
                                            ),
                                        }"
                                    ></div>
                                    <span
                                        :style="{
                                            color:
                                                row.account_status === 3
                                                    ? accountStatus.getColorByValue(
                                                          row.account_status
                                                      )
                                                    : '',
                                        }"
                                    >
                                        {{ accountStatus.getLabelByValue(row.account_status) }}
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="80">
                            <template #default="scope">
                                <el-button type="primary" link @click="manageClick(scope.row)">
                                    管理
                                </el-button>
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

<style lang="scss" scoped>
.org-list-page {
    .account-status {
        display: flex;
        align-items: center;
        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 6px;
        }
    }
}
</style>
