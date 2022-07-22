import {RouteRecordRaw} from "vue-router";

export const publicRoute: RouteRecordRaw[] = [
    {
        path: '/:pathMatch(.*)*',
        component: () => import('../views/error/NotFound.vue')
    },
    // {
    //     path: '/reader',
    //     component: LayoutStoryReader,
    //     meta: {
    //         title: 'StoryReader'
    //     },
    //     props:{
    //         hidden:false,
    //     },
    // },
    {
        path: '/auth',
        component: () => import('../components/layouts/LayoutAuth.vue'),
        meta: {
            title: 'Login'
        },
        redirect: '/auth/login',
        props:{
            hidden:false,
        },
        children: [
            {
                path: 'login',
                name: 'login',
                meta: {
                    title: 'Login'
                },
                component: () => import('../views/auth/Login.vue')
            },
            {
                path: 'register',
                name: 'register',
                meta: {
                    title: 'Register'
                },
                component: () => import('../views/auth/Register.vue')
            }
        ]
    },
    {
        path: '/404',
        name: '404',
        meta: {
            title: 'Not Found'
        },
        component: () => import('../views/error/NotFound.vue')
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: 'Forbidden'
        },
        component: () => import('../views/error/Deny.vue')
    },

    {
        path: '/500',
        name: '500',
        meta: {
            title: 'Server Error'
        },
        component: () => import('../views/error/Error.vue')
    }
]

export const protectedRoute: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import("../components/layouts/LayoutDefault.vue"),
        meta: {
            title: 'home',
            group: 'apps',
            icon: ''
        },
        redirect: '/dashboard',
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: 'dashboard',
                    group: 'apps',
                    icon: 'mdi-view-dashboard-outline'
                },
                component: () => import('../views/Dashboard.vue')
            },
            // {
            //     path: '/account/manage',
            //     name: 'account_manage',
            //     meta: {
            //         title: 'account_manage',
            //         group: 'apps',
            //         icon: 'mdi-account-cog-outline'
            //     },
            //     component: () => import('@/views/Me.vue')
            // },
            // {
            //     path: '/account',
            //     name: 'me',
            //     component: RouteWrapper,
            //     meta: {
            //         title: 'me',
            //         group: 'apps',
            //         icon: 'mdi-account-outline'
            //     },
            //     redirect: '/account/manage',
            //     children: [],
            // },
            // {
            //     path: '/settings',
            //     name: 'settings',
            //     meta: {
            //         title: 'settings',
            //         group: 'apps',
            //         icon: 'mdi-cog-outline'
            //     },
            //     component: () => import('@/views/Settings.vue')
            // },
            // {
            //     path: '/about',
            //     name: 'about',
            //     meta: {
            //         title: 'about',
            //         group: 'apps',
            //         icon: 'mdi-information-outline'
            //     },
            //     component: () => import('@/views/AboutUs.vue')
            // },
            // {
            //     path: '/cards',
            //     name: 'cards',
            //     meta: {
            //         title: 'cards',
            //         group: 'apps',
            //         icon: 'mdi-card-bulleted-outline'
            //     },
            //     component: () => import('@/views/FunCards.vue')
            // },
            // {
            //     path: '/gacha',
            //     name: 'gacha',
            //     meta: {
            //         title: 'gacha',
            //         group: 'apps',
            //         icon: 'mdi-rocket-launch-outline'
            //     },
            //     component: () => import('@/views/GachaRec.vue')
            // },
            // {
            //     path: '/innerreader',
            //     component: LayoutStoryReader,
            //     meta: {
            //         title: 'reader',
            //         group: 'apps',
            //         icon: 'mdi-book-open-page-variant-outline'
            //     },
            //     props:{
            //         hidden:false,
            //     },
            // },
            // {
            //     path: '/arkdb',
            //     meta: {
            //         title: 'arkdb',
            //         group: 'apps',
            //         icon: 'mdi-database-outline'
            //     },
            //     props:{
            //         hidden:false,
            //     },
            //     component: () => import('@/views/ArkDB.vue')
            // },
            // {
            //     path: '/test',
            //     name: 'test',
            //     meta: {
            //         title: 'test',
            //         group: 'apps',
            //         icon: 'mdi-test-tube'
            //     },
            //     component: () => import('@/views/TestPageAny.vue')
            // },
            // {
            //     path: '/account/dashboard/:platform/:user',
            //     component: LayoutAccount,
            //     name: 'account_dashboard',
            //     meta: {
            //         hiddenInMenu: true,
            //         title: 'account.dashboard',
            //     },
            // },
        ]
    }
]
