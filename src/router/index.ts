import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { useMetaTitleStore } from "@/store/useMetaTitleStore";

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
                                component: () => import("@/views/organization/List.vue"),
                            },
                            {
                                path: "addAccount",
                                name: "AddAccount",
                                meta: {
                                    title: "添加账号",
                                    activeMenu: "/organization/list",
                                },
                                component: () => import("@/views/organization/AddAccount.vue"),
                            },
                            {
                                path: "detail",
                                name: "OrgDetail",
                                meta: {
                                    isDynamicTitle: true,
                                    activeMenu: "/organization/list",
                                },
                                component: () => import("@/views/organization/detail/Index.vue"),
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
                                component: () => import("@/views/assess/baseItem/List.vue"),
                            },
                            {
                                path: "add",
                                name: "AssessBaseItemAdd",
                                meta: {
                                    isDynamicTitle: true,
                                    activeMenu: "/assess/baseItem",
                                },
                                component: () => import("@/views/assess/baseItem/Add.vue"),
                                beforeEnter: (to, _from, next) => {
                                    const metaTitleStore = useMetaTitleStore();
                                    metaTitleStore.urlMapTitle = {
                                        ...metaTitleStore.urlMapTitle,
                                        [to.path]: to.query.id ? "修改评估项" : "添加评估项",
                                    };
                                    next();
                                },
                            },
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
                    {
                        path: "awardedItem",
                        meta: { title: "加分项管理" },
                        children: [
                            {
                                path: "",
                                name: "AwardedItem",
                                component: () => import("@/views/assess/awardedItem/List.vue"),
                            },
                        ],
                    },
                    {
                        path: "deductionItem",
                        meta: { title: "减分项管理" },
                        children: [
                            {
                                path: "",
                                name: "DeductionItem",
                                component: () => import("@/views/assess/deductionItem/List.vue"),
                            },
                        ],
                    },
                    {
                        path: "vetoItem",
                        meta: { title: "一票否决管理" },
                        children: [
                            {
                                path: "",
                                name: "VetoItem",
                                component: () => import("@/views/assess/vetoItem/List.vue"),
                            },
                        ],
                    },
                    {
                        path: "scoreAndLevel",
                        meta: { title: "积分与星级管理" },
                        children: [
                            {
                                path: "",
                                name: "ScoreAndLevel",
                                component: () => import("@/views/assess/scoreAndLevel/List.vue"),
                            },
                        ],
                    },
                ],
            },
            {
                path: "download",
                redirect: "/download/list",
                meta: { title: "下载管理" },
                children: [
                    {
                        path: "list",
                        meta: { title: "下载任务列表" },
                        children: [
                            {
                                path: "",
                                name: "DownloadList",
                                component: () => import("@/views/download/List.vue"),
                            },
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
    {
        path: "/pdfPreview",
        name: "PdfPreview",
        component: () => import("@/views/PdfPreview.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(), // createWebHashHistory()
    routes,
});

export default router;
