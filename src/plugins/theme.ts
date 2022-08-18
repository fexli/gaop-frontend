import {appStore} from "../store/app";

export function loadTheme() {
    const apps = appStore()
    setByDarkMode(apps.getThemeMode)
}

export function setTheme(name: string) {
    localStorage.setItem("theme", name);
    document.documentElement.setAttribute("data-theme", name);
}

export function setByDarkMode(mode: boolean) {
    if (mode) {
        setTheme("halloween");
    } else {
        setTheme("cmyk");
    }
}

export function getTheme() {
    const apps = appStore()
    return apps.getThemeMode
}
