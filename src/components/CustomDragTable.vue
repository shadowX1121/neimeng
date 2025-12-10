<script setup lang="ts">
import Draggable from "vuedraggable";

interface Column {
    prop: string;
    label: string;
    center?: boolean;
    width?: number;
}

const props = defineProps<{
    columns: Column[];
    data: any[];
}>();

// 生成列样式
const getColStyle = (col: Column) => {
    if (!col.width) return {};
    return {
        width: col.width + "px",
        minWidth: col.width + "px",
        maxWidth: col.width + "px",
    };
};
</script>
<template>
    <div class="el-table custom-table">
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
                <tbody>
                    <tr v-for="(row, rowIndex) in data" :key="rowIndex">
                        <td v-for="col in columns" :key="col.prop">
                            <div v-if="col.prop == 'index'">
                                {{ rowIndex + 1 }}
                            </div>
                            <div v-else>{{ rowIndex + 1 }}</div>
                            {{ row[col.prop] }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
/* ------------------------------
    模拟 Element Plus table 样式
-------------------------------- */

.custom-table {
    --el-table-border-color: var(--el-border-color);
    --el-table-border: 1px solid var(--el-table-border-color);
    --el-table-text-color: var(--el-text-color-regular);
    --el-table-header-text-color: var(--el-text-color-secondary);
    --el-table-row-hover-background: var(--el-fill-color-lighter);
    --el-table-header-bg-color: var(--el-fill-color-blank);
    --el-table-bg-color: var(--el-bg-color);

    width: 100%;
    border: var(--el-table-border);
    border-right: none;
    border-bottom: none;
    color: var(--el-table-text-color);
    font-size: 14px;
    overflow: hidden;
}

.custom-table table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed; /* ⭐ 关键: 让 width 生效 */
}

/* header */
.custom-table .el-table__header th {
    padding: 8px 12px;
    background-color: var(--el-table-header-bg-color);
    color: var(--el-table-header-text-color);
    border-bottom: var(--el-table-border);
    border-right: var(--el-table-border);
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* body */
.custom-table .el-table__body td {
    padding: 8px 12px;
    border-bottom: var(--el-table-border);
    border-right: var(--el-table-border);
    background-color: var(--el-table-bg-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
}

/* hover 效果 */
.custom-table .el-table__body tr:hover td {
    background-color: var(--el-table-row-hover-background);
}
</style>
