import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/Login.vue"),
    },
    // ⭐ 所有业务页面都放在 layout 下
    {
        path: "/",
        name: "Layout",
        component: () => import("@/layout/Layout.vue"),
        children: [
            {
                path: "account",
                redirect: "/account/password",
                meta: { title: "账号管理" },
                children: [
                    {
                        path: "password",
                        name: "AccountPassword",
                        meta: { title: "账号密码" },
                        component: () => import("@/views/account/Password.vue"),
                    },
                ],
            },
            {
                path: "organization",
                redirect: "/organization/list",
                meta: { title: "体育社会组织管理" },
                children: [
                    {
                        path: "list",
                        meta: { title: "体育社会组织列表" },
                        children: [
                            {
                                path: "",
                                name: "OrgList",
                                component: () =>
                                    import("@/views/organization/List.vue"),
                            },
                            {
                                path: "addAccount",
                                name: "AddAccount",
                                meta: {
                                    title: "添加账号",
                                    activeMenu: "/organization/list",
                                },
                                component: () =>
                                    import(
                                        "@/views/organization/AddAccount.vue"
                                    ),
                            },
                            {
                                path: "detail",
                                name: "OrgDetail",
                                meta: {
                                    isDynamicTitle: true,
                                    activeMenu: "/organization/list",
                                },
                                component: () =>
                                    import(
                                        "@/views/organization/detail/Index.vue"
                                    ),
                            },
                        ],
                    },
                ],
            },
            {
                path: "assess",
                redirect: "/assess/baseItem",
                meta: { title: "评估管理" },
                children: [
                    {
                        path: "baseItem",
                        meta: { title: "评估项管理" },
                        children: [
                            {
                                path: "",
                                name: "AssessBaseItem",
                                component: () =>
                                    import("@/views/assess/baseItem/List.vue"),
                            },
                            // {
                            //     path: "addAccount",
                            //     name: "AddAccount",
                            //     meta: {
                            //         title: "添加账号",
                            //         activeMenu: "/organization/list",
                            //     },
                            //     component: () =>
                            //         import(
                            //             "@/views/organization/AddAccount.vue"
                            //         ),
                            // },
                            // {
                            //     path: "detail",
                            //     name: "OrgDetail",
                            //     meta: {
                            //         isDynamicTitle: true,
                            //         activeMenu: "/organization/list",
                            //     },
                            //     component: () =>
                            //         import(
                            //             "@/views/organization/detail/Index.vue"
                            //         ),
                            // },
                        ],
                    },
                ],
            },
            {
                path: "",
                name: "Home",
                component: () => import("@/views/Home.vue"),
            },
            {
                path: "about",
                name: "About",
                component: () => import("@/views/About.vue"),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(), // createWebHashHistory()
    routes,
});

export default router;
