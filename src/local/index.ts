import {createI18n} from 'vue-next-i18n';
import {zhHans} from "./zh_cn";
import {en} from "./en";
import {appStore} from "../store/app";

const messages = {
    "zh_cn": zhHans,
    "en": en
}

export const i18n = createI18n({
    locale: 'zh_cn',
    messages,
    localeKeys: ['zh_cn', 'en']
})