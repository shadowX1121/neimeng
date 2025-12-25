<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { assessApi } from "@/api/index";
import { YEAR_OPTIONS, CURRENT_YEAR } from "@/constants/index";
import { Sort } from "@element-plus/icons-vue";
import Draggable from "vuedraggable";
import EditItemDialog from "./dialog/EditItemDialog.vue";
import DeleteItemDialog from "./dialog/DeleteItemDialog.vue";
import { ElMessage } from "element-plus";

const filter = reactive({
    year: CURRENT_YEAR,
});
const yearOptions = ref(YEAR_OPTIONS);

// 表格模块
const loading = ref(false);
const tableData = ref<any[]>([]);
const columns = [
    { prop: "index", label: "序号", width: 150 },
    { prop: "file", label: "实证材料（项）" },
    { prop: "control", label: "操作", width: 140 },
    { prop: "drag", label: "长按调整顺序", width: 120 },
];
// 生成列样式
const getColStyle = (col: Column) => {
    if (!col.width) return {};
    return {
        width: col.width + "px",
        minWidth: col.width + "px",
        maxWidth: col.width + "px",
    };
};
const noData = ref(false);
// 获取表格数据
const getTableData = async () => {
    loading.value = true;
    try {
        const { code, data } = await assessApi.getPlusList({
            ...filter,
            type: 1,
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
onMounted(() => {
    getTableData();
});

const disabledDrag = ref(false);
const onDragEnd = async (evt: any) => {
    const { oldIndex, newIndex } = evt;
    // 顺序没变，直接 return
    if (oldIndex === newIndex) return;
    disabledDrag.value = true;
    loading.value = true;
    try {
        const { code } = await assessApi.updatePlusSort({
            list: JSON.stringify(
                tableData.value.map((item: any) => {
                    return { id: item.id, content: item.content, type: 1 };
                })
            ),
        });
        if (code === 200) {
            ElMessage.success("调整成功");
        }
    } catch (error) {
        console.log(error);
    } finally {
        disabledDrag.value = false;
        loading.value = false;
    }
};

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
        addEditDialog.title = "修改加分项";
    } else {
        addEditDialog.data = undefined;
        addEditDialog.title = "添加加分项";
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
            <p class="title">加分项管理</p>
        </div>
        <div class="main-content">
            <div class="assess-awarded-item-list-page">
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
                        <div class="el-table custom-table">
                            <div class="custom-other-header">
                                <p class="flex-1">加分规则：每有一项加1分。</p>
                                <el-button type="primary" @click="addEditItemClick(undefined)">
                                    添加项
                                </el-button>
                            </div>
                            <div class="el-table__header-wrapper">
                                <table class="el-table__header">
                                    <colgroup>
                                        <col
                                            v-for="col in columns"
                                            :key="col.prop"
                                            :style="getColStyle(col)"
                                        />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th v-for="col in columns" :key="col.prop">
                                                {{ col.label }}
                                            </th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="el-table__body-wrapper">
                                <table class="el-table__body">
                                    <colgroup>
                                        <col
                                            v-for="col in columns"
                                            :key="col.prop"
                                            :style="getColStyle(col)"
                                        />
                                    </colgroup>
                                    <draggable
                                        v-model="tableData"
                                        item-key="id"
                                        handle=".drag-handle"
                                        animation="200"
                                        tag="tbody"
                                        :disabled="disabledDrag"
                                        @end="onDragEnd"
                                    >
                                        <template #item="{ element, index }">
                                            <tr>
                                                <td>{{ index + 1 }}</td>
                                                <td>
                                                    {{ element.content }}
                                                </td>
                                                <td>
                                                    <div>
                                                        <el-button
                                                            type="primary"
                                                            link
                                                            @click="addEditItemClick(element)"
                                                        >
                                                            修改
                                                        </el-button>
                                                        <el-button
                                                            type="danger"
                                                            link
                                                            @click="deleteItemClick(element)"
                                                        >
                                                            删除
                                                        </el-button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p class="drag-handle">
                                                        <el-icon><Sort /></el-icon>
                                                    </p>
                                                </td>
                                            </tr>
                                        </template>
                                    </draggable>
                                </table>
                            </div>
                        </div>
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
