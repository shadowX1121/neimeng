<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { mockApi } from "@/api/index";
import { ElMessage } from "element-plus";

import type { FormInstance, FormRules } from "element-plus";

const formRef = ref<FormInstance>();
const formData = reactive({
    name: "",
    password: "",
});
// 名称验证
const validateName = (_rule: any, value: string, callback: any) => {
    if (value === "") {
        callback(new Error("请输入账号名称"));
    } else if (value.length > 20) {
        callback(new Error("账号名称不能超过20个字符"));
    } else {
        callback();
    }
};
// 密码验证
const validatePass = (_rule: any, value: string, callback: any) => {
    if (value === "") {
        callback(new Error("请输入密码"));
    } else if (value.length < 6 || value.length > 20) {
        callback(new Error("密码长度为6-20个字符"));
    } else {
        callback();
    }
};
const rules = reactive<FormRules<typeof formData>>({
    name: [{ validator: validateName, trigger: "blur" }],
    password: [{ validator: validatePass, trigger: "blur" }],
});
const submitLoading = ref(false);
const submitDisabled = computed(() => {
    return (
        !formData.name ||
        !formData.password ||
        formData.password.length < 6 ||
        formData.password.length > 20
    );
});

// 提交按钮点击事件
const onSubmit = async () => {
    if (submitLoading.value) return; // 二次保险
    submitLoading.value = true;
    try {
        const { code } = await mockApi.mock(formData, null);
        if (code === 200) {
            ElMessage.success("修改成功");
        }
    } catch (error) {
        console.log(error);
    } finally {
        submitLoading.value = false;
    }
};
</script>

<template>
    <div class="main-container-wrapper">
        <div class="main-header">
            <span class="title">账号密码设置</span>
        </div>
        <div class="main-content detail-content">
            <div class="password-page">
                <el-form
                    class="w400"
                    ref="formRef"
                    :model="formData"
                    :rules="rules"
                    label-position="top"
                    require-asterisk-position="right"
                >
                    <el-form-item required label="账号名称" prop="name">
                        <el-input
                            v-model="formData.name"
                            :model-modifiers="{ trim: true }"
                            :show-word-limit="true"
                            maxlength="20"
                            placeholder="请输入账号名称20位以内"
                            autocomplete="off"
                        />
                    </el-form-item>
                    <el-form-item required label="修改新密码" prop="password">
                        <el-input
                            v-model="formData.password"
                            :model-modifiers="{ trim: true }"
                            type="password"
                            :show-password="true"
                            maxlength="20"
                            placeholder="请输入新密码6位至20位以内（仅限字母及数字）"
                            autocomplete="new-password"
                        />
                    </el-form-item>
                    <el-form-item style="margin-top: 48px" class="button-form-item">
                        <el-button
                            type="primary"
                            :loading="submitLoading"
                            :disabled="submitDisabled || submitLoading"
                            @click="onSubmit"
                        >
                            确定
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.password-page {
    margin-top: 40px;
}
</style>
