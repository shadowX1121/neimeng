<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker?url";
import { useRoute } from "vue-router";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const route = useRoute();
const pdfUrl = computed(() => route.query.url || "");
const containerRef = ref<HTMLDivElement | null>(null);

const renderPdf = async () => {
    console.log("pdf加载");
    if (!containerRef.value) return;
    containerRef.value.innerHTML = "";

    const pdf = await pdfjsLib.getDocument(pdfUrl.value).promise;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = document.createElement("canvas");
        // const ctx = canvas.getContext("2d")!;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvas,
            viewport,
        }).promise;

        containerRef.value.appendChild(canvas);
    }
};

onMounted(renderPdf);
watch(() => route.query.url, renderPdf);
</script>

<template>
    <div ref="containerRef" class="pdf-container"></div>
</template>

<style lang="scss" scoped>
.pdf-container {
    width: 100%;
    overflow: auto;
    background: #333333;
    :deep(canvas) {
        display: block;
        margin: 0 auto 16px;
    }
}
</style>
