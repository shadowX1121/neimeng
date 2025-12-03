import { ref, computed } from "vue";
// 创建通用选项 Hook 的工厂函数
export function createUseOptions<T = string | number>(
    defaultOptions: LabelOption<T>[],
    optionsName: string = "选项"
) {
    return function useOptions() {
        const options = ref<LabelOption<T>[]>(defaultOptions);

        // 根据 value 获取 label
        const getLabelByValue = (value: T) => {
            const option = options.value.find((item) => item.value === value);
            return option ? option.label : `未知${optionsName}`;
        };

        // 根据 label 获取 value
        const getValueByLabel = (label: string) => {
            const option = options.value.find((item) => item.label === label);
            return option ? option.value : null;
        };

        // 根据 value 获取颜色
        const getColorByValue = (value: T) => {
            const option = options.value.find((item) => item.value === value);
            return option ? option.color : "#000000";
        };

        // 验证 value 是否有效
        const isValidValue = (value: T) => {
            return options.value.some((item) => item.value === value);
        };

        // 获取所有值
        const values = computed(() => options.value.map((item) => item.value));

        // 获取所有标签
        const labels = computed(() => options.value.map((item) => item.label));

        return {
            options,
            values,
            labels,
            getLabelByValue,
            getValueByLabel,
            getColorByValue,
            isValidValue,
        };
    };
}
