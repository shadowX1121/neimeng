<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useMetaTitleStore } from "@/store/useMetaTitleStore";

interface BreadItem {
    title: string;
    path: string;
}

const route = useRoute();
const metaTitleStore = useMetaTitleStore();

const breadList = ref<BreadItem[]>([]);

// 监听path属性
watch(
    () => route.path,
    (newPath, oldPath) => {
        const { matched = [] } = route;
        console.log(
            "数组",
            matched.filter(
                (item) =>
                    item.meta && (item.meta.title || item.meta.isDynamicTitle)
            )
        );

        breadList.value = matched
            .filter(
                (item) =>
                    item.meta && (item.meta.title || item.meta.isDynamicTitle)
            )
            .map((item) => {
                const title = item.meta.isDynamicTitle
                    ? metaTitleStore.urlMapTitle[item.path] || ""
                    : (item.meta.title as string) || "";
                return {
                    title: title,
                    path: item.path,
                };
            });
        console.log("路径变化:", oldPath, "→", newPath, route);
    },
    { immediate: true }
);
</script>
<template>
    <el-breadcrumb class="my-breadcrumb">
        <el-breadcrumb-item v-for="item in breadList" :key="item.path">
            {{ item.title }}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<style lang="scss" scoped>
.my-breadcrumb {
    --el-text-color-regular: #999999;
    margin-bottom: 16px;
    line-height: 20px;
    :deep(.el-breadcrumb__item) {
        &:nth-last-child(1) {
            .el-breadcrumb__inner {
                color: #000000;
            }
        }
    }
}
</style>
