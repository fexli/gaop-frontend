import {createI18n} from 'vue-next-i18n';
import {zhHans} from "./zh_cn";
import {en} from "./en";

const messages = {
    "zhHans": zhHans,
    "en": en
}

export const i18n = createI18n({
    locale: 'zhHans',
    messages,
    localeKeys: ['zhHans', 'en']
})