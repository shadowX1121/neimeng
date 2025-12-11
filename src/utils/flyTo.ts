import { useDownloadCountStore } from "@/store/useDownloadCountStore";

const downloadCountStore = useDownloadCountStore();
function bezier(t: number, p0: number, p1: number, p2: number) {
    return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2;
}

interface FlyOption {
    from: HTMLElement; // 起始元素
    text?: string; // 显示内容
    duration?: number; // 时长
}

export function flyTo(option: FlyOption) {
    const { from, text = "1", duration = 600 } = option;
    const target = document.getElementById("download-target");
    if (!target) {
        console.warn(`flyTo: 找不到目标元素 #download-target`);
        return;
    }

    const fromRect = from.getBoundingClientRect();
    const toRect = target.getBoundingClientRect();

    const flyEl = document.createElement("div");
    flyEl.classList.add("down-count");
    flyEl.innerText = text;
    flyEl.style.position = "fixed";
    flyEl.style.left = `${fromRect.left + fromRect.width / 2}px`;
    flyEl.style.top = `${fromRect.top + fromRect.height / 2}px`;
    flyEl.style.zIndex = "9999";
    flyEl.style.pointerEvents = "none";
    document.body.appendChild(flyEl);

    const startX = fromRect.left + fromRect.width / 2;
    const startY = fromRect.top + fromRect.height / 2;
    const endX = toRect.left + toRect.width / 2 - 8;
    const endY = toRect.top + toRect.height / 2 - 8;

    // 控制点（抛物线控制高度）
    const cpX = (startX + endX) / 2;
    const cpY = startY - 150;

    const start = performance.now();

    const animate = (now: number) => {
        const t = Math.min((now - start) / duration, 1);

        const x = bezier(t, startX, cpX, endX);
        const y = bezier(t, startY, cpY, endY);

        flyEl.style.transform = `translate(${x - startX}px, ${y - startY}px)`;

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            downloadCountStore.count = downloadCountStore.count + 1;
            flyEl.remove();
        }
    };

    requestAnimationFrame(animate);
}
