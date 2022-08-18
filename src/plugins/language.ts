import {appStore} from "../store/app";
import {i18n} from "../local";

export function loadLanguage() {
    const apps = appStore()
    i18n.changeLocale(apps.getLanguage)
}

export function setLanguage(name: string) {
    const apps = appStore()
    apps.setLanguage(name)
    i18n.changeLocale(name);
    console.log("setLanguage", name)
}