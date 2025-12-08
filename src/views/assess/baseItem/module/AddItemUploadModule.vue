<script setup lang="ts">
import { ref, watch } from "vue";
import { Sort, Edit, Delete } from "@element-plus/icons-vue";
import MySimpleUpload from "@/components/upload/MySimpleUpload.vue";
import draggable from "vuedraggable";

interface Props {
    modelValue?: any[];
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
});
const emit = defineEmits(["update:modelValue"]);

const fileList = ref<any[]>([...props.modelValue]);

// 父组件更新 v-model → 子组件同步
watch(
    () => props.modelValue,
    (val) => {
        fileList.value = [...val];
    }
);

// 触发更新
const update = () => emit("update:modelValue", fileList.value);
</script>

<template>
    <div>
        <MySimpleUpload v-model="fileList" />
        <draggable
            class="file-list"
            v-model="fileList"
            item-key="name"
            handle=".drag-handle"
            @end="update"
        >
            <template #item="{ element, index }">
                <div class="file-item">
                    <div class="left-content">
                        <p class="drag-handle">
                            <el-icon><Sort /></el-icon>
                        </p>
                        <p class="index">{{ index + 1 }}</p>
                    </div>
                    <div class="file-content">
                        <p class="is-base triangle-border"></p>
                        <p class="file-name">{{ element.name }}</p>
                        <p class="file-status">{{ element.success }}</p>
                    </div>
                    <el-button link :icon="Edit"></el-button>
                    <el-button link :icon="Delete"></el-button>
                </div>
            </template>
        </draggable>
    </div>
</template>

<style lang="scss" scoped>
.file-list {
    position: relative;
    left: -60px;
    .file-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 4px;
        .drag-handle {
            cursor: move;
        }
        .is-base {
            margin-right: 6px;
        }
        .left-content {
            display: flex;
            align-items: center;
            width: 60px;
        }
        .index {
            width: 20px;
            text-align: center;
            margin: 0 12px;
        }
        .file-content {
            display: flex;
            align-items: center;
            width: 400px;
            padding: 4px 8px;
            background: #f6f9fb;
            line-height: 22px;
            border-radius: 6px;
        }
        .el-button {
            margin-left: 12px;
            font-size: 16px;
        }
    }
}
</style>
