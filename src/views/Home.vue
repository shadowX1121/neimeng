<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import { useRouter } from "vue-router";

const router = useRouter();
const isDark = useDark();
const toggleDark = useToggle(isDark);

const goAbout = () => {
    router.push("/login");
};
</script>

<template>
    <div>
        <h2>Home Page</h2>
        <span>{{ isDark }}</span>
        <el-button type="primary" @click="toggleDark()"> 加 </el-button>

        <el-button @click="goAbout">Go To About</el-button>
    </div>
</template>

<style>
.dark {
    background-color: #333;
    color: #fff;
}
</style>
