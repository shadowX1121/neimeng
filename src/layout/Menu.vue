<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const menuList = ref([
    {
        index: "account",
        title: "账号管理",
        icon: "icon-zhanghaoguanli",
        children: [
            {
                index: "/admin/account/password",
                title: "账号密码",
            },
        ],
    },
    {
        index: "organization",
        title: "体育社会组织管理",
        icon: "icon-zuzhijibenxinxi",
        children: [
            {
                index: "/admin/organization/list",
                title: "体育社会组织列表",
            },
        ],
    },
    {
        index: "assess",
        title: "评估管理",
        icon: "icon-pingguguanli",
        children: [
            {
                index: "/admin/assess/baseItem",
                title: "评估项管理",
            },
            {
                index: "/admin/assess/awardedItem",
                title: "加分项管理",
            },
            {
                index: "/admin/assess/deductionItem",
                title: "减分项管理",
            },
            {
                index: "/admin/assess/vetoItem",
                title: "一票否决管理",
            },
            {
                index: "/admin/assess/scoreAndLevel",
                title: "积分与星级管理",
            },
        ],
    },
    {
        index: "download",
        title: "下载管理",
        icon: "icon-xiazaiguanli",
        children: [
            {
                index: "/admin/download/list",
                title: "下载任务列表",
            },
        ],
    },
    // {
    //     index: "other",
    //     title: "其他管理",
    //     icon: "",
    // },
]);
const defaultActive = ref(""); // 默认选中的菜单项

// 监听path属性
watch(
    () => route.path,
    (newPath, oldPath) => {
        const { meta } = route;
        defaultActive.value = meta && meta.activeMenu ? (meta.activeMenu as string) : newPath;
        console.log("路径变化:", oldPath, "→", newPath);
    },
    { immediate: true }
);
</script>
<template>
    <el-menu class="my-menu" :default-active="defaultActive" :unique-opened="true">
        <template v-for="menu in menuList" :key="menu.index">
            <el-sub-menu
                v-if="menu.children && menu.children.length > 0"
                class="my-level1-sub-menu"
                :index="menu.index"
            >
                <template #title>
                    <!-- 此处添加图标 -->
                    <i :class="['iconfont', menu.icon]"></i>
                    <span>{{ menu.title }}</span>
                </template>
                <el-menu-item
                    v-for="children in menu.children"
                    :key="children.index"
                    :index="children.index"
                >
                    <router-link :to="children.index">
                        <span>{{ children.title }}</span>
                    </router-link>
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item class="no-child-menu" v-else :index="menu.index">
                <router-link :to="menu.index">
                    <!-- 此处添加图标 -->
                    <i :class="['iconfont', menu.icon]"></i>
                    <span>{{ menu.title }}</span>
                </router-link>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<style lang="scss" scoped>
.my-menu {
    --el-menu-base-level-padding: 12px;
    --el-menu-level-padding: 12px;
    --el-menu-item-height: 40px;
    --el-menu-text-color: #ffffff;
    --el-menu-hover-bg-color: transparent;
    --el-menu-bg-color: transparent;
    --el-menu-sub-item-height: var(--el-menu-item-height);
    width: 100%;
    height: 100%;
    padding: 16px;
    border-radius: 16px 16px 0px 0px;
    overflow-y: auto;
    background-color: var(--el-color-primary);
    :deep(.el-sub-menu) {
        + .el-sub-menu,
        + .no-child-menu {
            margin-top: 8px;
        }
        .el-sub-menu__icon-arrow {
            right: 0;
        }
        .iconfont {
            margin-right: 8px;
        }
    }
    .no-child-menu {
        border-radius: 8px;
        padding-left: 0 !important;
        padding-right: 0;
        > a {
            padding: 0 12px;
            width: 100%;
        }
        &.is-active {
            background-color: #ffffff;
            color: var(--el-color-primary);
            font-weight: 600;
        }
        + .el-sub-menu,
        + .no-child-menu {
            margin-top: 8px;
        }
        .iconfont {
            margin-right: 8px;
        }
    }
}
.my-level1-sub-menu {
    > :deep(.el-menu) {
        > .el-menu-item {
            margin-top: 4px;
            padding-left: 36px !important;
            padding-right: 0 !important;
            a {
                padding: 0 12px;
                width: 100%;
                border-radius: 8px;
            }
            &.is-active {
                a {
                    background-color: #ffffff;
                    color: var(--el-color-primary);
                }
            }
        }
        &::before {
            content: "";
            position: absolute;
            top: 12px;
            left: 20px;
            width: 1px;
            height: calc(100% - 24px);
            background-color: rgba(235, 238, 245, 0.2);
        }
    }
}
</style>
