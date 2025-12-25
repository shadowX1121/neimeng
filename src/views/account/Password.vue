<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { userApi } from "@/api/index";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

import type { FormInstance, FormRules } from "element-plus";

const router = useRouter();

const formRef = ref<FormInstance>();
const formData = reactive({
    name: "",
    password: "",
});
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
    name: [
        { required: true, message: "请输入账号名称", trigger: "blur" },
        {
            min: 1,
            max: 20,
            message: "账号名称不能超过20个字符",
            trigger: "blur",
        },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { validator: validatePass, trigger: "blur" },
    ],
});
const formatter = (value: string) => value;
const parser = (value: string) => value.replace(/[^a-zA-Z0-9]/g, "");
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
const handleSubmit = async () => {
    if (!formRef.value) return;
    formRef.value.validate((valid, fields) => {
        if (valid) {
            submit();
        } else {
            console.error("error submit!", fields);
        }
    });
};
// 提交
const submit = async () => {
    if (submitLoading.value) return; // 二次保险
    submitLoading.value = true;
    try {
        const { code } = await userApi.update({
            account_name: formData.name,
            password: formData.password,
        });
        if (code === 200) {
            ElMessage.success("修改成功，请重新登录");
            localStorage.clear();
            router.push("/login");
        }
    } catch (error) {
        console.error(error);
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
                    <el-form-item label="账号名称" prop="name">
                        <el-input
                            v-model="formData.name"
                            :model-modifiers="{ trim: true }"
                            :show-word-limit="true"
                            maxlength="20"
                            placeholder="请输入账号名称20位以内"
                            autocomplete="off"
                        />
                    </el-form-item>
                    <el-form-item label="修改新密码" prop="password">
                        <el-input
                            v-model="formData.password"
                            :model-modifiers="{ trim: true }"
                            type="password"
                            show-password
                            maxlength="20"
                            :formatter="formatter"
                            :parser="parser"
                            placeholder="请输入新密码6位至20位以内（仅限字母及数字）"
                            autocomplete="new-password"
                        />
                    </el-form-item>
                    <el-form-item style="margin-top: 48px" class="button-form-item">
                        <el-button
                            type="primary"
                            :loading="submitLoading"
                            :disabled="submitDisabled || submitLoading"
                            @click="handleSubmit"
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
