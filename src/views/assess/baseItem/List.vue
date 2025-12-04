<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { mockApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { Plus, Search, ArrowRight } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { YEAR_OPTIONS } from "@/constants/index";
import AddProjectDialog from "./dialog/AddProjectDialog.vue";
import EditProjectDialog from "./dialog/EditProjectDialog.vue";

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
const tableData = ref<any[]>([]);

// 获取表格数据
const getTableData = async () => {
    loading.value = true;
    try {
        const { code } = await mockApi.mock(
            {
                ...filter,
            },
            null
        );
        if (code === 200) {
            tableData.value = [];
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
                <!-- <el-empty
                    description="暂无体育社会组织"
                /> -->
                <!-- <el-tabs type="border-card">
                    <el-tab-pane label="User">User</el-tab-pane>
                    <el-tab-pane label="Config">Config</el-tab-pane>
                    <el-tab-pane label="Role">Role</el-tab-pane>
                    <el-tab-pane label="Task">Task</el-tab-pane>
                </el-tabs> -->
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
}
</style>
