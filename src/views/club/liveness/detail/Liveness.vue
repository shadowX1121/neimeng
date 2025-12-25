<script setup lang="ts">
import { ref, reactive, onMounted, provide } from "vue";
import { assessApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { CaretBottom } from "@element-plus/icons-vue";
import { YEAR_OPTIONS, CURRENT_YEAR, PLUS_OPTIONS } from "@/constants/index";
import Base from "./liveness/Base.vue";
import PlusTable from "./liveness/Plus.vue";
import MinusTable from "./liveness/Minus.vue";
import VetoTable from "./liveness/Veto.vue";

const id = ref(1);

const year = ref(CURRENT_YEAR);
const yearOptions = ref(YEAR_OPTIONS);
// 年份切换事件
const yearChange = (command: any) => {
    if (year.value != command) {
        year.value = command;
        getDetail();
    }
};
const loading = ref(false);
const detailData = reactive<any>({});
const activeClassify = ref();
// 获取详情
const getDetail = async () => {
    loading.value = true;
    try {
        const { code, data } = await assessApi.getEvaluateListInfo({
            year: year.value,
            account_id: id.value,
        });
        if (code === 200) {
            const {
                evaluate_list = [],
                plus_list = [],
                score = 0,
                star = 0,
                file_count = 0,
            } = data;
            ElMessage.success(`请求成功`);
            detailData.id = id.value;
            detailData.score = score;
            detailData.star = star;
            detailData.file_count = file_count;
            detailData.classify = [
                ...evaluate_list.map((item: any) => {
                    return {
                        ...item,
                        tabType: "base",
                    };
                }),
                ...plus_list.map((item: any) => {
                    return {
                        id: `plus_${item.type}`,
                        score: item.score,
                        evaluate_name: PLUS_OPTIONS[item.type as PlusValueType],
                        tabType: item.type,
                        list: item.list,
                    };
                }),
            ];
            activeClassify.value = detailData.classify.length ? detailData.classify[0].id : "";
        }
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    if (id.value) {
        getDetail();
    }
});

// 获取tab标题
const getTabLabel = (item: any) => {
    let label = `${item.evaluate_name}`;
    const tabType = item.tabType;
    const score = item.score;
    if (score > 0) {
        if (tabType === 2) {
            label = `${label} (-${item.score}分)`;
        } else if (tabType !== 3) {
            label = `${label} (${item.score}分)`;
        }
    }
    return label;
};

const refresh = async () => {
    try {
        const { code, data } = await assessApi.getStarInfo({
            year: year.value,
        });
        if (code === 200) {
            detailData.score = data.score;
            detailData.star = data.star;
            detailData.file_count = data.file_count;
            detailData.classify.forEach((item: any) => {
                const { tabType, id } = item;
                if (tabType === "base") {
                    const findBase = data.evaluate_list.find((itemBase: any) => itemBase.id == id);
                    if (findBase) {
                        item.score = findBase.score;
                    }
                } else {
                    const findPlus = data.plus_list.find(
                        (itemPlus: any) => `plus_${itemPlus.type}` == id
                    );
                    if (findPlus) {
                        item.score = findPlus.score;
                    }
                }
            });
        }
    } catch (e) {
        console.error(e);
    }
};
provide("notifyRefresh", refresh);
</script>

<template>
    <div class="main-container-wrapper">
        <div class="main-header">
            <span class="title">活跃度评估</span>
        </div>
        <div class="main-content">
            <div class="org-detail-liveness-module" v-loading="loading">
                <div class="liveness-header">
                    <div class="item">
                        <el-dropdown class="my-year-dropdown" trigger="click" @command="yearChange">
                            <span class="el-dropdown-link">
                                {{ year }}年
                                <el-icon><CaretBottom /></el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item
                                        v-for="item in yearOptions"
                                        :key="item.value"
                                        :command="item.value"
                                    >
                                        {{ item.label }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <div class="item">
                        <span>年度积分：</span>
                        <span class="score">{{ detailData.score }}</span>
                    </div>
                    <div class="item">
                        <span>星级：</span>
                        <el-rate
                            v-if="detailData.star"
                            v-model="detailData.star"
                            :disabled="true"
                            :max="detailData.star"
                        />
                        <span v-else-if="detailData.star === 0">取消评星资格</span>
                    </div>
                    <div class="item">
                        <p>上传材料：{{ detailData.file_count }}项</p>
                    </div>
                </div>
                <el-tabs
                    v-if="detailData.classify && detailData.classify.length > 0"
                    v-model="activeClassify"
                    class="assess-tabs"
                    type="border-card"
                >
                    <el-tab-pane
                        v-for="classifyItem in detailData.classify"
                        :key="classifyItem.id"
                        :label="getTabLabel(classifyItem)"
                        :name="classifyItem.id"
                    >
                        <Base v-if="classifyItem.tabType === 'base'" :data="classifyItem" />
                        <PlusTable v-if="classifyItem.tabType === 1" :data="classifyItem" />
                        <MinusTable v-if="classifyItem.tabType === 2" :data="classifyItem" />
                        <VetoTable v-if="classifyItem.tabType === 3" :data="classifyItem" />
                    </el-tab-pane>
                </el-tabs>
                <el-empty v-else description="暂无数据" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.org-detail-liveness-module {
    .liveness-header {
        display: flex;
        align-items: center;
        height: 60px;
        margin: 24px 0;
        .item {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 28px;
            width: 25%;
            border-right: 1px solid #ebeef5;
            box-sizing: border-box;
            font-family: PingFang SC, PingFang SC;
            &:nth-last-child(1) {
                border-right: none;
            }
        }
        .score {
            font-weight: 600;
            font-size: 20px;
            color: #e97800;
        }
    }
    :deep(.el-tabs__new-tab) {
        margin: 0 24px 0 24px;
        width: auto;
    }
    :deep(.el-tabs__content) {
        padding: 0;
    }
}
</style>
