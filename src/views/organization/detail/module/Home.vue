<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import { CaretBottom } from "@element-plus/icons-vue";
import AccountStatusDialog from "./dialog/AccountStatusDialog.vue";
import ManagerInfoDialog from "./dialog/ManagerInfoDialog.vue";
import { useRoute, useRouter } from "vue-router";
import { useAccountStatus } from "@/utils/useOptions";
import { mockApi } from "@/api/index";
import dayjs from "dayjs";

const router = useRouter();
const route = useRoute();

const id = computed(() => route.query.id as string | number);

const detailData = reactive<OrgAccountType>({
    id: id.value,
    name: "锡林浩特市羽毛球协会",
    status: 1,
    score: 35,
    level: 2,
    userName: "李泉",
    phone: "17866509980",
});

const accountStatus = useAccountStatus();
const accountStatusDialogVisible = ref(false);
// 修改账号状态点击事件
const editAccountStatus = () => {
    accountStatusDialogVisible.value = true;
};
// 修改账号状态成功事件
const updateAccountStatusConfirm = (value: { status: number }) => {
    detailData.status = value.status;
};

// 积分管理点击事件
const scoreManage = () => {};
const curentYear = ref(dayjs().year());
const yearOptions = ref([
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
]);
// 年份切换事件
const yearChange = (command: any) => {
    if (curentYear.value != command) {
        curentYear.value = command;
        console.log("command", command);
    }
};

const managerInfoDialogVisible = ref(false);
// 修改管理员信息点击事件
const editManageInfo = () => {
    managerInfoDialogVisible.value = true;
};
// 管理员信息修改完成回调
const updateManagerInfoConfirm = (value: {
    userName: string;
    phone: string;
}) => {
    detailData.userName = value.userName;
    detailData.phone = value.phone;
};

// 重置密码点击事件
const resetPassword = () => {};
// 获取详情
const getDetail = async () => {
    try {
        const { code } = await mockApi.mock(
            {
                id: id,
            },
            null
        );
        if (code === 200) {
            ElMessage.success(`请求成功`);
        }
    } catch (error) {
        console.log(error);
    }
};
onBeforeMount(() => {
    if (id) {
        getDetail();
    }
});
</script>

<template>
    <div class="org-detail-home-module">
        <div class="w640">
            <h1>{{ detailData.name }}</h1>
            <div class="module-item">
                <div class="account-status">
                    <p class="module-item-name">账号状态：</p>
                    <p
                        class="flex-1"
                        :style="{
                            color: accountStatus.getColorByValue(
                                detailData.status
                            ),
                        }"
                    >
                        {{ accountStatus.getLabelByValue(detailData.status) }}
                    </p>
                    <el-button @click="editAccountStatus"> 修改 </el-button>
                </div>
            </div>
            <div class="module-item">
                <div class="flex title">
                    <p class="module-item-name flex-1">积分情况</p>
                    <el-button @click="scoreManage"> 管理 </el-button>
                </div>
                <div class="des">
                    <div class="des-item w200">
                        <span>年度积分：</span>
                        <span class="score">{{ detailData.score }}</span>
                    </div>
                    <div class="flex-1 des-item">
                        <span>星级：</span>
                        <el-rate
                            v-if="detailData.level"
                            v-model="detailData.level"
                            :disabled="true"
                            :max="detailData.level"
                        />
                        <span v-else> 取消评星资格 </span>
                    </div>
                    <el-dropdown
                        class="my-year-dropdown"
                        trigger="click"
                        @command="yearChange"
                    >
                        <span class="el-dropdown-link">
                            {{ curentYear }}年
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
            </div>
            <div class="module-item">
                <div class="flex title">
                    <p class="module-item-name flex-1">管理员信息</p>
                    <el-button @click="editManageInfo"> 修改 </el-button>

                    <el-button @click="resetPassword"> 重置密码 </el-button>
                </div>
                <div class="des">
                    <div class="des-item w200">
                        <span>姓名：</span>
                        <span>{{ detailData.userName }}</span>
                    </div>
                    <div class="flex-1 des-item">
                        <span>手机号：</span>
                        <span>{{ detailData.phone }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!--修改账号状态弹窗-->
        <AccountStatusDialog
            v-model="accountStatusDialogVisible"
            :status="detailData.status"
            :account-id="id"
            @confirm="updateAccountStatusConfirm"
        />
        <!--修改管理员信息弹窗-->
        <ManagerInfoDialog
            v-model="managerInfoDialogVisible"
            :account="detailData"
            @confirm="updateManagerInfoConfirm"
        />
    </div>
</template>

<style lang="scss" scoped>
.org-detail-home-module {
    display: flex;
    justify-content: center;
    margin-top: 80px;
    font-size: 16px;
    h1 {
        line-height: 34px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 24px;
        color: #000000;
        margin: 0;
    }
    .module-item {
        padding: 0 24px;
        margin-top: 24px;
        background: #f6f9fb;
        font-family: PingFang SC, PingFang SC;
        border-radius: 8px;
        .module-item-name {
            line-height: 22px;
            margin-right: 4px;
            font-weight: 600;
            color: #000000;
        }
        .title {
            align-items: center;
            height: 60px;
            border-bottom: 1px solid #ebeef5;
        }
        .des {
            display: flex;
            align-items: center;
            font-weight: 400;
            height: 70px;
            .des-item {
                display: flex;
                align-items: center;
            }
        }
    }
    .account-status {
        display: flex;
        align-items: center;
        height: 64px;
        font-weight: 600;
    }
    .score {
        font-weight: 600;
        font-size: 20px;
        color: #e97800;
    }
    :deep(.el-rate) {
        height: 24px;
    }
}
</style>
