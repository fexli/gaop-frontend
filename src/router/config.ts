import {RouteRecordRaw} from "vue-router";
import global_const from "../utils/global_const";

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
        props: {
            hidden: false,
        },
        children: [
            {
                path: '/auth/login',
                name: 'login',
                meta: {
                    title: 'Login'
                },
                component: () => import('../views/auth/Login.vue')
            },
            {
                path: '/auth/register',
                name: 'register',
                meta: {
                    title: 'Register'
                },
                component: () => import('../views/auth/Register.vue')
            }
        ]
    },
    {
        path: '/db',
        component: () => import('../components/layouts/LayoutDatabase.vue'),
        meta: {
            title: 'DataBase'
        },
        redirect: '/db/summary',
        props: {
            hidden: false,
        },
        children: [
            {
                path: '/db/summary',
                name: 'ark_db_2',
                component: () => import("../views/ArkDB.vue"),
                meta: {
                    title: 'ark_db_2',
                },
                children: [],
            },
            {
                path: '/db/char/:charId',
                name: 'ark_db_char',
                component: () => import("../components/parts/arkdb/CharDBInfo.vue"),
                meta: {
                    title: 'ark_db_char',
                },
                children: [],
            },
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
        props: {
            default: true,
        },
        redirect: '/dashboard',
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: 'dashboard',
                    group: 'apps',
                    icon: {
                        d: 'M19,5V7H15V5H19M9,5V11H5V5H9M19,13V19H15V13H19M9,17V19H5V17H9M21,3H13V9H21V3M11,3H3V13H11V3M21,11H13V21H21V11M11,15H3V21H11V15Z',
                    }
                },
                component: () => import('../views/Dashboard.vue')
            },
            {
                path: '/account',
                name: 'accounts',
                component: () => import('../views/AccountManage.vue'),
                meta: {
                    title: 'accounts',
                    group: 'apps',
                    icon: {
                        d: 'M10 4A4 4 0 0 0 6 8A4 4 0 0 0 10 12A4 4 0 0 0 14 8A4 4 0 0 0 10 4M10 6A2 2 0 0 1 12 8A2 2 0 0 1 10 10A2 2 0 0 1 8 8A2 2 0 0 1 10 6M17 12C16.84 12 16.76 12.08 16.76 12.24L16.5 13.5C16.28 13.68 15.96 13.84 15.72 14L14.44 13.5C14.36 13.5 14.2 13.5 14.12 13.6L13.16 15.36C13.08 15.44 13.08 15.6 13.24 15.68L14.28 16.5V17.5L13.24 18.32C13.16 18.4 13.08 18.56 13.16 18.64L14.12 20.4C14.2 20.5 14.36 20.5 14.44 20.5L15.72 20C15.96 20.16 16.28 20.32 16.5 20.5L16.76 21.76C16.76 21.92 16.84 22 17 22H19C19.08 22 19.24 21.92 19.24 21.76L19.4 20.5C19.72 20.32 20.04 20.16 20.28 20L21.5 20.5C21.64 20.5 21.8 20.5 21.8 20.4L22.84 18.64C22.92 18.56 22.84 18.4 22.76 18.32L21.72 17.5V16.5L22.76 15.68C22.84 15.6 22.92 15.44 22.84 15.36L21.8 13.6C21.8 13.5 21.64 13.5 21.5 13.5L20.28 14C20.04 13.84 19.72 13.68 19.4 13.5L19.24 12.24C19.24 12.08 19.08 12 19 12H17M10 13C7.33 13 2 14.33 2 17V20H11.67C11.39 19.41 11.19 18.77 11.09 18.1H3.9V17C3.9 16.36 7.03 14.9 10 14.9C10.43 14.9 10.87 14.94 11.3 15C11.5 14.36 11.77 13.76 12.12 13.21C11.34 13.08 10.6 13 10 13M18.04 15.5C18.84 15.5 19.5 16.16 19.5 17.04C19.5 17.84 18.84 18.5 18.04 18.5C17.16 18.5 16.5 17.84 16.5 17.04C16.5 16.16 17.16 15.5 18.04 15.5Z',
                    }
                },
                children: [],
            },
            {
                path: '/test-spine',
                name: 'test_spine',
                component: () => import("../views/SpineTest.vue"),
                meta: {
                    title: 'test_spine',
                    group: 'apps',
                    icon: {
                        d: 'M4,2H14V4H4V14H2V4C2,2.89 2.89,2 4,2M8,6H18V8H8V18H6V8C6,6.89 6.89,6 8,6M12,10H20C21.11,10 22,10.89 22,12V20C22,21.11 21.11,22 20,22H12C10.89,22 10,21.11 10,20V12C10,10.89 10.89,10 12,10M14,12V20L20,16L14,12Z',
                    }
                },
                children: [],
            },
            {
                path: '/ark-db',
                name: 'ark_db',
                component: () => import("../views/ArkDB.vue"),
                meta: {
                    title: 'ark_db',
                    group: 'apps',
                    icon: {
                        d: 'M11 18.95C7.77 18.72 6 17.45 6 17V14.77C7.13 15.32 8.5 15.69 10 15.87C10 15.21 10.04 14.54 10.21 13.89C8.5 13.67 6.97 13.16 6 12.45V9.64C7.43 10.45 9.5 10.97 11.82 11C11.85 10.97 11.87 10.93 11.9 10.9C14.1 8.71 17.5 8.41 20 10.03V7C20 4.79 16.42 3 12 3S4 4.79 4 7V17C4 19.21 7.59 21 12 21C12.34 21 12.68 21 13 20.97C12.62 20.72 12.24 20.44 11.9 20.1C11.55 19.74 11.25 19.36 11 18.95M12 5C15.87 5 18 6.5 18 7S15.87 9 12 9 6 7.5 6 7 8.13 5 12 5M20.31 17.9C20.75 17.21 21 16.38 21 15.5C21 13 19 11 16.5 11S12 13 12 15.5 14 20 16.5 20C17.37 20 18.19 19.75 18.88 19.32L22 22.39L23.39 21L20.31 17.9M16.5 18C15.12 18 14 16.88 14 15.5S15.12 13 16.5 13 19 14.12 19 15.5 17.88 18 16.5 18Z',
                    }
                },
                children: [],
            },
            {
                path: '/script',
                name: 'script',
                component: () => import("../views/UserModules.vue"),
                meta: {
                    title: 'script',
                    group: 'apps',
                    icon: {
                        d: global_const.mdiPath['script-text-play-outline'],
                    }
                },
                children: [],
            },
            {
                path: '/admin',
                name: 'admin',
                component: () => import("../views/Admin.vue"),
                meta: {
                    title: 'admin',
                    group: 'apps',
                    icon: {
                        d: 'M17 9H8V7H17V9M7 7H5V9H7V7M7 4H5V6H7V4M10 4H8V6H10V4M13 17V19H14C14.55 19 15 19.45 15 20H22V22H15C15 22.55 14.55 23 14 23H10C9.45 23 9 22.55 9 22H2V20H9C9 19.45 9.45 19 10 19H11V17H4C2.89 17 2 16.11 2 15L2 3C2 1.89 2.9 1 4 1H20C21.11 1 22 1.89 22 3L22 15C22 16.11 21.11 17 20 17H13M20 15V3H4V15L20 15M11 6H19V4H11V6M5 12H11V10H5V12M13 14H19V12H13V14Z',
                    }
                },
                props: {
                    hiddenFunc: 1
                },
                children: [],
            },
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
            {
                path: '/about',
                name: 'about',
                meta: {
                    title: 'about',
                    group: 'apps',
                    icon: {
                        d: 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z'
                    }
                },
                component: () => import('../views/AboutUs.vue')
            },
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
            {
                path: '/account/dashboard/:platform/:user',
                component: () => import('../views/Account.vue'),
                name: 'account_dashboard',
                meta: {
                    nameAs: 'accounts',
                    hiddenInMenu: true,
                    title: 'account.dashboard',
                },
            },
        ]
    },
]
