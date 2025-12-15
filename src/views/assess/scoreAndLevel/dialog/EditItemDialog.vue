<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { assessApi } from "@/api/module/assess";
import { ElMessage } from "element-plus";

// 不同星级对应的分数设置范围
// 1-3星对应分数范围, min表示可选的最小分数，max表示可选的最大分数, max为prev表示最大分数为上一级设置的最小分数。
const STAR_SCORE_SETTING_RANGE = {
    3: { min: 20, max: 100 },
    2: { min: 10, max: "prev" },
    1: { min: 1, max: "prev" },
};
const props = defineProps<{
    modelValue: boolean;
    star: number;
    data: any[];
}>();
const starData = reactive({
    id: "",
    star: 0,
    min: 0,
    max: 0,
    minLimit: 0,
    maxLimit: 0,
});
// 获取对应星级设置的最小值
const getCurrentStar = (star: number) => {
    const current = props.data ? props.data.find((item) => item.star === star) : undefined;
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
                const starLimit =
                    STAR_SCORE_SETTING_RANGE[props.star as keyof typeof STAR_SCORE_SETTING_RANGE];
                const current = getCurrentStar(props.star);
                starData.star = props.star;
                if (current) {
                    const { start, end } = current;
                    starData.id = current.id;
                    starData.min = Number(start !== "null" ? start : 0);
                    starData.max = Number(end !== "null" ? end : 0);
                    if (end === "null" && typeof starLimit.max === "number") {
                        starData.maxLimit = starLimit.max;
                    } else {
                        starData.maxLimit = Number(end);
                    }
                    const nextStar = getCurrentStar(props.star - 1);
                    console.log("nextStar", nextStar);
                    if (nextStar.start === "null") {
                        starData.minLimit = starLimit.min;
                    } else {
                        starData.minLimit = Math.max(starLimit.min, Number(nextStar.start));
                    }
                }
            }
            console.log("starData", starData);
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
    if (!starData.min) {
        ElMessage.warning("请填写最低分");
        return;
    }
    if (submitLoading.value) return; // 二次保险
    submitLoading.value = true;
    try {
        const { code } = await assessApi.updateStar({
            id: starData.id,
            start: starData.min,
        });
        if (code === 200) {
            ElMessage.success(`修改成功`);
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
                v-if="starData.star"
                v-model="starData.star"
                :disabled="true"
                :max="starData.star"
            />
            <div class="score-content">
                <div class="score-item">
                    <p class="title">最低分</p>
                    <el-input-number
                        class="value delete-btn"
                        v-model="starData.min"
                        :step="1"
                        :max="starData.maxLimit"
                        :min="starData.minLimit"
                        style="width: 80px"
                    />
                </div>
                <div class="score-item score-item-line">
                    <p class="title"></p>
                    <p class="value">{{ starData.star !== 3 ? "至" : "及以上" }}</p>
                </div>
                <div v-if="starData.star !== 3" class="score-item">
                    <p class="title">最高分</p>
                    <p class="value">{{ starData.max }}分</p>
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
