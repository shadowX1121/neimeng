<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { mockApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { flyTo } from "@/utils/flyTo";

const props = defineProps<{
    modelValue: boolean;
    data: any;
}>();

const loading = ref(false);
const assessItems = ref<any>([]);

const checkAll = ref(false);
const isIndeterminate = ref(false);
const checkAllDisabled = computed(() => {
    return assessItems.value.every((item: any) => item.disabled);
});
const checkedList = computed(() => {
    return assessItems.value.flatMap((item: any) => item.checkedList);
});
const allList = computed(() => {
    return assessItems.value
        .flatMap((item: any) => item.children || [])
        .filter((item: any) => !item.disabled)
        .map((child: any) => child.id);
});
// 全选状态改变事件
const handleCheckAllChange = (val: boolean) => {
    // 修改本项的状态
    isIndeterminate.value = false;
    // 修改所有项的状态
    assessItems.value.forEach((item: any) => {
        item.isIndeterminate = false;
        if (!item.disabled) {
            item.checkAll = val;
        }
        item.checkedList = val
            ? item.children.filter((child: any) => !child.disabled).map((child: any) => child.id)
            : [];
    });
};

// 子项全选状态改变事件
const handleItemCheckAllChange = (val: boolean, item: any) => {
    // 修改本组选项的状态
    item.checkedList = val
        ? item.children.filter((child: any) => !child.disabled).map((child: any) => child.id)
        : [];
    item.isIndeterminate = false;
    // 修改全局全选状态
    isIndeterminate.value =
        checkedList.value.length > 0 && checkedList.value.length < allList.value.length;
    checkAll.value = checkedList.value.length === allList.value.length;
};
// 子项选中状态改变事件
const handleItemGroupChange = (val: any[], item: any) => {
    const canCheckedIdList = item.children
        .filter((child: any) => !child.disabled)
        .map((child: any) => child.id);
    // 修改本组全选状态
    item.isIndeterminate = val.length > 0 && val.length < canCheckedIdList.length;
    item.checkAll = val.length === canCheckedIdList.length;
    // 修改全局全选状态
    isIndeterminate.value =
        checkedList.value.length > 0 && checkedList.value.length < allList.value.length;
    checkAll.value = checkedList.value.length === allList.value.length;
};

// 获取某些的disabled状态
const getDisabled = (item: any) => {
    const fileList = item.detail_info?.flatMap((item: any) => item.fileInfo);
    return !(fileList && fileList.length > 0);
};

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            checkAll.value = false;
            isIndeterminate.value = false;
            if (props.data && props.data.id) {
                assessItems.value =
                    props.data.project_info && props.data.project_info.length > 0
                        ? props.data.project_info
                              .filter(
                                  (item: any) =>
                                      item.project_detail && item.project_detail.length > 0
                              )
                              .map((item: any) => {
                                  return {
                                      id: item.id,
                                      name: item.evaluate_project_name,
                                      checkAll: false,
                                      indeterminate: false,
                                      checkedList: [],
                                      children:
                                          item.project_detail && item.project_detail.length > 0
                                              ? item.project_detail.map((child: any) => {
                                                    return {
                                                        id: child.id,
                                                        name: child.evaluate_detail_name,
                                                        disabled: getDisabled(child),
                                                    };
                                                })
                                              : [],
                                  };
                              })
                              .map((item: any) => {
                                  if (item.children.some((child: any) => !child.disabled)) {
                                      item.disabled = false;
                                  } else {
                                      item.disabled = true;
                                  }
                                  return item;
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
        const { code } = await mockApi.mock(
            {
                ids: checkedList.value,
            },
            null
        );
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
                        <div class="group-item" v-for="item in assessItems" :key="item.id">
                            <div class="group-item-check-all">
                                <el-checkbox
                                    v-model="item.checkAll"
                                    :indeterminate="item.isIndeterminate"
                                    :disabled="item.disabled"
                                    @change="(val: any) => handleItemCheckAllChange(val, item)"
                                >
                                    {{ item.name }}
                                </el-checkbox>
                            </div>
                            <el-checkbox-group
                                v-model="item.checkedList"
                                @change="(val: any[]) => handleItemGroupChange(val, item)"
                            >
                                <el-checkbox
                                    v-for="itemChild in item.children"
                                    :key="itemChild.id"
                                    :label="itemChild.id"
                                    :disabled="itemChild.disabled"
                                >
                                    {{ itemChild.name }}
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
