<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect } from "vue";
import { mockApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { CirclePlus, Delete } from "@element-plus/icons-vue";
import { useAssessStore } from "@/store/useAssessStore";
import cloneDeep from "lodash-es/cloneDeep";

import type { FormInstance, FormRules } from "element-plus";

const assessStore = useAssessStore();

const props = defineProps<{
    modelValue: boolean;
}>();

const loading = ref(false);
const classifyData = assessStore.assessData;

const defaultActive = ref();
// 菜单选择事件
const menuSelect = (index: string) => {
    console.log("选择的菜单项：", index);
    defaultActive.value = index;
};
const formRef = ref<FormInstance>();
const formData = ref<AssessClassifyType>({
    name: "",
    project: [],
});
watch(
    () => defaultActive.value,
    (newVal) => {
        if (newVal) {
            const findItem = classifyData.find((item) => item.id === newVal);
            if (findItem) {
                formData.value = cloneDeep(findItem);
                if (formData.value.project.length === 0) {
                    formData.value.project.push({ name: "" });
                }
                if (formRef.value) {
                    formRef.value.resetFields();
                    errorList.value = [];
                }
            }
        } else {
            ElMessage.error("暂无该分类");
        }
    }
);
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
            const values = formData.value.project
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
        },
        trigger: "submit",
    },
];

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            if (classifyData.length > 0) {
                defaultActive.value = classifyData[0]?.id;
            }
            errorList.value = [];
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
    if (formData.value.project.length >= 10) {
        ElMessage.warning("最多添加10个项目");
        return;
    }
    formData.value.project.push({
        name: "",
    });
};
// 删除项目点击事件
const deleteProject = (index: number) => {
    formData.value.project.splice(index, 1);
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
        class="no-padding-bottom-dialog"
        body-class="no-padding-dialog-body"
        :model-value="props.modelValue"
        title="管理项目"
        width="720"
        @close="close"
        :close-on-click-modal="false"
        align-center
    >
        <div v-loading="loading" class="edit-project-tab-box">
            <div class="edit-project-menu">
                <el-menu class="my-menu" :default-active="defaultActive" @select="menuSelect">
                    <el-menu-item
                        v-for="menu in classifyData"
                        :key="menu.id"
                        class="no-child-menu"
                        :index="menu.id"
                    >
                        <span>{{ menu.name }}</span>
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="edit-project-wrapper">
                <el-form
                    class="w480"
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
                    <el-form-item required label="项目名称" style="margin-bottom: 0">
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
                            <el-icon v-if="index == 0" class="add" :size="16" @click="addProject">
                                <CirclePlus />
                            </el-icon>
                            <el-icon v-else class="delete" :size="16" @click="deleteProject(index)">
                                <Delete />
                            </el-icon>
                        </div>
                    </el-form-item>
                    <el-form-item :error="projectError"></el-form-item>
                </el-form>
                <div class="edit-project-btn-box">
                    <el-button type="primary" @click="confirmClick" :loading="submitLoading">
                        确定
                    </el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss" scoped>
.my-menu {
    --el-menu-base-level-padding: 12px;
    --el-menu-level-padding: 12px;
    --el-menu-item-height: 40px;
    --el-menu-border-color: #ebeef5;
    --el-menu-text-color: #000000;
    --el-menu-hover-bg-color: transparent;
    --el-menu-bg-color: transparent;
    --el-menu-sub-item-height: var(--el-menu-item-height);
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background-color: #f6f9fb;
    border-radius: 0 0 0 4px;
    :deep(.el-sub-menu) {
        + .el-sub-menu,
        + .no-child-menu {
            margin-top: 8px;
        }
        .el-sub-menu__icon-arrow {
            right: 0;
        }
    }
    :deep(.el-menu-item) {
        height: auto;
        line-height: 20px;
        padding: 10px 24px !important;
        white-space: normal !important;
        word-break: break-all;
        border-bottom: 1px solid #f6f9fb;
        + .el-menu-item {
            margin-top: 4px;
            border-top: 1px solid #f6f9fb;
        }
        &.is-active {
            background: #ffffff;
            border-color: #ebeef5;
        }
    }
}
.edit-project-tab-box {
    display: flex;
    .edit-project-menu {
        width: 132px;
        flex-shrink: 0;
    }
    .edit-project-wrapper {
        flex: 1;
    }
}
.edit-project-wrapper {
    padding: 24px;
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
    .edit-project-btn-box {
        margin-top: 48px;
        text-align: right;
    }
}
</style>
