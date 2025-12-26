<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useAccountStatus } from "@/utils/useOptions";
import { institutionApi } from "@/api/index";
import { ElMessage } from "element-plus";

const props = defineProps<{
    modelValue: boolean;
    status: number;
    accountId: string | number;
}>();

const status = ref(props.status);
const accountStatus = useAccountStatus();
const options = ref(accountStatus.options);
watchEffect(() => {
    if (props.modelValue) status.value = props.status;
});

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "confirm", payload?: any): Promise<ResponseData<any>>;
}>();

const close = () => emit("update:modelValue", false);

const submitLoading = ref(false);
const confirm = async () => {
    if (submitLoading.value) return; // 二次保险
    submitLoading.value = true;
    try {
        const { code } = await institutionApi.updateStatus({
            institution_id: props.accountId,
            account_status: status.value,
        });
        if (code === 200) {
            ElMessage.success(`修改成功`);
            close();
            emit("confirm", { status: status.value });
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
        title="修改账号状态"
        width="500"
        @close="close"
        :close-on-click-modal="false"
        align-center
    >
        <el-radio-group class="status-group" v-model="status">
            <el-radio v-for="item in options" :key="item.value" :value="item.value">
                <span class="label">{{ item.label }}</span>
                <span class="description">{{ item.description }}</span>
            </el-radio>
        </el-radio-group>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" :loading="submitLoading" @click="confirm">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.status-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .label {
        font-weight: 500;
        color: #000000;
        margin-right: 16px;
    }
    :deep(.el-radio__input.is-checked) {
        + .el-radio__label {
            color: var(--el-radio-text-color);
        }
    }
}
</style>
