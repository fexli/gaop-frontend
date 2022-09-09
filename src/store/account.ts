import {defineStore} from "pinia";
import global_const from "../utils/global_const";
import {authStore} from "./auth"
import {apiGetMe, getLogHistory, post, syncUserAccounts} from "../plugins/axios";
import {RouteRecordRaw, useRouter} from "vue-router";
import {router} from "../router/router";
import menu from "../hooks/menu";

export const accountStore = defineStore("account", {
    state: () => ({
        accountsList: [] as string[],//[str.]
        accountInfo: {} as Record<string, any>, //[gameUD]
        accountDetails: [],
        loggerStore: {} as Record<string, any>,
        loggerStoreUpdate: false,
        gameAccountLi: [] as any[],//游戏账号管理
        inRunningAccount: 0,//游戏账号管理
        webUserInfo: {} as any,
        accountAlert: {} as any,
    }),
    getters: {
        getAccountAlert: (state) => {
            return state.accountAlert
        },
        getAccounts: (state) => {
            return state.accountsList
        },
        getAccountInfo: (state) => {
            return state.accountInfo
        },
        getAccountDetail: (state) => {
            return state.accountDetails
        },
        getLoggerStore: (state) => {
            return state.loggerStore
        },
        getGameAccounList: (state) => {
            return state.gameAccountLi
        },
        getInRunningAccount: (state) => {
            return state.inRunningAccount
        },
        getLoggerStoreUpdate: (state) => {
            return state.loggerStoreUpdate
        },
        getWebUserInfo: (state) => {
            return state.webUserInfo
        },
        getAvatar: (state) => {
            return state.webUserInfo.avatar
        }
    },
    actions: {
        hasAccountAlert(account: string, platform: Number) {
            // @ts-ignore
            return this.accountAlert[['I', 'G', 'B'][platform] + account] != null
        },
        setAccountAlert(account: string, platform: Number, alertArr: Array<any>) {
            // @ts-ignore
            this.accountAlert[['I', 'G', 'B'][platform] + account] = alertArr
        },
        setLoggerUpdate(bl: boolean) {
            this.loggerStoreUpdate = bl
        },
        setBasicLoggerInfo(info: any) {
            this.loggerStore = info
            this.loggerStoreUpdate = true
        },
        clearLoggerInfo(account: string, platform: Number) {
            // @ts-ignore
            this.loggerStore[global_const.getUserLogName(account, platform)] = undefined
            this.loggerStoreUpdate = true
        },
        setFinalLogInfo(info: any) {
            // console.log('setFinalLogInfo', state.loggerStore)
            for (let j = 0; j < this.gameAccountLi.length; j++) {
                let curAccount = this.gameAccountLi[j]
                if (`${global_const.getPlatform(curAccount['platform'])}${curAccount['account']}` === info.name) {
                    // @ts-ignore
                    this.gameAccountLi[j]['finalLog'] = info
                    this.addLoggerInfo(info)
                    this.loggerStoreUpdate = true
                    return true
                }
            }
        },
        addLoggerInfo(info: any) {
            // @ts-ignore
            if (this.loggerStore[info.name] === undefined) {
                // @ts-ignore
                this.loggerStore[info.name] = {lastTs: info['ts'], logs: [info]}
            } else {
                // @ts-ignore
                this.loggerStore[info.name]['logs'].push(info)
                // @ts-ignore
                this.loggerStore[info.name]['lastTs'] = info['ts']
            }
        },
        setStatusInfo(stn: any) {
            let {s, t, n} = stn
            for (let j = 0; j < this.gameAccountLi.length; j++) {
                let curAccount = this.gameAccountLi[j]
                // if (`${global_const.getPlatform(curAccount['platform'])}${curAccount['account']}` === n) {
                if (global_const.getUserLogName(curAccount['account'], curAccount['platform']) === n) {
                    // @ts-ignore
                    this.gameAccountLi[j]['status'] = s
                    // @ts-ignore
                    this.gameAccountLi[j]['statusText'] = t
                    return true
                }
            }
        },
        setAccounts(accounts: any) {
            this.accountsList = accounts
        },
        addAccountInfo(account: string, platform: Number, data: any) {
            // @ts-ignore
            account = ['I', 'G', 'B'][platform] + account
            // @ts-ignore
            if (this.accountInfo[account] == null) {
                // @ts-ignore
                this.accountInfo[account] = {}
            }
            // @ts-ignore
            this.accountInfo[account] = Object.assign(this.accountInfo[account], data)
        },
        removeAccountInfo(account: string, platform: Number) {
            // @ts-ignore
            account = ['I', 'G', 'B'][platform] + account
            // @ts-ignore
            this.accountInfo[account] = {}
        },
        getHistoryLog: function () {
            getLogHistory().then(
                (suc) => {
                    console.log(suc)
                    // @ts-ignore
                    this.setBasicLoggerInfo(suc.data)
                }).catch((err) => {
                console.log(err)
            })
        },
        getSyncUserData() {
            const auth = authStore()
            if (!auth.getAccessToken)
                return
            return syncUserAccounts().then(
                (resp: any) => {
                    console.log('syncUserAccounts', resp)
                    this.gameAccountLi = resp.msg

                    let running = 0
                    let accountTree: RouteRecordRaw[] = []
                    let accounts: string[] = []
                    const platformCN = ['IOS', '安卓', 'B服']
                    for (let j = 0; j < resp.msg.length; j++) {
                        accountTree.push({
                            component: undefined,
                            redirect: "",
                            path: '/account/dashboard/' + resp.msg[j].platform + '/' + resp.msg[j].account,
                            name: 'account.p' + resp.msg[j].platform + '.' + resp.msg[j].account,
                            meta: {
                                title: '[' + platformCN[resp.msg[j].platform] + ']' + resp.msg[j].name,
                                group: 'apps',
                                translatable: false,
                                disp: resp.msg[j].name,
                                hiddenInMenu: resp.msg[j].status !== 2
                            }
                            // component: () => import('@/views/Account.vue')
                        })
                        accounts.push(['I', 'G', 'B'][resp.msg[j].platform] + resp.msg[j].account)
                        if (resp.msg[j].status >= 1)
                            running++
                    }
                    console.log(accountTree, menu.menus.value[1].children)
                    // @ts-ignore
                    for (let child of menu.menus.value[1].children) {
                        if (child.path === '/account') {
                            console.log("Inject accountTree success", accountTree)
                            child.children = accountTree
                            break
                        }
                    }
                    this.accountsList = accounts
                    this.inRunningAccount = running
                    console.log("try get me")
                    apiGetMe().then(
                        (resp: any) => {
                            this.webUserInfo = resp
                        }
                    ).catch(
                        (err: any) => {
                            console.log(err)
                        }
                    )

                    return {success: 1, result: resp}
                }).catch(
                (err: any) => {
                    console.log("err", err)
                    return {success: 0, result: err}
                })
        },
        setAccountInfo(account: string, platform: Number, data: any) {
            let gameUserID = global_const.getUserLogName(account, platform as number)
            this.setAccountInfoById(gameUserID, data)
        },
        setAccountInfoById(userId: string, data: any) {
            if (this.accountInfo[userId] == null) {
                this.accountInfo[userId] = {}
            }
            this.accountInfo[userId] = Object.assign(this.accountInfo[userId], data)
        }
    },
});
