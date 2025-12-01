<script setup lang="ts">
import { ref, onMounted } from "vue";

const menuList = ref([
    {
        index: "account",
        title: "账号管理",
        icon: "",
        children: [
            {
                index: "/account/password",
                title: "账号密码",
            },
        ],
    },
    {
        index: "organization",
        title: "体育社会组织管理",
        icon: "",
        children: [
            {
                index: "organization/list",
                title: "体育社会组织列表",
            },
        ],
    },
    {
        index: "assess",
        title: "评估管理",
        icon: "",
        children: [
            {
                index: "assess/baseItem",
                title: "评估项管理",
            },
            {
                index: "assess/awardedItem",
                title: "加分项管理",
            },
            {
                index: "assess/deductionItem",
                title: "减分项管理",
            },
            {
                index: "assess/vetoItem",
                title: "一票否决管理",
            },
            {
                index: "assess/scoreAndLevel",
                title: "积分与星级管理",
            },
        ],
    },
    {
        index: "download",
        title: "下载管理",
        icon: "",
        children: [
            {
                index: "download/list",
                title: "下载任务列表",
            },
        ],
    },
    {
        index: "other",
        title: "其他管理",
        icon: "",
    },
]);
const defaultActive = ref("acount/password"); // 默认选中的菜单项

onMounted(() => {
    console.log("菜单加载完成");
});
</script>
<template>
    <el-menu
        class="my-menu"
        :default-active="defaultActive"
        :unique-opened="true"
        :router="false"
    >
        <template v-for="menu in menuList" :key="menu.index">
            <el-sub-menu
                v-if="menu.children && menu.children.length > 0"
                :index="menu.index"
            >
                <template #title>
                    <!-- 此处添加图标 -->
                    <span>{{ menu.title }}</span>
                </template>
                <el-menu-item
                    v-for="children in menu.children"
                    :key="children.index"
                >
                    <!-- <span>{{ children.title }}</span> -->
                    <router-link :to="children.index">
                        <span>{{ children.title }}</span>
                    </router-link>
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item class="no-child-menu" v-else :index="menu.index">
                <!-- 此处添加图标 -->
                <span>{{ menu.title }}</span>
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
    background-color: var(--el-color-primary);
    :deep(.el-sub-menu) {
        + .el-sub-menu,
        + .no-child-menu {
            margin-top: 8px;
        }
        .el-sub-menu__icon-arrow {
            right: 0;
        }
    }
    .no-child-menu {
        + .el-sub-menu,
        + .no-child-menu {
            margin-top: 8px;
        }
    }
    :deep(.el-menu-item) {
        margin-top: 4px;
        a {
            padding-left: 24px;
        }
    }
}
</style>
