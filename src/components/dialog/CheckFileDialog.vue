<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
    modelValue: boolean;
    data: any;
}>();

const gistName = ref("");
const fileList = ref<{ name: string; fileUrl: string }[]>([]);

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            if (props.data) {
                gistName.value = props.data.name || "";
                fileList.value = props.data.fileList || [];
            }
        }
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();

const close = () => emit("update:modelValue", false);

const viewFile = async (url: string) => {
    window.open(`/pdfPreview?url=${url}`, "_blank");
};
</script>

<template>
    <el-dialog
        :model-value="props.modelValue"
        title="查看文件"
        width="480"
        @close="close"
        :close-on-click-modal="false"
        align-center
        :append-to-body="true"
    >
        <div class="dialog-start-wrapper">
            <p>{{ gistName }}</p>
            <div class="file-list" v-if="fileList && fileList.length > 0">
                <div class="file-item" v-for="(file, index) in fileList" :key="index">
                    <svg class="my-icon" aria-hidden="true">
                        <use xlink:href="#icon-PDF"></use>
                    </svg>
                    <p class="file-name">{{ file.name }}</p>
                    <el-button size="small" @click="viewFile(file.fileUrl)">查看</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss" scoped>
.file-list {
    width: 100%;
    .file-item {
        display: flex;
        align-items: center;
        width: 100%;
        margin-top: 12px;
        line-height: 20px;
        .file-name {
            flex: 1;
            margin-left: 8px;
            margin-right: 12px;
            min-width: 10px;
            /* 超出隐藏  */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
</style>
