<script setup lang="ts">
import { ref, onMounted, nextTick, reactive, watch } from "vue";
import { institutionApi } from "@/api/index";
import { useRoute, useRouter } from "vue-router";
import MyMenu from "./Menu.vue";
import MyBreadcrumb from "@/components/MyBreadcrumb.vue";
import { useDownloadCountStore } from "@/store/useDownloadCountStore";

const route = useRoute();
const router = useRouter();
const downloadCountStore = useDownloadCountStore();

const account = reactive<any>({
    name: "",
});
// 获取详情
const getDetail = async (id: any) => {
    try {
        const { code, data } = await institutionApi.getDetail({
            institution_id: id,
        });
        if (code === 200) {
            account.name = data.name;
        }
    } catch (error) {
        console.log(error);
    }
};

watch(
    () => route.params.orgId,
    (newId) => {
        if (newId) {
            getDetail(newId);
        }
    },
    { immediate: true }
);

const height = ref(0);
const pageMainRef = ref<any>(null);
const mainHeight = ref(0);
const breadRef = ref<{
    height: number;
} | null>(null);
// 下载点击事件
const goDownload = () => {
    console.log("下载点击事件");
};
// 退出登录点击事件
const logout = () => {
    localStorage.clear();
    router.push("/login");
};

onMounted(async () => {
    await nextTick(); // 确保 DOM 已经渲染完成
    const el = pageMainRef.value?.$el as HTMLElement;
    if (!el) return;
    console.log();
    const observer = new ResizeObserver(([entry]) => {
        mainHeight.value = entry?.contentRect.height || 0;
        height.value = mainHeight.value - (breadRef.value?.height ?? 0);
    });
    observer.observe(el);
});
</script>
<template>
    <div class="common-layout">
        <el-container>
            <el-header class="page-header">
                <div class="logo">
                    <span>{{ account.name }}</span>
                </div>
                <div class="right">
                    <div class="icon download" @click="goDownload">
                        <i class="iconfont icon-downloadbox"></i>
                        <div id="download-target">
                            <p class="down-count" v-if="downloadCountStore.count">
                                {{
                                    downloadCountStore.count > 99 ? "99+" : downloadCountStore.count
                                }}
                            </p>
                        </div>
                    </div>
                    <div class="icon" @click="logout">
                        <i class="iconfont icon-logout"></i>
                    </div>
                </div>
            </el-header>
            <el-container class="page-container">
                <el-aside class="layout-aside">
                    <MyMenu />
                </el-aside>
                <el-main class="page-main" ref="pageMainRef">
                    <MyBreadcrumb ref="breadRef" />
                    <div class="main-container" :style="{ '--my-calc-height': height + 'px' }">
                        <router-view />
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style lang="scss" scoped></style>
