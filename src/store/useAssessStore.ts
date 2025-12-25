import { ref, computed, onBeforeMount } from "vue";
import { defineStore } from "pinia";
import { assessApi } from "@/api/module/assess";
export const useAssessStore = defineStore(
    "assessStore",
    () => {
        // State
        const assessData = ref<AssessClassifyType[]>([]);
        const isLoading = ref<boolean>(false);
        // Getters
        const isEmpty = computed(() => assessData.value.length === 0);
        // Actions
        // 获取数据
        const fetchData = async (forceRefresh: boolean = false, extraParams?: any) => {
            // 如果有数据且不是强制刷新，则直接使用本地数据
            if (!isEmpty.value && !forceRefresh) {
                return assessData.value;
            }
            isLoading.value = true;
            try {
                const { code, data } = await assessApi.getEvaluateList({
                    ...extraParams,
                });
                if (code === 200) {
                    assessData.value = data;
                    // assessData.value = [
                    //     {
                    //         id: "account",
                    //         name: "党的建设",
                    //         project: [
                    //             {
                    //                 id: "1",
                    //                 name: "组织建设",
                    //                 assessItem: [
                    //                     {
                    //                         id: "1-1",
                    //                         name: "组织体系健全",
                    //                         gist: "党支部设立程序规范，支委会配备齐全、分工明确，按期换届。",
                    //                         file: [
                    //                             {
                    //                                 id: "1-1-1",
                    //                                 name: "上级党组织关于成立党支部的批复文件。",
                    //                                 fileUrl: "",
                    //                                 isBase: true,
                    //                             },
                    //                             {
                    //                                 id: "1-1-2",
                    //                                 name: "上级党组织关于成立党支部的批复文件1。",
                    //                                 fileUrl: "",
                    //                                 isBase: false,
                    //                             },
                    //                             {
                    //                                 id: "1-1-3",
                    //                                 name: "上级党组织关于成立党支部的批复文件2。",
                    //                                 fileUrl: "",
                    //                                 isBase: true,
                    //                             },
                    //                         ],
                    //                     },
                    //                     {
                    //                         id: "1-2",
                    //                         name: "制度根基牢固",
                    //                         gist: "党建入章程落实到位，基本工作制度健全，支部书记参与决策机制有效运行。",
                    //                         file: [
                    //                             {
                    //                                 id: "1-2-1",
                    //                                 name: "上级党组织关于成立党支部的批复文件。",
                    //                                 fileUrl: "",
                    //                                 isBase: true,
                    //                             },
                    //                             {
                    //                                 id: "1-2-2",
                    //                                 name: "上级党组织关于成立党支部的批复文件1。",
                    //                                 fileUrl: "",
                    //                                 isBase: false,
                    //                             },
                    //                             {
                    //                                 id: "1-2-3",
                    //                                 name: "上级党组织关于成立党支部的批复文件2。",
                    //                                 fileUrl: "",
                    //                                 isBase: true,
                    //                             },
                    //                         ],
                    //                     },
                    //                 ],
                    //             },
                    //             {
                    //                 id: "2",
                    //                 name: "组织建设2",
                    //                 assessItem: [
                    //                     {
                    //                         id: "2-1",
                    //                         name: "组织体系健全",
                    //                         gist: "党支部设立程序规范，支委会配备齐全、分工明确，按期换届。",
                    //                         file: [
                    //                             {
                    //                                 id: "2-1-1",
                    //                                 name: "上级党组织关于成立党支部的批复文件。",
                    //                                 fileUrl: "",
                    //                                 isBase: true,
                    //                             },
                    //                             {
                    //                                 id: "2-1-2",
                    //                                 name: "上级党组织关于成立党支部的批复文件1。",
                    //                                 fileUrl: "",
                    //                                 isBase: false,
                    //                             },
                    //                             {
                    //                                 id: "2-1-3",
                    //                                 name: "上级党组织关于成立党支部的批复文件2。",
                    //                                 fileUrl: "",
                    //                                 isBase: true,
                    //                             },
                    //                         ],
                    //                     },
                    //                     {
                    //                         id: "2-2",
                    //                         name: "制度根基牢固",
                    //                         gist: "党建入章程落实到位，基本工作制度健全，支部书记参与决策机制有效运行。",
                    //                         file: [
                    //                             {
                    //                                 id: "2-2-1",
                    //                                 name: "上级党组织关于成立党支部的批复文件。",
                    //                                 fileUrl: "",
                    //                                 isBase: true,
                    //                             },
                    //                             {
                    //                                 id: "2-2-2",
                    //                                 name: "上级党组织关于成立党支部的批复文件1。",
                    //                                 fileUrl: "",
                    //                                 isBase: false,
                    //                             },
                    //                             {
                    //                                 id: "2-2-3",
                    //                                 name: "上级党组织关于成立党支部的批复文件2。",
                    //                                 fileUrl: "",
                    //                                 isBase: true,
                    //                             },
                    //                         ],
                    //                     },
                    //                 ],
                    //             },
                    //         ],
                    //     },
                    //     { id: "organization", name: "日常管理", project: [] },
                    //     { id: "assess", name: "保障工作任务要求", project: [] },
                    // ];
                    return assessData.value;
                }
            } catch (err: any) {
                // 如果接口失败但有本地数据，则使用本地数据
                if (!isEmpty.value) {
                    console.warn("Using cached data due to API error:", err.message);
                    return assessData.value;
                }
                throw err;
            } finally {
                isLoading.value = false;
            }
        };
        // 获取分类列表
        const classifyList = computed(() => {
            return assessData.value.map((item) => ({
                value: item.id,
                label: item.evaluate_name,
            }));
        });
        // 根据分类获取项目列表
        const getProjectList = (comifyId: IdValueType) => {
            const classify = assessData.value.find((item) => item.id === comifyId);
            return classify && classify.project_info && classify.project_info.length
                ? classify.project_info.map((item) => ({
                      value: item.id as IdValueType,
                      label: item.evaluate_project_name as string,
                  }))
                : [];
        };
        // 根据评估项id获取该评估项所属分类
        const getClassifyByItemId = (itemId: IdValueType) => {
            let classifyId: IdValueType = "";
            assessData.value.forEach((classify) => {
                classify.project_info.forEach((project) => {
                    project.project_detail &&
                        project.project_detail.length > 0 &&
                        project.project_detail.forEach((item) => {
                            if (item.id == itemId) {
                                classifyId = classify.id!;
                            }
                        });
                });
            });
            return classifyId;
        };
        // 根据评估项id获取该评估项所属项目
        const getProjectIdByItemId = (itemId: string) => {
            let projectId: IdValueType = "";
            assessData.value.forEach((classify) => {
                classify.project_info.forEach((project) => {
                    project.project_detail &&
                        project.project_detail.length > 0 &&
                        project.project_detail.forEach((item) => {
                            if (item.id == itemId) {
                                projectId = project.id!;
                            }
                        });
                });
            });
            return projectId;
        };
        // 根据评估项id获取评估项信息
        const getAssessItemInfo = (itemId: string) => {
            let itemInfo: AssessItemBaseType | undefined;
            assessData.value.forEach((classify) => {
                classify.project_info.forEach((project) => {
                    project.project_detail &&
                        project.project_detail.length > 0 &&
                        project.project_detail.forEach((item) => {
                            if (item.id == itemId) {
                                itemInfo = item;
                            }
                        });
                });
            });
            return itemInfo;
        };
        onBeforeMount(() => {
            fetchData();
        });

        return {
            // State
            assessData,
            isLoading,
            classifyList,
            // Getters
            isEmpty,
            // Actions
            fetchData,
            getProjectList,
            getClassifyByItemId,
            getProjectIdByItemId,
            getAssessItemInfo,
        };
    },
    {
        persist: {
            storage: sessionStorage,
            key: "assess-store",
            // 其他配置...
        },
    }
);
