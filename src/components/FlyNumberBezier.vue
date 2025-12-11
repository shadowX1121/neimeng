<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps({
    from: { type: Object, required: true }, // 起点 DOM ref
    to: { type: Object, required: true }, // 终点 DOM ref
    number: { type: [String, Number], default: 1 },
    size: { type: Number, default: 22 },
    color: { type: String, default: "#f56c6c" },
    duration: { type: Number, default: 800 }, // 动画时长
});

const flyingList = ref<any[]>([]);

// 计算贝塞尔点
function quadBezier(
    t: number,
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number }
) {
    const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
    return { x, y };
}

const fly = () => {
    const id = Date.now();

    const fromRect = props.from.value.getBoundingClientRect();
    const toRect = props.to.value.getBoundingClientRect();

    const start = {
        x: fromRect.left + fromRect.width / 2,
        y: fromRect.top + fromRect.height / 2,
    };

    const end = {
        x: toRect.left + toRect.width / 2,
        y: toRect.top + toRect.height / 2,
    };

    // 中间控制点（决定曲线弧度）
    const control = {
        x: (start.x + end.x) / 2,
        y: Math.min(start.y, end.y) - 150, // 弧线高度
    };

    const item = {
        id,
        x: start.x,
        y: start.y,
        opacity: 1,
    };

    flyingList.value.push(item);

    const startTime = performance.now();

    const animate = (time: number) => {
        const t = Math.min((time - startTime) / props.duration, 1);

        const pos = quadBezier(t, start, control, end);

        item.x = pos.x;
        item.y = pos.y;
        item.opacity = 1 - t; // 飞行越久越透明

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            flyingList.value = flyingList.value.filter((i) => i.id !== id);
        }
    };

    requestAnimationFrame(animate);
};

defineExpose({ fly });
</script>

<template>
    <div class="bezier-container">
        <div
            v-for="item in flyingList"
            :key="item.id"
            class="fly-item"
            :style="{
                left: item.x + 'px',
                top: item.y + 'px',
                width: props.size + 'px',
                height: props.size + 'px',
                background: props.color,
                opacity: item.opacity,
            }"
        >
            {{ props.number }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bezier-container {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 99999;
}

.fly-item {
    position: fixed;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);
    font-size: 14px;
    user-select: none;
}
</style>
