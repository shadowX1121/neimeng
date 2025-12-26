<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { institutionApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { isPhone } from "@/utils/validator";

import type { FormInstance, FormRules } from "element-plus";

const formRef = ref<FormInstance>();
const formData = reactive({
    userName: "",
    phone: "",
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
    return !formData.userName || !isPhone(formData.phone);
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
// 提交修改
const submit = async () => {
    const accountJson = localStorage.getItem("account");
    if (!accountJson) return;
    const accountObject = JSON.parse(accountJson);
    if (!accountObject || !accountObject.id) return;
    if (submitLoading.value) return; // 二次保险
    submitLoading.value = true;
    try {
        const { code } = await institutionApi.updateManager({
            institution_id: accountObject.id,
            manager_phone: formData.phone,
            manager_name: formData.userName,
        });
        if (code === 200) {
            ElMessage.success(`修改成功`);
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
            <span class="title">管理员设置</span>
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
