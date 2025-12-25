<!--删除评估要点提示弹窗-->
<script setup lang="ts">
import { ref, watch } from "vue";
import { assessApi } from "@/api/index";
import { ElMessage } from "element-plus";

const props = defineProps<{
    modelValue: boolean;
    data: any;
}>();
const loading = ref(false);
const count = ref<IdValueType>("");
// 获取统计数据
const getStatistics = async () => {
    if (loading.value) return;
    loading.value = true;
    try {
        const { code, data } = await assessApi.getHasUploadFileAccountCount({
            content_id: props.data.id,
            type: 4,
        });
        if (code === 200) {
            count.value = data.count || 0;
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};
watch(
    () => props.modelValue,
    (newVal, _oldVal) => {
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
        const { code } = await assessApi.deleteEvaluateDetailInfo({
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
            <div class="delete-tip-wrapper">
                <p>
                    该项已有{{
                        count
                    }}个单位上传实证材料，删除项后将无法恢复已上传材料，是否确定删除？
                </p>
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

<style lang="scss" scoped>
.delete-tip-wrapper {
    display: flex;
    justify-content: center;
    color: #000000;
}
</style>
