<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const orgId = ref(route.params.orgId);
const menuList = computed((): MyMenuType[] => {
    return [
        {
            index: `/admin/orgManage/${orgId.value}/home`,
            title: "首页",
            icon: "icon-home",
        },
        {
            index: `/admin/orgManage/${orgId.value}/liveness`,
            title: "活跃度评估",
            icon: "icon-huoyuedupinggu",
        },
    ];
});
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
watch(
    () => route.params.orgId,
    (newPath) => {
        console.log("orgId", newPath);
    },
    { immediate: true }
);

onMounted(() => {});
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
