<!-- <script setup lang="ts">
import { ref, reactive, computed, markRaw, provide } from "vue";
import { mockApi } from "@/api/index";
import { isPhone } from "@/utils/validator";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

import HomeModule from "./module/Home.vue";
import LivenessModule from "./module/Liveness.vue";

import type { TabsPaneContext } from "element-plus";
import type { Component } from "vue";

const activeName = ref("home");
const paneList = ref<(MyPaneItem & { component: Component })[]>([
    {
        label: "首页",
        name: "home",
        component: markRaw(HomeModule),
    },
    {
        label: "活跃度评估",
        name: "liveness",
        component: markRaw(LivenessModule),
    },
]);
const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event);
};

const refreshHandlers = new Set<() => void>();
provide("registerRefresh", (fn: () => void) => {
    refreshHandlers.add(fn);
});
provide("notifyRefresh", () => {
    refreshHandlers.forEach((fn) => fn());
});
</script>

<template>
    <div class="main-container-wrapper">
        <el-tabs v-model="activeName" class="org-detail-tabs" @tab-click="handleClick">
            <el-tab-pane
                v-for="item in paneList"
                :key="item.name"
                :label="item.label"
                :name="item.name"
            >
                <component :is="item.component"></component>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style lang="scss" scoped>
.org-detail-page {
    margin-top: 40px;
}
.org-detail-tabs {
    --el-tabs-header-height: 76px;
    :deep(> .el-tabs__header) {
        margin: 0;
        .el-tabs__item {
            font-size: 20px;
            padding: 0 12px;
            font-family: PingFang SC, PingFang SC;
        }
        .el-tabs__nav-wrap {
            &::after {
                height: 1px;
            }
        }
    }
}
</style> -->
