import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import {createToast} from "mosha-vue-toastify";
import {publicRoute, protectedRoute} from "./config";
import {authStore} from "../store/auth";
import Nprogress from "../plugins/nprogress";

const allrouters = publicRoute.concat(protectedRoute)


export const router = createRouter({
    history: createWebHistory(),
    routes: allrouters,
});


const user = authStore();

router.beforeEach((to, from, next) => {
    Nprogress.start()
    const token = user.getAccessToken;
    if (to.path.startsWith('/static') || to.path.startsWith('/reader')) {
        next()
    } else if (to.name !== 'login' && to.name !== 'register') {
        if (token) {
            next()
        } else {
            // next({name: 'login', query: {redirect: to.path}})
            next({path: '/reader'})
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
