<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { Sort, Edit, Delete } from "@element-plus/icons-vue";
// import MySimpleUpload from "@/components/upload/MySimpleUpload.vue";
import EditFileNameDialog from "../dialog/EditFileNameDialog.vue";
import Draggable from "vuedraggable";

interface Props {
    modelValue?: any[];
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
});
const emit = defineEmits(["update:modelValue"]);

const contentList = ref<any[]>([...props.modelValue]);

// 父组件更新 v-model → 子组件同步
watch(
    () => props.modelValue,
    (val) => {
        contentList.value = [...val];
    }
);

// 触发更新
const update = () => emit("update:modelValue", contentList.value);

const editItemDialog = reactive<{
    visible: boolean;
    data: any;
    allData: any[];
    index: number | "";
}>({
    visible: false,
    data: {},
    allData: [],
    index: 0, // 当前编辑项索引
});
// const editFileData = ref<AssessItemMaterialType>({
//     content: "",
//     flag: "0",
// });
// 添加点击事件
const handleAddItem = () => {
    editItemDialog.data = {};
    editItemDialog.allData = [...contentList.value];
    editItemDialog.index = "";
    editItemDialog.visible = true;
};
// 编辑点击事件
const editClick = (index: number) => {
    editItemDialog.data = contentList.value[index];
    editItemDialog.allData = [...contentList.value];
    editItemDialog.index = index;
    editItemDialog.visible = true;
    console.log("editItemDialog", editItemDialog);
};
// 编辑完成回调函数
const editNameConfirm = (itemData: any) => {
    if (editItemDialog.index === "") {
        // 新增
        contentList.value.push(itemData);
    } else {
        // 编辑
        contentList.value.forEach((item, index) => {
            if (index === editItemDialog.index) {
                item.content = itemData.content;
                item.flag = itemData.flag;
            }
        });
    }
    update();
};
// 删除点击事件
const deleteClick = (index: number) => {
    contentList.value.splice(index, 1);
    update();
};
</script>

<template>
    <div>
        <!-- <MySimpleUpload v-model="contentList" @change="update" /> -->
        <el-button size="small" type="primary" @click="handleAddItem">点击添加</el-button>
        <draggable
            class="file-list"
            v-model="contentList"
            item-key="content"
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
                        <p v-if="element.flag === '1'" class="is-base triangle-border"></p>
                        <p class="file-name">{{ element.content }}</p>
                        <!-- <p class="file-status">
                            <el-icon v-if="element.status === 'success'" color="#009F4D" size="16">
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
                        </p> -->
                    </div>
                    <el-button link :icon="Edit" @click="editClick(index)"></el-button>
                    <el-button link :icon="Delete" @click="deleteClick(index)"></el-button>
                </div>
            </template>
        </draggable>
        <!--编辑添加实证材料弹窗-->
        <EditFileNameDialog
            v-model="editItemDialog.visible"
            :data="editItemDialog.data"
            :all-data="editItemDialog.allData"
            :index="editItemDialog.index"
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
