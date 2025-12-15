<script setup lang="ts">
import { ref, reactive, watch, watchEffect } from "vue";
import type { FormInstance, FormRules } from "element-plus";

const props = defineProps<{
    modelValue: boolean;
    data: AssessItemMaterialType;
    allData: AssessItemMaterialType[];
    index: number | "";
}>();

const formRef = ref<FormInstance>();
const formData = reactive<{
    id?: IdValueType;
    content: string;
    flag: boolean;
}>({
    id: "",
    content: "",
    flag: false,
});
const rules = reactive<FormRules<typeof formData>>({
    content: [
        { required: true, message: "请输入实证材料说明", trigger: "blur" },
        {
            min: 1,
            max: 100,
            message: "实证材料说明不得超过100个字符",
            trigger: "blur",
        },
        {
            validator: (_rule: any, value: string, callback: any) => {
                const allData =
                    props.index === ""
                        ? props.allData
                        : props.allData.filter((_item, index) => props.index !== index);
                // 检查重复项
                if (allData.some((item) => item.content.trim() === value.trim())) {
                    callback(new Error("该材料说明已存在"));
                } else {
                    callback();
                }
            },
            trigger: "blur",
        },
    ],
});

watch(
    () => props.modelValue,
    (newVal, _oldVal) => {
        if (newVal) {
            if (props.data && props.index !== "") {
                formData.id = props.data.id;
                formData.content = props.data.content;
                formData.flag = props.data.flag === "1" ? true : false;
            } else {
                formData.id = "";
                formData.content = "";
                formData.flag = false;
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
        flag: formData.flag ? "1" : "0",
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
                <el-form-item required label="实证材料说明" prop="content">
                    <el-input
                        v-model="formData.content"
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
                    <el-checkbox v-model="formData.flag">
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
                <el-button type="primary" @click="confirmClick">确定</el-button>
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
