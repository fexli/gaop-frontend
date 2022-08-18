// import {RouteRecordRaw} from "#/menu";
import {router} from "../router/router";
import {
    RouteLocationNormalized,
    RouteLocationNormalizedLoaded,
    RouteRecordNormalized,
    RouteRecordRaw
} from "vue-router";

class Menu {
    public menus = ref<RouteRecordRaw[]>([]);
    public route = ref(null as null | RouteLocationNormalized);
    public close = ref(false);

    constructor() {
        this.menus.value = this.getMenuByRoute();
    }

    /**
     * 获取嵌套路由的面包屑
     * @param m 菜单对象
     * @param routerMap 用于存储路由名称对应的面包屑名称
     * @param title 用于连接面包屑名称
     */
    getNestedMenuByRoute(m: RouteRecordRaw, routerMap: Map<string, string>, title = "") {
        m.children?.forEach((c) => {
            title !== "" ? (title = `${title}-${c.meta?.title}`) : (title = `${m.meta?.title}-${c.meta?.title}`);
            routerMap.set(c.path, title);
            if (c.children) {
                this.getNestedMenuByRoute(c, routerMap, title);
            } else {
                title = "";
            }
        });
    }

    getCurrentMenu(route: RouteLocationNormalizedLoaded) {
        const routerMap = new Map();
        this.menus.value.forEach((m) => {
            this.getNestedMenuByRoute(m, routerMap);
        });
        return routerMap.get(route.name);
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

    /**
     * 组装嵌套菜单对象
     * @param children 嵌套的子菜单
     * @returns 嵌套菜单对象
     */
    filterNestedMenu(children: RouteRecordNormalized["children"]): RouteRecordRaw[] {
        return children
            .filter((route) => route.meta)
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
            .filter((route) => route.children.length && route.meta.menu)
            .map((route) => {
                const menu: RouteRecordRaw = {...route};
                menu.children = this.filterNestedMenu(route.children);
                return menu;
            })
            .filter((menu) => menu.children?.length) as RouteRecordRaw[];
    }
}

export default new Menu();
