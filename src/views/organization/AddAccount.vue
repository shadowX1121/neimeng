<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { institutionApi } from "@/api/index";
import { isPhone } from "@/utils/validator";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

import type { FormInstance, FormRules } from "element-plus";

const router = useRouter();

const formRef = ref<FormInstance>();
const formData = reactive({
    account: "",
    userName: "",
    phone: "",
});
const password = computed(() => {
    return isPhone(formData.phone) ? formData.phone.slice(-6) : "";
});
// 手机号验证
const validatePhone = (_rule: any, value: string, callback: any) => {
    if (value === "") {
        callback(new Error("请输入手机号"));
    } else if (!isPhone(value)) {
        callback(new Error("请输入正确的手机号"));
    } else {
        callback();
    }
};
const rules = reactive<FormRules<typeof formData>>({
    account: [
        { required: true, message: "请输入社会体育组织名称", trigger: "blur" },
        {
            min: 1,
            max: 20,
            message: "社会体育组织名称不能超过20个字符",
            trigger: "blur",
        },
    ],
    userName: [
        { required: true, message: "请输入管理员姓名", trigger: "blur" },
        {
            min: 1,
            max: 10,
            message: "管理员姓名不能超过10个字符",
            trigger: "blur",
        },
    ],
    phone: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        { validator: validatePhone, trigger: "blur" },
    ],
});
const submitLoading = ref(false);
const submitDisabled = computed(() => {
    return !formData.account || !formData.userName || !isPhone(formData.phone);
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
        const { code } = await institutionApi.add({
            account_name: formData.account,
            password: password.value,
            manager_phone: formData.phone,
            manager_name: formData.userName,
        });
        if (code === 200) {
            ElMessage.success("添加成功");
            router.back();
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
            <span class="title">添加社会体育组织账号</span>
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
                    <el-form-item label="社会体育组织名称" prop="account">
                        <el-input
                            v-model="formData.account"
                            :model-modifiers="{ trim: true }"
                            :show-word-limit="true"
                            maxlength="20"
                            placeholder="请输入社会体育组织名称（账号登录名）"
                            autocomplete="off"
                        />
                    </el-form-item>
                    <el-form-item label="管理员姓名" prop="userName">
                        <el-input
                            v-model="formData.userName"
                            :model-modifiers="{ trim: true }"
                            :show-word-limit="true"
                            maxlength="10"
                            placeholder="请输入管理员姓名"
                            autocomplete="off"
                        />
                    </el-form-item>
                    <el-form-item label="管理员手机号" prop="phone">
                        <el-input
                            v-model="formData.phone"
                            :model-modifiers="{ trim: true }"
                            maxlength="11"
                            placeholder="请输入管理员手机号"
                            autocomplete="off"
                        />
                    </el-form-item>
                    <el-form-item label="初始密码">
                        <el-input
                            v-model="password"
                            disabled
                            placeholder="默认为管理员手机号后六位"
                            autocomplete="off"
                        />
                    </el-form-item>
                    <el-form-item style="margin-top: 48px" class="button-form-item">
                        <el-button @click="router.back()" plain>取消</el-button>
                        <el-button
                            type="primary"
                            :loading="submitLoading"
                            :disabled="submitDisabled || submitLoading"
                            @click="handleSubmit"
                        >
                            立即添加
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
