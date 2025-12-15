<script setup lang="ts">
import { ref, reactive, watch, watchEffect } from "vue";
import { assessApi } from "@/api/module/assess";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

const props = defineProps<{
    modelValue: boolean;
    title: string;
    data?: {
        id?: number | string;
        content: string;
    };
}>();

const formRef = ref<FormInstance>();
const formData = reactive<{
    id?: number | string;
    content: string;
}>({
    content: "",
});
const rules = reactive<FormRules<typeof formData>>({
    content: [
        {
            required: true,
            message: "请输入减分项实证材料说明",
            trigger: "blur",
        },
        {
            min: 1,
            max: 100,
            message: "减分项实证材料说明不得超过100个字符",
            trigger: "blur",
        },
    ],
});

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            if (props.data) {
                formData.id = props.data.id || "";
                formData.content = props.data.content || "";
            } else {
                formData.id = undefined;
                formData.content = "";
            }
        }
    }
);

watchEffect(() => {
    if (props.modelValue && formRef.value) {
        formRef.value.clearValidate();
    }
});

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "confirm", payload?: any): void;
}>();

const close = () => emit("update:modelValue", false);

const submitLoading = ref(false);
const confirmClick = async () => {
    if (!formRef.value) return;
    formRef.value.validate((valid, fields) => {
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
        let result = null;
        if (formData.id) {
            result = await assessApi.updatePlus(formData);
        } else {
            result = await assessApi.addPlus({
                ...formData,
                type: 2,
            });
        }
        const { code } = result;
        if (code === 200) {
            ElMessage.success(formData.id ? `修改成功` : `添加成功`);
            close();
            emit("confirm");
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
        :title="props.title"
        width="480"
        @close="close"
        :close-on-click-modal="false"
        align-center
        :append-to-body="true"
    >
        <div class="dialog-wrapper">
            <el-form
                class="w432"
                ref="formRef"
                :model="formData"
                :rules="rules"
                label-position="top"
                require-asterisk-position="right"
            >
                <el-form-item required label="减分项实证材料说明" prop="content">
                    <el-input
                        v-model="formData.content"
                        :model-modifiers="{ trim: true }"
                        :show-word-limit="true"
                        :autosize="{ minRows: 4, maxRows: 6 }"
                        type="textarea"
                        maxlength="100"
                        placeholder="请输入减分项实证材料说明"
                        autocomplete="off"
                    />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" :loading="submitLoading" @click="confirmClick">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped></style>
