<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useMetaTitleStore } from "@/store/useMetaTitleStore";

interface BreadItem {
    title: string;
    path: string;
}

const route = useRoute();
const metaTitleStore = useMetaTitleStore();

const rootRef = ref<HTMLElement | null>(null);
const height = ref(0);

const breadList = ref<BreadItem[]>([]);

// 监听path属性
watch(
    () => route.path,
    () => {
        const { matched = [] } = route;
        breadList.value = matched
            .filter((item) => item.meta && (item.meta.title || item.meta.isDynamicTitle))
            .map((item) => {
                const title = item.meta.isDynamicTitle
                    ? metaTitleStore.urlMapTitle[item.path] || ""
                    : (item.meta.title as string) || "";
                return {
                    title: title,
                    path: item.path,
                };
            });
    },
    { immediate: true }
);

onMounted(async () => {
    await nextTick();
    const el = rootRef.value as HTMLElement;
    if (!el) return;
    const observer = new ResizeObserver(() => {
        height.value = rootRef.value?.offsetHeight ?? 0;
    });
    observer.observe(el);
});
/**
 * 👇 暴露给父组件
 */
defineExpose({
    height,
});
</script>
<template>
    <div ref="rootRef">
        <el-breadcrumb class="my-breadcrumb" v-if="breadList.length > 1">
            <el-breadcrumb-item v-for="item in breadList" :key="item.path">
                {{ item.title }}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
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
