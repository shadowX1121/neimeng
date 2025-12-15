<!--删除评估项提示弹窗-->
<script setup lang="ts">
import { ref, watch } from "vue";
import { mockApi } from "@/api/index";
import { assessApi } from "@/api/module/assess";
import { ElMessage } from "element-plus";

const props = defineProps<{
    modelValue: boolean;
    data: {
        id: IdValueType;
    };
}>();
const loading = ref(false);
const count = ref<IdValueType>("");
// 获取统计数据
const getStatistics = async () => {
    if (loading.value) return;
    loading.value = true;
    try {
        const { code, data } = await mockApi.mock(
            {
                id: props.data.id,
            },
            "getStatistics"
        );
        if (code === 200) {
            count.value = 20;
        }
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};
watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            count.value = "";
            getStatistics();
        }
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "confirm", payload?: any): void;
}>();

const close = () => emit("update:modelValue", false);

const submitLoading = ref(false);
const confirmClick = async () => {
    if (submitLoading.value) return; // 二次保险
    submitLoading.value = true;
    try {
        const { code } = await assessApi.deletePlus({
            id: props.data.id,
        });
        if (code === 200) {
            ElMessage.success(`删除成功`);
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
        class="custom-dialog"
        :model-value="props.modelValue"
        title="提示"
        width="480"
        @close="close"
        :close-on-click-modal="false"
        align-center
        :append-to-body="true"
    >
        <div v-loading="loading">
            <div class="dialog-wrapper">
                <p>该项已有{{ count }}个单位减分，删除项后将取消减分，是否确定删除？</p>
            </div>
            <div class="dialog-btn-box">
                <el-button @click="close">取消</el-button>
                <el-button type="danger" :loading="submitLoading" @click="confirmClick">
                    确定
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss" scoped></style>
