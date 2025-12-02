<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { mockApi } from "@/api/index";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

import type { FormInstance, FormRules } from "element-plus";

const filter = reactive({
    year: "",
    level: "",
    status: "",
    accountStatus: "",
    search: "",
});
const yearOptions = ref([{ value: "2025", label: "2025年" }]);
const levelOptions = ref([
    { value: "0", label: "全部星级" },
    { value: "1", label: "一星" },
    { value: "2", label: "二星" },
    { value: "3", label: "三星" },
    { value: "4", label: "无星级" },
]);

// const formRef = ref<FormInstance>();
// const formData = reactive({
//     name: "",
//     password: "",
// });
// // 名称验证
// const validateName = (_rule: any, value: string, callback: any) => {
//     if (value === "") {
//         callback(new Error("请输入账号名称"));
//     } else if (value.length > 20) {
//         callback(new Error("账号名称不能超过20个字符"));
//     } else {
//         callback();
//     }
// };
// // 密码验证
// const validatePass = (_rule: any, value: string, callback: any) => {
//     if (value === "") {
//         callback(new Error("请输入密码"));
//     } else if (value.length < 6 || value.length > 20) {
//         callback(new Error("密码长度为6-20个字符"));
//     } else {
//         callback();
//     }
// };
// const rules = reactive<FormRules<typeof formData>>({
//     name: [{ validator: validateName, trigger: "blur" }],
//     password: [{ validator: validatePass, trigger: "blur" }],
// });
// const submitLoading = ref(false);
// const submitDisabled = computed(() => {
//     return (
//         !formData.name ||
//         !formData.password ||
//         formData.password.length < 6 ||
//         formData.password.length > 20
//     );
// });

// // 提交按钮点击事件
// const onSubmit = async () => {
//     if (submitLoading.value) return; // 二次保险
//     submitLoading.value = true;
//     try {
//         const { code } = await mockApi.mock(formData, null);
//         if (code === 200) {
//             ElMessage.success("修改成功");
//         }
//     } catch (error) {
//         console.log(error);
//     } finally {
//         submitLoading.value = false;
//     }
// };
</script>

<template>
    <div class="main-container-wrapper">
        <div class="main-header">
            <p class="title">体育社会组织列表</p>
            <p class="des">体育社会组织：17个</p>
        </div>
        <div class="main-content">
            <div class="org-list-page">
                <div class="table-filter">
                    <div class="table-filter_left">
                        <el-button :icon="Plus" type="primary" @click="">
                            添加账号
                        </el-button>
                    </div>
                    <div class="table-filter_right">
                        <el-select
                            class="w108"
                            v-model="filter.year"
                            placeholder="选择年份"
                        >
                            <el-option
                                v-for="item in yearOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                        <el-select
                            class="w108"
                            v-model="filter.level"
                            placeholder="选择星级"
                        >
                            <el-option
                                v-for="item in levelOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.org-list-page {
}
</style>
