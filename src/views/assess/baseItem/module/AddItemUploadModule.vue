<script setup lang="ts">
import { ref, watch } from "vue";
import {
    Sort,
    Edit,
    Delete,
    CircleCheck,
    CircleClose,
    Loading,
} from "@element-plus/icons-vue";
import MySimpleUpload from "@/components/upload/MySimpleUpload.vue";
import EditFileNameDialog from "../dialog/EditFileNameDialog.vue";
import Draggable from "vuedraggable";

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

const editFileNameDialogVisible = ref(false);
const editFileData = ref<AssessItemMaterialType>({
    name: "",
    fileUrl: "",
    isBase: false,
});
// 编辑点击事件
const editClick = (index: number) => {
    editFileNameDialogVisible.value = true;
    editFileData.value = fileList.value[index];
};
// 编辑完成回调函数
const editNameConfirm = (itemData: any) => {
    fileList.value.forEach((item) => {
        if (itemData.fileUrl === item.fileUrl) {
            item.name = itemData.name;
            item.isBase = itemData.isBase;
        }
    });
    update();
};
// 删除点击事件
const deleteClick = (index: number) => {
    fileList.value.splice(index, 1);
    update();
};
</script>

<template>
    <div>
        <MySimpleUpload v-model="fileList" @change="update" />
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
                        <p
                            v-if="element.isBase"
                            class="is-base triangle-border"
                        ></p>
                        <p class="file-name">{{ element.name }}</p>
                        <p class="file-status">
                            <el-icon
                                v-if="element.status === 'success'"
                                color="#009F4D"
                                size="16"
                            >
                                <CircleCheck />
                            </el-icon>
                            <el-icon
                                v-else-if="element.status === 'error'"
                                color="#f56c6c"
                                size="16"
                            >
                                <CircleClose />
                            </el-icon>
                            <el-icon v-else size="16" class="spinner">
                                <Loading />
                            </el-icon>
                        </p>
                    </div>
                    <el-button
                        link
                        :icon="Edit"
                        :disabled="element.status !== 'success'"
                        @click="editClick(index)"
                    ></el-button>
                    <el-button
                        link
                        :icon="Delete"
                        :disabled="element.status !== 'success'"
                        @click="deleteClick(index)"
                    ></el-button>
                </div>
            </template>
        </draggable>
        <!--编辑添加实证材料弹窗-->
        <EditFileNameDialog
            v-model="editFileNameDialogVisible"
            :data="editFileData"
            @confirm="editNameConfirm"
        />
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
        .file-name {
            flex: 1;
            min-width: 0;
            margin-right: 12px;
        }
        .file-status {
            display: flex;
            align-items: center;
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
        .spinner {
            animation: spin 1.5s linear infinite;
            will-change: transform;
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
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    }
}
</style>
