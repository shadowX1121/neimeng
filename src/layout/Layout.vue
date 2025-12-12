<script setup lang="ts">
import router from "@/router";
import MyMenu from "./Menu.vue";
import MyBreadcrumb from "./Breadcrumb.vue";
import { useDownloadCountStore } from "@/store/useDownloadCountStore";

const downloadCountStore = useDownloadCountStore();
// 下载点击事件
const goDownload = () => {
    console.log("下载点击事件");
};
// 退出登录点击事件
const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
};
</script>
<template>
    <div class="common-layout">
        <el-container>
            <el-header class="page-header">
                <div class="logo">
                    <span>内蒙古体育社会组织管理系统</span>
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
                <el-main class="page-main">
                    <MyBreadcrumb />
                    <div class="main-container">
                        <router-view />
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style lang="scss" scoped>
.common-layout {
    --my-page-header-height: 80px;
    height: 100%;
    background: #edf2f8;
    .el-container.is-vertical {
        height: 100%;
    }
    .page-header {
        display: flex;
        height: var(--my-page-header-height);
        padding: 0 24px;
        .logo {
            display: flex;
            align-items: center;
            flex: 1;
            font-size: 18px;
            font-weight: 700;
            font-family: "Times New Roman", Times, serif;
            font-style: italic;
            color: var(--el-color-primary);
        }
        .right {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            .download {
                position: relative;
            }
            .icon {
                .iconfont {
                    color: #000000;
                    cursor: pointer;
                    font-size: 20px;
                }
                + .icon {
                    margin-left: 24px;
                }
            }
        }
    }
    .page-container {
        height: calc(100% - var(--my-page-header-height));
        .layout-aside {
            width: 240px;
            height: 100%;
            padding: 0 16px;
        }
        .page-main {
            --el-main-padding: 16px;
            display: flex;
            flex-direction: column;
            height: 100%;
            background: #f6f9fb;
            border-radius: 16px 0 0 0;
        }
    }
}
#download-target {
    display: flex;
    justify-content: center;
    position: absolute;
    top: -4px;
    right: -16px;
    height: 16px;
    width: 32px;
}
</style>
