<script setup lang="ts">
import { ref, computed } from "vue";
import { userApi } from "@/api/index";
import router from "@/router";
import md5 from "md5";
import { ElMessage } from "element-plus";

const name = ref(""); // 用户名
const password = ref(""); // 密码
const submitLoading = ref(false); // 提交加载状态
const submitDisabled = computed(() => {
    return !name.value || !password.value;
});
// 登录点击事件
const login = async () => {
    if (submitLoading.value) return; // 二次保险
    submitLoading.value = true;
    try {
        const { code } = await userApi.login({
            user_name: md5(`nmty.${name.value}`),
            password: md5(`nmty.${md5(password.value)}`),
        });
        if (code === 200) {
            ElMessage.success("登录成功");
            // router.push("/admin");
        }
    } catch (error) {
        console.log(error);
    } finally {
        submitLoading.value = false;
    }
};
</script>
<template>
    <div class="login-page">
        <div class="login-left">
            <img src="@/assets/images/login-left.png" alt="" />
        </div>
        <div class="login-right">
            <div class="login-box">
                <h1>欢迎登录</h1>
                <el-input
                    class="m-b-16"
                    v-model="name"
                    size="large"
                    placeholder="请输入账号登录名"
                />
                <el-input
                    v-model="password"
                    type="password"
                    size="large"
                    placeholder="请输入密码"
                />
                <el-button
                    class="login-button"
                    size="large"
                    type="primary"
                    :loading="submitLoading"
                    :disabled="submitDisabled || submitLoading"
                    @click="login"
                >
                    登录
                </el-button>
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
    min-width: 960px;
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
        .login-box {
            width: 320px;
            /* padding: 48px 40px; */
            .el-input {
                margin-left: 0 !important;
            }
        }
        h1 {
            margin-top: 0;
            margin-bottom: 32px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            font-size: 24px;
            color: #000000;
            text-align: center;
        }
        .el-input {
            width: 320px;
        }
    }
    .login-button {
        margin-top: 64px;
        width: 320px;
    }
}
</style>
