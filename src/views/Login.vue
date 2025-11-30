<script setup lang="ts">
import { ref } from "vue";
const name = ref("");
</script>
<template>
    <div class="login-page">
        <div class="login-left">
            <img src="@/assets/images/login-left.png" alt="" />
        </div>
        <div class="login-right">
            <div>
                <h1>欢迎登录</h1>
                <el-input v-model="name" placeholder="请输入账号登录名" />
                <el-input
                    v-model="name"
                    type="password"
                    placeholder="请输入密码"
                />
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.login-page {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    background: url("@/assets/images/login-bg.png");
    background-size: cover;
    background-repeat: no-repeat; /* 防止重复 */
    background-position: center; /* 背景居中 */
    .login-left {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 58%;
    }
    .login-right {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 42%;
        background: rgba(255, 255, 255, 0.7);
    }
}
</style>
