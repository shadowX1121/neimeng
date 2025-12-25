<!--活跃度评估的减分项目表格模块-->
<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import CheckFileDialog from "@/components/dialog/CheckFileDialog.vue";

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
                                fileUrl: fileItem.file_path,
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
    console.log(fileInfo);
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

<style lang="scss" scoped></style>
