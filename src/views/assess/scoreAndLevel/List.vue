<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { mockApi } from "@/api/index";
import { YEAR_OPTIONS, CURRENT_YEAR } from "@/constants/index";
import EditItemDialog from "./dialog/EditItemDialog.vue";
import { ElMessage } from "element-plus";

const filter = reactive({
    year: CURRENT_YEAR,
});
const yearOptions = ref(YEAR_OPTIONS);

// 表格模块
const loading = ref(false);
const tableData = ref<any[]>([]);
const noData = ref(false);
const LEVEL_SCORE_SETTING_RANGE = {
    3: { min: 20, max: 100 },
    2: { min: 10 },
    1: { min: 1 },
};
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
            tableData.value = [
                {
                    level: 3,
                    min: 45,
                },
                {
                    level: 2,
                    max: 44,
                    min: 35,
                },
                {
                    level: 1,
                    max: 34,
                    min: 10,
                },
                {
                    level: 0,
                    max: 10,
                },
            ];
            noData.value = false;
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

const addEditDialog = reactive<{
    visible: boolean;
    title: string;
    data: any;
}>({
    visible: false,
    title: "",
    data: {},
});
// 添加/修改项点击事件
const addEditItemClick = (itemData: any) => {
    if (itemData) {
        addEditDialog.data = itemData;
        addEditDialog.title = "修改减分项";
    } else {
        addEditDialog.data = undefined;
        addEditDialog.title = "添加减分项";
    }
    addEditDialog.visible = true;
};

// 删除评估项弹窗数据
const deleteItemDialog = reactive<{
    visible: boolean;
    data: any;
}>({
    visible: false,
    data: {},
});
// 删除评估要点点击事件
const deleteItemClick = (row: { id: IdValueType }) => {
    deleteItemDialog.visible = true;
    deleteItemDialog.data = row;
};
</script>

<template>
    <div class="main-container-wrapper">
        <div class="main-header">
            <p class="title">积分与星级管理</p>
        </div>
        <div class="main-content">
            <div class="score-and-leve-manage-page">
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
                </div>
                <div v-loading="loading">
                    <el-empty v-if="noData" description="暂无数据" />
                    <template v-else>
                        <el-table :data="tableData" border style="width: 100%">
                            <el-table-column label="星级" min-width="140">
                                <template #default="{ row }">
                                    <el-rate
                                        v-if="row.level"
                                        v-model="row.level"
                                        :disabled="true"
                                        :max="row.level"
                                    />
                                    <span v-else style="color: #666666">取消评星资格</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="积分范围" min-width="140">
                                <template #default="{ row }">
                                    <span></span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="80">
                                <template #default="{ row }">
                                    <el-button v-if="row.level" type="primary" link @click="">
                                        修改
                                    </el-button>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </div>
            </div>
        </div>
        <!--添加/修改项目弹窗-->
        <EditItemDialog
            v-model="addEditDialog.visible"
            :data="addEditDialog.data"
            :title="addEditDialog.title"
            @confirm="getTableData"
        />
        <!--删除项目弹窗-->
        <DeleteItemDialog
            v-model="deleteItemDialog.visible"
            :data="deleteItemDialog.data"
            @confirm="getTableData"
        />
    </div>
</template>

<style lang="scss" scoped></style>
