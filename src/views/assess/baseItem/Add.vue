<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { assessApi } from "@/api/module/assess";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useAssessStore } from "@/store/useAssessStore";
import AddItemUploadModule from "./module/AddItemUploadModule.vue";
import { storeToRefs } from "pinia";
import cloneDeep from "lodash-es/cloneDeep";

import type { FormInstance, FormRules } from "element-plus";

const router = useRouter();
const route = useRoute();
const assessStore = useAssessStore();

const id = computed(() => route.query.id || "");

const formRef = ref<FormInstance>();
const formData = reactive<AssessItemType>({
    classifyId: "",
    evaluateId: "",
    evaluate_detail_name: "",
    evaluate_points: "",
    detail_info: [],
});
const classifyOptions = assessStore.classifyList;

const { assessData } = storeToRefs(assessStore);
const initData = () => {
    if (route.query.id && assessData.value.length > 0) {
        // 初始化页面数据
        formData.classifyId = assessStore.getClassifyByItemId(route.query.id as string);
        console.log("formData.classifyId", formData.classifyId);

        formData.evaluateId = assessStore.getProjectIdByItemId(route.query.id as string);
        const itemInfo = assessStore.getAssessItemInfo(route.query.id as string);
        if (itemInfo) {
            const cloneData = cloneDeep(itemInfo);
            formData.evaluate_detail_name = cloneData.evaluate_detail_name;
            formData.evaluate_points = cloneData.evaluate_points;
            formData.detail_info = cloneData.detail_info.map((content) => ({
                ...content,
            }));
        }
    }
};
watch(
    () => assessData.value,
    () => {
        initData();
    },
    { immediate: true, deep: true }
);
watch(
    () => id.value,
    () => {
        initData();
    },
    { immediate: true }
);

// 分类改变事件
const handleClassifyChange = () => {
    formData.evaluateId = "";
};
const projectOptions = ref<LabelOption[]>([]);

watch(
    () => formData.classifyId,
    (newVal) => {
        if (newVal) {
            projectOptions.value = assessStore.getProjectList(formData.classifyId);
        }
    },
    { immediate: true }
);
const rules = reactive<FormRules<typeof formData>>({
    classifyId: [{ required: true, message: "请选择所属分类", trigger: "change" }],
    evaluateId: [{ required: true, message: "请选择所属项目", trigger: "change" }],
    evaluate_detail_name: [
        { required: true, message: "请输入评估项名称", trigger: "blur" },
        {
            min: 1,
            max: 20,
            message: "评估项名称不得超过20个字符",
            trigger: "blur",
        },
    ],
    evaluate_points: [
        { required: true, message: "请输入评估要点", trigger: "blur" },
        {
            min: 1,
            max: 100,
            message: "评估要点不得超过100个字符",
            trigger: "blur",
        },
    ],
    detail_info: [
        {
            validator: (_rule: any, value: Array<any>, callback: any) => {
                if (value.length === 0) {
                    callback(new Error("请至少添加一个实证材料"));
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
        let params: any = {
            evaluate_project_id: formData.evaluateId,
            evaluate_detail_name: formData.evaluate_detail_name,
            evaluate_points: formData.evaluate_points,
            detail_info: JSON.stringify(formData.detail_info),
        };
        if (id.value) {
            params.id = id.value;
        }
        const { code } = await assessApi.addEvaluateDetail(params);
        if (code === 200) {
            ElMessage.success(id.value ? `添加成功` : `修改成功`);
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
            <span class="title">{{ id ? "修改" : "添加" }}评估项</span>
        </div>
        <div class="main-content detail-content">
            <div class="base-item-add-page">
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
                    <el-form-item required label="所属项目" prop="evaluateId">
                        <el-select
                            class="w400"
                            v-model="formData.evaluateId"
                            :disabled="!formData.classifyId"
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
                    <el-form-item required label="评估项名称" prop="evaluate_detail_name">
                        <el-input
                            v-model="formData.evaluate_detail_name"
                            :model-modifiers="{ trim: true }"
                            :show-word-limit="true"
                            maxlength="20"
                            placeholder="请输入评估项名称"
                            autocomplete="off"
                        />
                    </el-form-item>
                    <el-form-item required label="评估要点" prop="evaluate_points">
                        <el-input
                            v-model="formData.evaluate_points"
                            :model-modifiers="{ trim: true }"
                            :show-word-limit="true"
                            :autosize="{ minRows: 4, maxRows: 6 }"
                            type="textarea"
                            maxlength="100"
                            placeholder="请输入评估要点"
                            autocomplete="off"
                        />
                    </el-form-item>
                    <el-form-item required label="实证材料" prop="detail_info">
                        <AddItemUploadModule v-model="formData.detail_info" />
                    </el-form-item>
                    <el-form-item style="margin-top: 48px" class="button-form-item">
                        <el-button type="primary" :loading="submitLoading" @click="onSubmit">
                            确定
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.base-item-add-page {
    margin-top: 40px;
}
</style>
