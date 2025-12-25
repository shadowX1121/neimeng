<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { assessApi } from "@/api/module/assess";
import { YEAR_OPTIONS, CURRENT_YEAR } from "@/constants/index";
import EditItemDialog from "./dialog/EditItemDialog.vue";

const filter = reactive({
    year: CURRENT_YEAR,
});
const yearOptions = ref(YEAR_OPTIONS);

// 表格模块
const loading = ref(false);
const tableData = ref<any[]>([]);
const noData = ref(false);
// 获取表格数据
const getTableData = async () => {
    loading.value = true;
    try {
        const { code, data } = await assessApi.getStarList({
            ...filter,
        });
        if (code === 200) {
            tableData.value = data || [];
            if (!data || data.length === 0) {
                noData.value = true;
            } else {
                noData.value = false;
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};
// 获取积分范围显示文本
const getScoreRangeText = (row: any) => {
    const { start, end } = row;
    if (end === "null") {
        return row.start + "分及以上";
    } else if (start === "null") {
        return `${end}分及以下`;
    } else {
        return `${row.start}分至${row.end}分`;
    }
};
onMounted(() => {
    getTableData();
});

const addEditDialog = reactive<{
    visible: boolean;
    star: number;
    data: any[];
}>({
    visible: false,
    star: 0,
    data: [],
});
// 修改项点击事件
const addEditItemClick = (itemData: any) => {
    if (itemData) {
        addEditDialog.data = tableData.value;
        addEditDialog.star = itemData.star;
    }
    addEditDialog.visible = true;
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
                                        v-if="row.star"
                                        v-model="row.star"
                                        :disabled="true"
                                        :max="row.star"
                                    />
                                    <span v-else style="color: #666666">取消评星资格</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="积分范围" min-width="140">
                                <template #default="{ row }">
                                    <span>{{ getScoreRangeText(row) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="80">
                                <template #default="{ row }">
                                    <el-button
                                        v-if="row.star"
                                        type="primary"
                                        link
                                        @click="addEditItemClick(row)"
                                    >
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
            :star="addEditDialog.star"
            :data="addEditDialog.data"
            @confirm="getTableData"
        />
    </div>
</template>

<style lang="scss" scoped></style>
