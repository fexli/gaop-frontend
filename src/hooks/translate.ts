import {useI18n} from "vue-next-i18n";

export function useTranslate() {
    const {t} = useI18n();

    const replaceHolder = function (key: string, ...args: any[]) {
        return key.replace(/\{(\w+)\}/gi, function (a, b) {
            return args[parseInt(b)] || '';
        })
    };
    const translate = function (key: string, ...args: any[]) {
        return replaceHolder(t(key), ...args);
    }
    return {
        replaceHolder,
        translate,
    };
}