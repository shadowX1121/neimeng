<!--针对plus类型的创建下载弹窗-->
<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { userApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { flyTo } from "@/utils/flyTo";

const props = defineProps<{
    modelValue: boolean;
    data: any;
    other?: any;
}>();

const loading = ref(false);
const assessItems = ref<any>([]);

const checkAll = ref(false);
const isIndeterminate = ref(false);
const checkAllDisabled = computed(() => {
    return assessItems.value.every((item: any) => item.disabled);
});
const checkedList = ref([]);
const allList = computed(() => {
    return assessItems.value.filter((item: any) => !item.disabled).map((child: any) => child.id);
});
// 全选状态改变事件
const handleCheckAllChange = (val: boolean) => {
    // 修改本项的状态
    isIndeterminate.value = false;
    checkedList.value = val ? allList.value : [];
};
// 子项选中状态改变事件
const handleGroupChange = (val: any[]) => {
    console.log("val", val);
    // 修改全局全选状态
    isIndeterminate.value =
        checkedList.value.length > 0 && checkedList.value.length < allList.value.length;
    checkAll.value = checkedList.value.length === allList.value.length;
};

// 获取某些的disabled状态
const getDisabled = (item: any) => {
    return !(item && item.fileInfo && item.fileInfo.length > 0);
};

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            checkAll.value = false;
            isIndeterminate.value = false;
            if (props.data && props.data.id) {
                assessItems.value =
                    props.data.list && props.data.list.length > 0
                        ? props.data.list.map((item: any) => {
                              return {
                                  id: item.id,
                                  name: item.content,
                                  disabled: getDisabled(item),
                              };
                          })
                        : [];
            } else {
                assessItems.value = [];
            }
        }
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "confirm", payload?: any): void;
}>();

const close = () => emit("update:modelValue", false);

const submitLoading = ref(false);
const confirmClick = async (event: Event) => {
    if (checkAllDisabled.value) {
        ElMessage.warning(`没有可下载的选项`);
        return;
    }
    if (checkedList.value.length === 0) {
        ElMessage.warning(`请勾选要下载的选项`);
        return;
    }
    if (submitLoading.value) return; // 二次保险
    submitLoading.value = true;
    try {
        const { code } = await userApi.createDownload({
            ...props.other,
            project_ids: JSON.stringify(
                checkedList.value.map((item: any) => {
                    return {
                        id: item,
                    };
                })
            ),
        });
        if (code === 200) {
            ElMessage.success(`下载任务创建成功`);
            close();
            flyTo({
                from: event.target as HTMLElement,
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        submitLoading.value = false;
    }
};
</script>

<template>
    <el-dialog
        class="custom-dialog"
        :model-value="props.modelValue"
        title="创建下载任务"
        width="480"
        @close="close"
        :close-on-click-modal="false"
        align-center
        :append-to-body="true"
    >
        <div v-loading="loading">
            <div class="dialog-wrapper">
                <div v-if="assessItems.length > 0" style="width: 100%">
                    <el-checkbox
                        v-model="checkAll"
                        :indeterminate="isIndeterminate"
                        :disabled="checkAllDisabled"
                        @change="handleCheckAllChange"
                    >
                        全选
                    </el-checkbox>
                    <div class="download-content">
                        <div class="group-item">
                            <el-checkbox-group
                                v-model="checkedList"
                                @change="(val: any[]) => handleGroupChange(val)"
                            >
                                <el-checkbox
                                    v-for="item in assessItems"
                                    :key="item.id"
                                    :label="item.id"
                                    :disabled="item.disabled"
                                >
                                    {{ item.name }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
                <el-empty
                    v-else
                    class="flex justify-content-center"
                    :image-size="80"
                    description="暂无可下载的项"
                />
            </div>
            <div class="dialog-btn-box">
                <el-button type="primary" :loading="submitLoading" @click="confirmClick">
                    确定
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss" scoped>
.download-content {
    .group-item {
        padding: 0 16px;
        margin-top: 12px;
        background: #f6f9fb;
        border-radius: 4px 4px 4px 4px;
        .group-item-check-all {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid #ebeef5;
        }
        :deep(.el-checkbox-group) {
            padding: 6px 0;
            .el-checkbox {
                margin-top: 6px;
                margin-bottom: 6px;
            }
        }
        &:nth-child(1) {
            margin-top: 8px;
        }
    }
}
</style>
