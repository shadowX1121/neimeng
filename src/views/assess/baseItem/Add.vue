<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { mockApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useAssessStore } from "@/store/useAssessStore";
import AddItemUploadModule from "./module/AddItemUploadModule.vue";

import type { FormInstance, FormRules } from "element-plus";

const router = useRouter();
const assessStore = useAssessStore();

const formRef = ref<FormInstance>();
const formData = reactive<AssessItemType>({
    classifyId: "",
    projectId: "",
    name: "",
    gist: "",
    file: [],
});
const classifyOptions = assessStore.classifyList;
// 分类改变事件
const handleClassifyChange = () => {
    formData.projectId = "";
    projectOptions.value = assessStore.getProjectList(formData.classifyId);
};
const projectOptions = ref<LabelOption[]>([]);
const rules = reactive<FormRules<typeof formData>>({
    classifyId: [
        { required: true, message: "请选择所属分类", trigger: "blur" },
    ],
    projectId: [{ required: true, message: "请选择所属项目", trigger: "blur" }],
    name: [
        { required: true, message: "请输入评估项名称", trigger: "blur" },
        {
            min: 1,
            max: 20,
            message: "评估项名称不得超过20个字符",
            trigger: "blur",
        },
    ],
    gist: [
        { required: true, message: "请输入评估要点", trigger: "blur" },
        {
            min: 1,
            max: 100,
            message: "评估要点不得超过100个字符",
            trigger: "blur",
        },
    ],
    file: [
        {
            validator: (_rule: any, value: Array<any>, callback: any) => {
                if (value.length === 0) {
                    callback(new Error("请至少上传一个实证材料"));
                } else {
                    callback();
                }
            },
            trigger: "change",
        },
    ],
});
const submitLoading = ref(false);

// 提交按钮点击事件
const onSubmit = async () => {
    if (!formRef.value) return;
    formRef.value.validate((valid, fields) => {
        if (valid) {
            submit();
        } else {
            console.log("error submit!", fields);
        }
    });
};
// 提交
const submit = async () => {
    if (submitLoading.value) return; // 二次保险
    submitLoading.value = true;
    try {
        const { code } = await mockApi.mock(formData, null);
        if (code === 200) {
            ElMessage.success(`添加成功`);
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
                    <el-form-item required label="所属分类" prop="classifyId">
                        <el-select
                            class="w400"
                            v-model="formData.classifyId"
                            placeholder="请选择所属分类"
                            @change="handleClassifyChange"
                        >
                            <el-option
                                v-for="item in classifyOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item required label="所属项目" prop="projectId">
                        <el-select
                            class="w400"
                            v-model="formData.projectId"
                            placeholder="请选择所属项目"
                        >
                            <el-option
                                v-for="item in projectOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item required label="评估项名称" prop="name">
                        <el-input
                            v-model="formData.name"
                            :model-modifiers="{ trim: true }"
                            :show-word-limit="true"
                            maxlength="20"
                            placeholder="请输入评估项名称"
                            autocomplete="off"
                        />
                    </el-form-item>
                    <el-form-item required label="评估要点" prop="gist">
                        <el-input
                            v-model="formData.gist"
                            :model-modifiers="{ trim: true }"
                            :show-word-limit="true"
                            :autosize="{ minRows: 4, maxRows: 6 }"
                            type="textarea"
                            maxlength="100"
                            placeholder="请输入评估要点"
                            autocomplete="off"
                        />
                    </el-form-item>
                    <el-form-item required label="实证材料" prop="file">
                        <AddItemUploadModule v-model="formData.file" />
                    </el-form-item>
                    <el-form-item
                        style="margin-top: 48px"
                        class="button-form-item"
                    >
                        <el-button
                            type="primary"
                            :loading="submitLoading"
                            @click="onSubmit"
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
