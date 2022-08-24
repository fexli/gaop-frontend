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
                    icon: {
                        d: 'M19,5V7H15V5H19M9,5V11H5V5H9M19,13V19H15V13H19M9,17V19H5V17H9M21,3H13V9H21V3M11,3H3V13H11V3M21,11H13V21H21V11M11,15H3V21H11V15Z',
                    }
                },
                component: () => import('../views/Dashboard.vue')
            },
            {
                path: '/account/manage',
                name: 'account_manage',
                meta: {
                    title: 'account_manage',
                    group: 'apps',
                    icon: {
                        d: 'M10 4A4 4 0 0 0 6 8A4 4 0 0 0 10 12A4 4 0 0 0 14 8A4 4 0 0 0 10 4M10 6A2 2 0 0 1 12 8A2 2 0 0 1 10 10A2 2 0 0 1 8 8A2 2 0 0 1 10 6M17 12C16.84 12 16.76 12.08 16.76 12.24L16.5 13.5C16.28 13.68 15.96 13.84 15.72 14L14.44 13.5C14.36 13.5 14.2 13.5 14.12 13.6L13.16 15.36C13.08 15.44 13.08 15.6 13.24 15.68L14.28 16.5V17.5L13.24 18.32C13.16 18.4 13.08 18.56 13.16 18.64L14.12 20.4C14.2 20.5 14.36 20.5 14.44 20.5L15.72 20C15.96 20.16 16.28 20.32 16.5 20.5L16.76 21.76C16.76 21.92 16.84 22 17 22H19C19.08 22 19.24 21.92 19.24 21.76L19.4 20.5C19.72 20.32 20.04 20.16 20.28 20L21.5 20.5C21.64 20.5 21.8 20.5 21.8 20.4L22.84 18.64C22.92 18.56 22.84 18.4 22.76 18.32L21.72 17.5V16.5L22.76 15.68C22.84 15.6 22.92 15.44 22.84 15.36L21.8 13.6C21.8 13.5 21.64 13.5 21.5 13.5L20.28 14C20.04 13.84 19.72 13.68 19.4 13.5L19.24 12.24C19.24 12.08 19.08 12 19 12H17M10 13C7.33 13 2 14.33 2 17V20H11.67C11.39 19.41 11.19 18.77 11.09 18.1H3.9V17C3.9 16.36 7.03 14.9 10 14.9C10.43 14.9 10.87 14.94 11.3 15C11.5 14.36 11.77 13.76 12.12 13.21C11.34 13.08 10.6 13 10 13M18.04 15.5C18.84 15.5 19.5 16.16 19.5 17.04C19.5 17.84 18.84 18.5 18.04 18.5C17.16 18.5 16.5 17.84 16.5 17.04C16.5 16.16 17.16 15.5 18.04 15.5Z',

                    },
                },
                component: () => import('../views/AccountManage.vue')
            },
            {
                path: '/account',
                name: 'me',
                component: () => import("../components/layouts/RouteWrapper.vue"),
                meta: {
                    title: 'me',
                    group: 'apps',
                    icon: {
                        d: 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z',
                    }
                },
                redirect: '/account/manage',
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
