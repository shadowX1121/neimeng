<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { mockApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { getCurrentLevelMaxScore } from "@/utils/common";

// 不同星级对应的分数设置范围
// 1-3星对应分数范围, min表示可选的最小分数，max表示可选的最大分数, max为prev表示最大分数为上一级设置的最小分数。
const LEVEL_SCORE_SETTING_RANGE = {
    3: { min: 20, max: 100 },
    2: { min: 10, max: "prev" },
    1: { min: 1, max: "prev" },
};
const props = defineProps<{
    modelValue: boolean;
    level: number;
    data: any[];
}>();
const levelData = reactive({
    level: 0,
    min: 0,
    minLimit: 0,
    maxLimit: 0,
});
// 获取对应星级设置的最小值
const getCurrentLevel = (level: number) => {
    const current = props.data ? props.data.find((item) => item.level === level) : undefined;
    if (!current) {
        console.error("当前星级不在1-3星内");
    }
    return current;
};

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            if (props.data) {
                const levelLimit =
                    LEVEL_SCORE_SETTING_RANGE[
                        props.level as keyof typeof LEVEL_SCORE_SETTING_RANGE
                    ];
                const current = getCurrentLevel(props.level);
                levelData.level = props.level;
                levelData.min = current ? current.min : levelLimit.min;
                if (current) {
                    const max = levelLimit.max;
                    const min = levelLimit.min;
                    if (typeof max === "number") {
                        levelData.maxLimit = max;
                    } else if (max === "prev") {
                        // 上一级的最小值减1
                        const prevLevel = getCurrentLevel(props.level + 1);
                        if (prevLevel) {
                            levelData.maxLimit = prevLevel.min - 1;
                        } else {
                            console.error("当前星级不在1-3星内");
                        }
                    }
                    const nextLevel = getCurrentLevel(props.level - 1);
                    levelData.minLimit = Math.max(
                        min,
                        nextLevel && nextLevel.min ? nextLevel.min + 1 : min
                    );
                } else {
                    console.error("当前星级不在1-3星内");
                }
            }
            console.log("levelData", levelData);
        }
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "confirm", payload?: any): void;
}>();

const close = () => emit("update:modelValue", false);

const submitLoading = ref(false);
const confirmClick = async () => {
    if (submitLoading.value) return; // 二次保险
    submitLoading.value = true;
    try {
        const { code } = await mockApi.mock(null, null);
        if (code === 200) {
            ElMessage.success(`添加成功`);
            close();
            emit("confirm");
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
        title="修改"
        width="480"
        @close="close"
        :close-on-click-modal="false"
        align-center
        :append-to-body="true"
    >
        <div class="dialog-wrapper">
            <el-rate
                v-if="levelData.level"
                v-model="levelData.level"
                :disabled="true"
                :max="levelData.level"
            />
            <div class="score-content">
                <div class="score-item">
                    <p class="title">最低分</p>
                    <el-input-number
                        class="value delete-btn"
                        v-model="levelData.min"
                        :step="1"
                        :max="levelData.maxLimit"
                        :min="levelData.minLimit"
                        style="width: 80px"
                    />
                </div>
                <div class="score-item score-item-line">
                    <p class="title"></p>
                    <p class="value">{{ levelData.level !== 3 ? "至" : "及以上" }}</p>
                </div>
                <div v-if="levelData.level !== 3" class="score-item">
                    <p class="title">最高分</p>
                    <p class="value">
                        {{ getCurrentLevelMaxScore(levelData.level, props.data) }}分
                    </p>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" :loading="submitLoading" @click="confirmClick">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.dialog-wrapper {
    flex-direction: column;
    justify-content: center;
    :deep(.el-rate) {
        --el-rate-icon-size: 32px;
    }
}
.score-content {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
    .score-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 80px;
        .title {
            height: 20px;
            line-height: 20px;
            color: #666666;
        }
        .value {
            margin-top: 4px;
            height: 32px;
            line-height: 32px;
            color: #000000;
            text-align: center;
        }
    }
    .score-item-line {
        width: auto;
        margin: 0 12px;
    }
    :deep(.el-input) {
        .el-input__inner {
            text-align: center;
        }
    }
}
</style>
