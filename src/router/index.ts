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
                path: "account/password",
                name: "AccountPassword",
                component: () => import("@/views/account/Password.vue"),
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
