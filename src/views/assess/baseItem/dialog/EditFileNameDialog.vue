<script setup lang="ts">
import { ref, reactive, watch, watchEffect } from "vue";
import type { FormInstance, FormRules } from "element-plus";

const props = defineProps<{
    modelValue: boolean;
    data: AssessItemMaterialType;
}>();

const formRef = ref<FormInstance>();
const formData = reactive<{
    name: string;
    isBase: boolean;
}>({
    name: "",
    isBase: false,
});
const rules = reactive<FormRules<typeof formData>>({
    name: [
        { required: true, message: "请输入实证材料说明", trigger: "blur" },
        {
            min: 1,
            max: 100,
            message: "实证材料说明不得超过100个字符",
            trigger: "blur",
        },
    ],
});

watch(
    () => props.modelValue,
    (newVal, _oldVal) => {
        if (newVal) {
            formData.name = props.data.name;
            formData.isBase = props.data.isBase;
            console.log("props.data", props.data);
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
    close();
    emit("confirm", {
        ...props.data,
        ...formData,
    });
};
</script>

<template>
    <el-dialog
        :model-value="props.modelValue"
        title="添加实证材料"
        width="480"
        @close="close"
        :close-on-click-modal="false"
        align-center
        :append-to-body="true"
    >
        <div class="edit-file-name-wrapper">
            <el-form
                class="w432"
                ref="formRef"
                :model="formData"
                :rules="rules"
                label-position="top"
                require-asterisk-position="right"
            >
                <el-form-item required label="实证材料说明" prop="name">
                    <el-input
                        v-model="formData.name"
                        :model-modifiers="{ trim: true }"
                        :show-word-limit="true"
                        :autosize="{ minRows: 4, maxRows: 6 }"
                        type="textarea"
                        maxlength="100"
                        placeholder="请输入实证材料说明"
                        autocomplete="off"
                    />
                </el-form-item>
                <el-form-item label="">
                    <el-checkbox v-model="formData.isBase">
                        <div class="is-base-des">
                            <span>是否为“</span>
                            <p class="triangle-border"></p>
                            <span>”基础达标项</span>
                        </div>
                    </el-checkbox>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirmClick">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.edit-file-name-wrapper {
    display: flex;
    justify-content: center;
    .is-base-des {
        display: flex;
        align-items: center;
        color: #000000;
    }
}
</style>
