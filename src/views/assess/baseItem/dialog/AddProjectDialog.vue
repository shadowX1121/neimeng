<script setup lang="ts">
import { ref, reactive, watchEffect } from "vue";
import { mockApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { CirclePlus, Delete } from "@element-plus/icons-vue";

import type { FormInstance, FormRules } from "element-plus";

const props = defineProps<{
    modelValue: boolean;
}>();

const formRef = ref<FormInstance>();
const formData = reactive<{
    name: string;
    project: {
        name: string;
    }[];
}>({
    name: "",
    project: [{ name: "项目1" }, { name: "项目2" }, { name: "项目3" }],
});
// 管理员姓名验证
const validateName = (_rule: any, value: string, callback: any) => {
    if (value === "") {
        callback(new Error("请填写分类名称"));
    } else if (value.length > 10) {
        callback(new Error("分类名称不能超过10个字符"));
    } else {
        callback();
    }
};
// 手机号验证
const validateProject = (
    _rule: any,
    value: {
        name: string;
    }[],
    callback: any
) => {
    let hasError = false;
    const errors = [];
    console.log("value", value);

    value.forEach((item, index) => {
        if (item.name === "") {
            errors.push(`第 ${index + 1} 个项目不能为空`);
            hasError = true;
        } else if (item.name.length > 10) {
            errors.push(`第 ${index + 1} 个项目不能超过10个字符`);
            hasError = true;
        }
    });

    // 检查重复项
    const values = value.map((item) => item.name).filter(Boolean);
    const uniqueValues = [...new Set(values)];
    if (uniqueValues.length !== values.length) {
        errors.push("项目名称不能重复");
        hasError = true;
    }

    if (hasError) {
        callback(new Error(errors.join("；")));
    } else {
        callback();
    }
};
const rules = reactive<FormRules<typeof formData>>({
    name: [{ validator: validateName, trigger: "blur" }],
    project: [
        {
            validator: validateProject,
            trigger: "submit",
        },
    ],
});
const projectItemRules = [
    { required: true, message: "", trigger: "blur" },
    {
        validator: (_rule: any, value: string, callback: any) => {
            console.log("nameValue", value);
            // 检查重复项
            const values = formData.project
                .map((item) => item.name)
                .filter(Boolean);
            const uniqueValues = [...new Set(values)];
            if (uniqueValues.length !== values.length) {
                callback(new Error(""));
            }
            if (value.length > 10) {
                callback(new Error(""));
            } else {
                callback();
            }
        },
        trigger: "blur",
    },
];

watchEffect(() => {
    if (props.modelValue && formRef.value) {
        formRef.value.clearValidate();
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
        title="添加项目"
        width="680"
        @close="close"
        :close-on-click-modal="false"
        align-center
    >
        <div class="add-project-wrapper">
            <el-form
                class="w400"
                ref="formRef"
                :model="formData"
                :rules="rules"
                label-position="top"
                require-asterisk-position="right"
            >
                <el-form-item required label="分类名称" prop="name">
                    <el-input
                        v-model="formData.name"
                        :model-modifiers="{ trim: true }"
                        :show-word-limit="true"
                        maxlength="10"
                        placeholder="请填写分类名称"
                        autocomplete="off"
                    />
                </el-form-item>
                <el-form-item
                    required
                    label="项目名称"
                    style="margin-bottom: 0"
                >
                    <div
                        v-for="(item, index) in formData.project"
                        :key="index"
                        class="project-item"
                    >
                        <el-form-item
                            :prop="`project.${index}.name`"
                            :rules="projectItemRules"
                            class="inline-form-item"
                        >
                            <el-input
                                v-model="item.name"
                                :model-modifiers="{ trim: true }"
                                :show-word-limit="true"
                                maxlength="10"
                                :placeholder="`请填写项目名称${index + 1}`"
                                autocomplete="off"
                            />
                        </el-form-item>
                        <el-icon v-if="index == 0" class="add" :size="16">
                            <CirclePlus />
                        </el-icon>
                        <el-icon v-else class="delete" :size="16">
                            <Delete />
                        </el-icon>
                    </div>
                </el-form-item>
                <el-form-item prop="project"></el-form-item>
            </el-form>
        </div>
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

<style lang="scss" scoped>
.add-project-wrapper {
    display: flex;
    justify-content: center;
    .project-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .add,
        .delete {
            margin-left: 8px;
            cursor: pointer;
        }
        .add {
            color: var(--el-color-primary);
        }
        .delete {
            color: var(--el-color-danger);
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
