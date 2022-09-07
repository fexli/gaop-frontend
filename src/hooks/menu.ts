// import {RouteRecordRaw} from "#/menu";
import {router} from "../router/router";
import {
    RouteLocationNormalized,
    RouteLocationNormalizedLoaded, Router,
    RouteRecordNormalized,
    RouteRecordRaw
} from "vue-router";

export interface MenuCurrentIface {
    name: string,
    translatable: boolean,
    href: string,
}

export class MenuCurrent implements MenuCurrentIface {
    name: string;
    translatable: boolean;
    href: string;

    constructor(name: string, translatable: boolean, href: string) {
        this.name = name;
        this.translatable = translatable;
        this.href = href;
    }
}

class Menu {
    public menus = ref<RouteRecordRaw[]>([]);
    //@ts-ignore
    private closeTimeout: NodeJS.Timeout;

    public close = ref(false); // 是否需要关闭侧边栏

    constructor() {
        this.menus.value = this.getMenuByRoute();
    }

    /**
     * 获取嵌套路由的面包屑
     * @param m 菜单对象
     * @param routerMap 用于存储路由名称对应的面包屑名称
     * @param title 用于连接面包屑名称
     */
    getNestedMenuByRoute(m: RouteRecordRaw, routerMap: Map<string, MenuCurrent[]>, title: MenuCurrent[] = []) {
        m.children?.forEach((c) => {
            let subtitle: MenuCurrent[]
            if (title.length) {
                subtitle = [...title, new MenuCurrent(c.meta?.title as string, c.meta?.translatable == null ? true : c.meta?.translatable as boolean, c.path)];
            } else {
                subtitle = [
                    new MenuCurrent(m.meta?.title as string, m.meta?.translatable == null ? true : m.meta?.translatable as boolean, m.path),
                    new MenuCurrent(c.meta?.title as string, c.meta?.translatable == null ? true : c.meta?.translatable as boolean, c.path),
                ]
            }
            routerMap.set(c.path, subtitle);
            if (c.children) {
                this.getNestedMenuByRoute(c, routerMap, subtitle);
            }
        });
    }

    getCurrentMenu(route: RouteLocationNormalizedLoaded) {
        const routerMap = new Map<string, MenuCurrent[]>();
        this.menus.value.forEach((m) => {
            this.getNestedMenuByRoute(m, routerMap);
        });
        console.log("routerMap", routerMap)
        return routerMap.get(route.path);
    }

    linkPage(menu: RouteRecordRaw) {
        this.isExternalLink(menu) ? window.open(menu.path) : router.push({name: menu.name});
    }

    isExternalLink(menu: RouteRecordRaw) {
        return !!menu.path;
    }

    toggleState() {
        console.log("toggleState");
        this.close.value = !this.close.value;
    }

    openDrawer() {
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
        }
        console.log("openDrawer", this.menus.value[1].children);
        this.close.value = true;
    }

    closeDrawerDelay() {
        console.log("closeDrawerDelay");
        this.closeTimeout = setTimeout(() => {
            this.close.value = false;
        }, 300);
    }

    closeDrawer() {
        console.log("closeDrawer");
        this.close.value = false;
    }

    /**
     * 组装嵌套菜单对象
     * @param children 嵌套的子菜单
     * @returns 嵌套菜单对象
     */
    filterNestedMenu(children: RouteRecordNormalized["children"]): RouteRecordRaw[] {
        return children
            .map((route) => {
                if (route.children) {
                    const childRoute = this.filterNestedMenu(route.children);
                    return {...route, route: route.name, children: childRoute};
                }
                return {...route, route: route.name};
            }) as RouteRecordRaw[];
    }

    // 根据路由元数据构建菜单列表
    getMenuByRoute() {
        return router
            .getRoutes()
            .filter((route) => route.children.length)
            .map((route) => {
                const menu: RouteRecordRaw = {...route};
                menu.children = this.filterNestedMenu(route.children);
                return menu;
            }) as RouteRecordRaw[];
    }
}

export default new Menu();
