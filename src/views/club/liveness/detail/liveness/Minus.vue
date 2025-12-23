<!--活跃度评估的减分项目表格模块-->
<script setup lang="ts">
import { ref, reactive, watch, inject } from "vue";
import { assessApi } from "@/api/index";
import CheckFileDialog from "@/components/dialog/CheckFileDialog.vue";

const notifyRefresh = inject<() => void>("notifyRefresh");

const props = defineProps<{
    data: any;
}>();

const loading = ref(false);
const moduleData = ref<any>();
watch(
    () => props.data,
    (newVal) => {
        moduleData.value = {
            ...newVal,
            list: newVal.list
                .filter((item: any) => item.fileInfo && item.fileInfo.length > 0)
                .map((listItem: any) => {
                    return {
                        ...listItem,
                        fileInfo: listItem.fileInfo.map((fileItem: any) => {
                            return {
                                name: fileItem.file_name,
                                fileUrl: fileItem.file_url,
                            };
                        }),
                    };
                }),
        };
    },
    { deep: true, immediate: true }
);

const viewFileDialog = reactive<{
    visible: boolean;
    data: any;
}>({
    visible: false,
    data: {},
});
// 查看文件点击事件
const handleViewFile = async (data: any) => {
    const { fileInfo } = data;
    if (fileInfo && fileInfo.length > 0) {
        if (fileInfo.length === 1) {
            const url = fileInfo[0].fileUrl;
            window.open(`/pdfPreview?url=${url}`, "_blank");
        } else {
            viewFileDialog.data = {
                name: data.content,
                fileList: fileInfo,
            };
            viewFileDialog.visible = true;
        }
    } else {
        console.error("未找到文件");
    }
};
</script>

<template>
    <div v-loading="loading">
        <el-empty v-if="moduleData.list.length === 0" description="暂无数据" />
        <template v-else>
            <el-table class="assess-project-table" :data="moduleData.list" style="width: 100%">
                <el-table-column label="序号" type="index" align="center" width="80" />
                <el-table-column
                    label="实证材料（项）"
                    prop="content"
                    align="center"
                    min-width="200"
                />
                <el-table-column label="减分" align="center" width="100">
                    <template #default>
                        <span>-3</span>
                    </template>
                </el-table-column>
                <el-table-column label="文件" align="center" width="100">
                    <template #default="{ row }">
                        <el-button
                            v-if="row.fileInfo.length > 0"
                            type="primary"
                            link
                            @click="handleViewFile(row)"
                        >
                            查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <!--查看文件弹窗-->
        <CheckFileDialog v-model="viewFileDialog.visible" :data="viewFileDialog.data" />
    </div>
</template>

<style lang="scss" scoped>
.file-box {
    display: flex;
    justify-content: center;
}
.upload-box {
    display: flex;
    align-items: center;
    cursor: pointer;
}
.upload-status {
    position: absolute;
    width: 32px;
    height: 32px;
    right: 0;
    top: 0;
    .triangle {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        clip-path: polygon(100% 0, 100% 100%, 0 0);
        cursor: pointer;
        z-index: 1;
        background-color: #009f4d;
        .el-icon {
            position: absolute;
            right: 2px;
            top: 4px;
            color: #fff;
        }
    }
}
</style>
