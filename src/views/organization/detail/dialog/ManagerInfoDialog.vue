<script setup lang="ts">
import { ref, reactive, watchEffect } from "vue";
import { mockApi } from "@/api/index";
import { isPhone } from "@/utils/validator";
import { ElMessage } from "element-plus";

import type { FormInstance, FormRules } from "element-plus";

const props = defineProps<{
    modelValue: boolean;
    account: OrgAccountType;
}>();

const formRef = ref<FormInstance>();
const formData = reactive<{
    id: string | number;
    userName: string;
    phone: string;
}>({
    id: "",
    userName: "",
    phone: "",
});
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
    userName: [{ validator: validateName, trigger: "blur" }],
    phone: [{ validator: validatePhone, trigger: "blur" }],
});
watchEffect(() => {
    if (props.modelValue) {
        formData.id = props.account.id;
        formData.userName = props.account.userName;
        formData.phone = props.account.phone;
    }
});

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "confirm", payload?: any): Promise<ResponseData<any>>;
}>();

const close = () => emit("update:modelValue", false);

const submitLoading = ref(false);
const confirmClick = async () => {
    if (!formRef.value) return;
    await formRef.value.validate((valid, fields) => {
        if (valid) {
            submit();
        } else {
            console.log("error submit!", fields);
        }
    });
};
// 提交修改
const submit = async () => {
    if (submitLoading.value) return; // 二次保险
    submitLoading.value = true;
    try {
        const { code } = await mockApi.mock(formData, null);
        if (code === 200) {
            ElMessage.success(`修改成功`);
            close();
            emit("confirm", {
                userName: formData.userName,
                phone: formData.phone,
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        submitLoading.value = false;
    }
};
</script>

<template>
    <el-dialog
        :model-value="props.modelValue"
        title="修改管理员信息"
        width="500"
        @close="close"
        :close-on-click-modal="false"
        align-center
    >
        <el-form
            class="w400"
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-position="top"
            require-asterisk-position="right"
        >
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
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button
                    type="primary"
                    :loading="submitLoading"
                    @click="confirmClick"
                >
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped></style>
