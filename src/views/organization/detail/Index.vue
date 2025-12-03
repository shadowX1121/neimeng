<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { mockApi } from "@/api/index";
import { isPhone } from "@/utils/validator";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

import type { TabsPaneContext } from "element-plus";

const activeName = ref("first");
const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event);
};
</script>

<template>
    <div class="main-container-wrapper">
        <div class="main-header">
            <el-tabs
                v-model="activeName"
                class="demo-tabs"
                @tab-click="handleClick"
            >
                <el-tab-pane label="User" name="first">User</el-tab-pane>
                <el-tab-pane label="Config" name="second">Config</el-tab-pane>
                <el-tab-pane label="Role" name="third">Role</el-tab-pane>
                <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
            </el-tabs>
        </div>
        <div class="main-content detail-content">
            <div class="org-detail-page"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.org-detail-page {
    margin-top: 40px;
}
</style>
