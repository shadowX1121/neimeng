import { useDownloadCountStore } from "@/store/useDownloadCountStore";

interface FlyOption {
    from: HTMLElement; // 起始元素
    text?: string; // 显示内容
    duration?: number; // 时长
}

const downloadCountStore = useDownloadCountStore();
function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number) {
    const u = 1 - t;
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

// 丝滑缓动：起步慢 → 中段顺 → 收尾稳
function easeInOut(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function flyTo(option: FlyOption) {
    const { from, text = "1", duration = 520 } = option;

    const target = document.getElementById("download-target");
    if (!target) return;

    const fromRect = from.getBoundingClientRect();
    const toRect = target.getBoundingClientRect();

    const startX = fromRect.left + fromRect.width / 2;
    const startY = fromRect.top + fromRect.height / 2;
    const endX = toRect.left + toRect.width / 2 - 8;
    const endY = toRect.top + toRect.height / 2 - 8;

    const flyEl = document.createElement("div");
    flyEl.className = "down-count";
    flyEl.innerText = text;
    flyEl.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        z-index: 9999;
        pointer-events: none;
        will-change: transform, opacity;
    `;
    document.body.appendChild(flyEl);

    // ===== 控制点（丝滑抛物线）=====
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.hypot(dx, dy);

    // 距离越远，抛物线越高（有上限）
    const height = Math.min(220, distance * 0.5);

    const cp1X = startX + dx * 0.25;
    const cp1Y = startY - height;

    const cp2X = startX + dx * 0.75;
    const cp2Y = endY - height * 0.4;

    const startTime = performance.now();

    const animate = (now: number) => {
        const rawT = Math.min((now - startTime) / duration, 1);
        const t = easeInOut(rawT);

        const x = cubicBezier(t, startX, cp1X, cp2X, endX);
        const y = cubicBezier(t, startY, cp1Y, cp2Y, endY);

        // 丝滑感关键：轻微放大再回落
        const scale = rawT < 0.5 ? 1 + rawT * 0.1 : 1.05 - (rawT - 0.5) * 0.1;

        const opacity = rawT < 0.85 ? 1 : 1 - (rawT - 0.85) / 0.15;

        flyEl.style.transform = `
            translate(${x - startX}px, ${y - startY}px)
            scale(${scale})
        `;
        flyEl.style.opacity = `${opacity}`;

        if (rawT < 1) {
            requestAnimationFrame(animate);
        } else {
            downloadCountStore.count += 1;
            flyEl.remove();
        }
    };

    requestAnimationFrame(animate);
}
