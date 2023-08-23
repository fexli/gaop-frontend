import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import {createToast} from "mosha-vue-toastify";
import {publicRoute, protectedRoute} from "./config";
import {authStore} from "../store/auth";
import Nprogress from "../plugins/nprogress";

const allrouters = publicRoute.concat(protectedRoute)


export const router = createRouter({
    history: createWebHistory("#"),
    routes: allrouters,
    linkActiveClass: 'active',
});



router.beforeEach((to, from, next) => {
    Nprogress.start()
    // next()
    const user = authStore();
    const token = user.getAccessToken;
    if (
        to.path.startsWith('/static') || to.path.startsWith('/reader') || to.path.startsWith('/ark-db') || to.path.startsWith('/db')
    ) {
        next()
    } else if (to.name !== 'login' && to.name !== 'register') {
        if (token) {
            next()
        } else {
            // next({name: 'login', query: {redirect: to.path}})
            next({path: '/auth/login'})
        }
    } else {
        if (token) {
            next({path: '/'})
        } else {
            next()
        }
    }
})

router.afterEach(() => {
    Nprogress.done()
})
