import {ref} from "vue";

let cooldown = false;
export const calcWidth = () => {
    if (cooldown) return;
    cooldown = true;
    setTimeout(() => {
        let w = document.documentElement.clientWidth;
        globHeight.value = document.documentElement.clientHeight;
        globWidth.value = w
        if (w < 768) {
            isSmall.value = true;
            isMedium.value = false;
            isLarge.value = false;
            isXLarge.value = false;
            isXXLarge.value = false;
        } else if (w < 1024) {
            isSmall.value = true;
            isMedium.value = true;
            isLarge.value = false;
            isXLarge.value = false;
            isXXLarge.value = false;
        } else if (w < 1280) {
            isSmall.value = true;
            isMedium.value = true;
            isLarge.value = true;
            isXLarge.value = false;
            isXXLarge.value = false;
        } else if (w < 1536) {
            isSmall.value = true;
            isMedium.value = true;
            isLarge.value = true;
            isXLarge.value = true;
            isXXLarge.value = false;
        } else {
            isSmall.value = true;
            isMedium.value = true;
            isLarge.value = true;
            isXLarge.value = true;
            isXXLarge.value = true;
        }
        cooldown = false;
    }, 50);
}
export const isSmall = ref(false); // ≥640px <768px
export const isMedium = ref(false); // ≥768px <1024px
export const isLarge = ref(false); // ≥1024px <1280px
export const isXLarge = ref(false); // ≥1280px <1536px
export const isXXLarge = ref(false); // ≥1536px
export const globWidth = ref(0)
export const globHeight = ref(0)

export const getBreakPoint = () => {
    if (isXXLarge.value) return "xxl";
    if (isXLarge.value) return "xl";
    if (isLarge.value) return "lg";
    if (isMedium.value) return "md";
    if (isSmall.value) return "sm";
    return "xs";
}