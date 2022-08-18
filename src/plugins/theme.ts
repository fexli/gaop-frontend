import {appStore} from "../store/app";

export function load() {
    const apps = appStore()
    setByDarkMode(apps.getThemeMode)
}

export function set(name: string) {
    localStorage.setItem("theme", name);
    document.documentElement.setAttribute("data-theme", name);
}

export function setByDarkMode(mode: boolean) {
    if (mode) {
        set("halloween");
    } else {
        set("cmyk");
    }
}

export function get() {
    return localStorage.getItem("theme");
}
