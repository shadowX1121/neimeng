<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { mockApi } from "@/api/index";
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
// 名称验证
const validateAccount = (_rule: any, value: string, callback: any) => {
    if (value === "") {
        callback(new Error("请输入社会体育组织名称"));
    } else if (value.length > 20) {
        callback(new Error("社会体育组织名称不能超过20个字符"));
    } else {
        callback();
    }
};
// 管理员姓名验证
const validateName = (_rule: any, value: string, callback: any) => {
    if (value === "") {
        callback(new Error("请输入管理员姓名"));
    } else if (value.length > 10) {
        callback(new Error("管理员姓名不能超过10个字符"));
    } else {
        callback();
    }
};
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
    account: [{ validator: validateAccount, trigger: "blur" }],
    userName: [{ validator: validateName, trigger: "blur" }],
    phone: [{ validator: validatePhone, trigger: "blur" }],
});
const submitLoading = ref(false);
const submitDisabled = computed(() => {
    return !formData.account || !formData.userName || !isPhone(formData.phone);
});

// 提交按钮点击事件
const onSubmit = async () => {
    if (submitLoading.value) return; // 二次保险
    submitLoading.value = true;
    try {
        const { code } = await mockApi.mock(formData, null);
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
            <span class="title">添加评估项</span>
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
                    <el-form-item
                        required
                        label="社会体育组织名称"
                        prop="account"
                    >
                        <el-input
                            v-model="formData.account"
                            :model-modifiers="{ trim: true }"
                            :show-word-limit="true"
                            maxlength="20"
                            placeholder="请输入社会体育组织名称（账号登录名）"
                            autocomplete="off"
                        />
                    </el-form-item>
                    <el-form-item required label="管理员姓名" prop="userName">
                        <el-input
                            v-model="formData.userName"
                            :model-modifiers="{ trim: true }"
                            :show-word-limit="true"
                            maxlength="10"
                            placeholder="请输入管理员姓名"
                            autocomplete="off"
                        />
                    </el-form-item>
                    <el-form-item required label="管理员手机号" prop="phone">
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
                    <el-form-item
                        style="margin-top: 48px"
                        class="button-form-item"
                    >
                        <el-button @click="router.back()" plain>
                            取消
                        </el-button>
                        <el-button
                            type="primary"
                            :loading="submitLoading"
                            :disabled="submitDisabled || submitLoading"
                            @click="onSubmit"
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
