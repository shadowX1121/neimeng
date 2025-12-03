<script setup lang="ts">
// import { ref, reactive, computed, onBeforeMount } from "vue";
// import { useRoute, useRouter } from "vue-router";
// import { mockApi } from "@/api/index";
// import { ElMessage } from "element-plus";

// const router = useRouter();
// const route = useRoute();

// const id = computed(() => route.query.id);

// const detailData = ref<any>({
//     name: "锡林浩特市羽毛球协会",
// });

// // 获取详情
// const getDetail = async () => {
//     try {
//         const { code } = await mockApi.mock(
//             {
//                 id: id,
//             },
//             null
//         );
//         if (code === 200) {
//             ElMessage.success(`请求成功`);
//         }
//     } catch (error) {
//         console.log(error);
//     }
// };
// onBeforeMount(() => {
//     if (id) {
//         getDetail();
//     }
// });
</script>

<template>
    <div class="org-detail-liveness-module">活跃度模块</div>
</template>

<style lang="scss" scoped>
.org-detail-liveness-module {
}
</style>
