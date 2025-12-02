<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

interface BreadItem {
    title: string;
    path: string;
}

const route = useRoute();

const breadList = ref<BreadItem[]>([]);

// 监听path属性
watch(
    () => route.path,
    (newPath, oldPath) => {
        const { matched = [] } = route;
        breadList.value = matched
            .filter((item) => item.meta && item.meta.title)
            .map((item) => {
                return {
                    title: item.meta.title as string,
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
    :deep(.el-breadcrumb__item) {
        &:nth-last-child(1) {
            .el-breadcrumb__inner {
                color: #000000;
            }
        }
    }
}
</style>
