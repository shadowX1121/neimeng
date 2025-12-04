<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect } from "vue";
import { mockApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { CirclePlus, Delete } from "@element-plus/icons-vue";

import type { FormInstance, FormRules } from "element-plus";

const props = defineProps<{
    modelValue: boolean;
}>();

const formRef = ref<FormInstance>();
const formData = reactive<{
    name: "";
    project: { name: string }[];
}>({
    name: "",
    project: [],
});
const errorList = ref<string[]>([]);
const projectError = computed(() => {
    let text = "";
    const uniqueValues = [...new Set(errorList.value)].sort();
    switch (uniqueValues.length) {
        case 1:
            const value = uniqueValues[0];
            if (value === "1") {
                text = "项目名称不能为空";
            } else if (value === "2") {
                text = "项目名称长度不能大于10个字符";
            } else {
                text = "项目名称不能重复";
            }
            break;
        case 2:
            if (["1", "2"].every((v) => uniqueValues.includes(v))) {
                text = "项目名称不能为空，且长度不能大于10个字符";
            } else if (["1", "3"].every((v) => uniqueValues.includes(v))) {
                text = "项目名称不能为空，且不能重复";
            } else if (["2", "3"].every((v) => uniqueValues.includes(v))) {
                text = "项目名称长度不能大于10个字符，且不能重复";
            }
            break;
        case 3:
            text = "项目名称不能为空，长度不能大于10个字符，且不能重复";
            break;
        default:
            text = "";
    }
    return text;
});
const rules = reactive<FormRules<typeof formData>>({
    name: [
        { required: true, message: "请填写分类名称", trigger: "blur" },
        // 你还可以加更多规则
        {
            min: 1,
            max: 10,
            message: "分类名称长度不能超过 10 个字符",
            trigger: "blur",
        },
    ],
});
const projectItemRules = [
    {
        validator: (rule: any, value: string, callback: any) => {
            const reg = /^project\.(\d+)\.name$/;
            const currentIndex = rule.field.match(reg)[1];
            // 检查重复项
            const values = formData.project
                .filter((_item, index) => index < Number(currentIndex))
                .map((item) => item.name)
                .filter(Boolean);
            const uniqueValues = [...new Set(values)];
            if (value === "") {
                errorList.value.push("1");
                callback(new Error(""));
            } else if (value.length > 10) {
                errorList.value.push("2");
                callback(new Error(""));
            } else if (uniqueValues.includes(value)) {
                errorList.value.push("3");
                callback(new Error(""));
            } else {
                callback();
            }
            // }
        },
        trigger: "submit",
    },
];

watch(
    () => props.modelValue,
    (newVal, _oldVal) => {
        if (newVal) {
            errorList.value = [];
            formData.project = [{ name: "" }];
        }
    }
);

watchEffect(() => {
    if (props.modelValue && formRef.value) {
        formRef.value.clearValidate();
    }
});

// 添加项目点击事件
const addProject = () => {
    if (formData.project.length >= 10) {
        ElMessage.warning("最多添加10个项目");
        return;
    }
    formData.project.push({
        name: "",
    });
};
// 删除项目点击事件
const deleteProject = (index: number) => {
    formData.project.splice(index, 1);
};

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "confirm", payload?: any): Promise<ResponseData<any>>;
}>();

const close = () => emit("update:modelValue", false);

const submitLoading = ref(false);
const confirmClick = async () => {
    errorList.value = [];
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
            ElMessage.success(`添加成功`);
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
                <el-form-item label="分类名称" prop="name">
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
                        <el-icon
                            v-if="index == 0"
                            class="add"
                            :size="16"
                            @click="addProject"
                        >
                            <CirclePlus />
                        </el-icon>
                        <el-icon
                            v-else
                            class="delete"
                            :size="16"
                            @click="deleteProject(index)"
                        >
                            <Delete />
                        </el-icon>
                    </div>
                </el-form-item>
                <el-form-item :error="projectError"></el-form-item>
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
