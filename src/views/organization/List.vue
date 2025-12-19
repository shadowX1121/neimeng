<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { mockApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { Plus, Search, ArrowRight } from "@element-plus/icons-vue";
import { useAccountStatus } from "@/utils/useOptions";
import { useRoute, useRouter } from "vue-router";
import { useMetaTitleStore } from "@/store/useMetaTitleStore";
import { YEAR_OPTIONS } from "@/constants/index";

const accountStatus = useAccountStatus();
const route = useRoute();
const router = useRouter();
const metaTitleStore = useMetaTitleStore();

// 筛选模块
const goAddPage = () => {
    router.push({
        name: "AddAccount",
    });
};
const filter = reactive({
    year: "",
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
const statusOptions = ref([
    { value: "0", label: "待审核" },
    { value: "1", label: "审核通过" },
    { value: "2", label: "审核未通过" },
]);
const accountStatusOptions = accountStatus.options.value.filter((item) => item.value !== 4);

// 表格模块
const loading = ref(false);
const tableData = ref<any[]>([]);
// 评估tag点击事件
const pinguTagClick = (tag: any) => {
    ElMessage.success(`点击了标签：${tag}`);
};
// 修改tag点击事件
const xiugaiTagClick = (tag: any) => {
    ElMessage.success(`点击了标签：${tag}`);
};
// 管理点击事件
const manageClick = (item: any) => {
    window.open(`/admin/orgManage/${item.id}/home`, "_blank");
    // metaTitleStore.urlMapTitle = {
    //     ...metaTitleStore.urlMapTitle,
    //     "/organization/list/detail": item.name,
    // };

    // router.push({
    //     name: "OrgDetail",
    //     query: {
    //         id: item.id,
    //     },
    // });
    // ElMessage.success(`点击了管理按钮：${item.id}`);
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
        const { code } = await mockApi.mock(
            {
                ...filter,
                page: pagination.current,
                size: pagination.size,
            },
            null
        );
        if (code === 200) {
            tableData.value = [
                {
                    id: 1,
                    name: "内蒙古自治区老年人体育协会",
                    score: "50",
                    level: 2,
                    pinguAudit: "1",
                    xiugaiAudit: "1",
                    accountStatus: 1,
                },
                {
                    id: 2,
                    name: "内蒙古自治区老年人体育协会1",
                    score: "50",
                    level: 0,
                    pinguAudit: "1",
                    xiugaiAudit: "1",
                    accountStatus: 2,
                },
                {
                    id: 2,
                    name: "内蒙古自治区老年人体育协会2",
                    score: "50",
                    level: 0,
                    pinguAudit: "1",
                    xiugaiAudit: "1",
                    accountStatus: 3,
                },
            ];
            pagination.total = 3;
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
                        <el-select
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
                        </el-select>
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
                            class="w220"
                            v-model="filter.search"
                            size="default"
                            placeholder="请输入体育社会组织名称"
                            :suffix-icon="Search"
                        />
                    </div>
                </div>
                <el-empty v-if="pagination.total === 0" description="暂无体育社会组织" />
                <template v-else>
                    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
                        <el-table-column prop="name" label="体育社会组织名称" min-width="200" />
                        <el-table-column prop="score" label="年度积分" width="140" />
                        <el-table-column label="星级" width="140">
                            <template #default="scope">
                                <el-rate
                                    v-if="scope.row.level"
                                    v-model="scope.row.level"
                                    :disabled="true"
                                    :max="scope.row.level"
                                />
                                <span v-else style="color: #666666">取消评星资格</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="评估审核" width="140">
                            <template #default="scope">
                                <el-tag
                                    class="cursor-pointer"
                                    type="danger"
                                    effect="dark"
                                    round
                                    @click="pinguTagClick(scope.row.pinguAudit)"
                                >
                                    <span>{{ scope.row.pinguAudit }}条</span>
                                    <el-icon><ArrowRight /></el-icon>
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="修改审核" width="140">
                            <template #default="scope">
                                <el-tag
                                    class="cursor-pointer"
                                    type="danger"
                                    effect="dark"
                                    round
                                    @click="xiugaiTagClick(scope.row.xiugaiAudit)"
                                >
                                    <span>{{ scope.row.xiugaiAudit }}条</span>
                                    <el-icon><ArrowRight /></el-icon>
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="账号状态" width="140">
                            <template #default="scope">
                                <div class="account-status">
                                    <div
                                        class="dot"
                                        :style="{
                                            backgroundColor: accountStatus.getColorByValue(
                                                scope.row.accountStatus
                                            ),
                                        }"
                                    ></div>
                                    <span
                                        :style="{
                                            color:
                                                scope.row.accountStatus === 3
                                                    ? accountStatus.getColorByValue(
                                                          scope.row.accountStatus
                                                      )
                                                    : '',
                                        }"
                                    >
                                        {{ accountStatus.getLabelByValue(scope.row.accountStatus) }}
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
