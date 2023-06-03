import axios from "axios";
import {createToast} from "mosha-vue-toastify";
import {authStore} from "../store/auth";
import {router} from "../router/router";
import {useI18n} from "vue-next-i18n";

const service = axios.create({
    baseURL: localStorage.getItem('host') || "https://akapi.aopcore.com/",
    timeout: 50000,
});

service.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
service.defaults.headers.post['Access-Control-Allow-Origin'] = '*';


const err = (error: any) => {
    // const {status, data} = error.response
    // const {errors} = data
    // let message = []
    // for (let field in errors) {
    //     message.push(errors[field])
    // }
    // switch (status) {
    //     case 400:
    //         window._NOTICE('Bad Request:' + data.message, 2000, 'error')
    //         break
    //     case 422:
    //         window._NOTICE(message, 2000, 'error')
    //         break
    //     case 401:
    //         window._NOTICE(this._translate('login.auth_fail'), 2000, 'error')
    //         break
    //     case 403:
    //         window._NOTICE(this._translate('error.access_denied'), 2000, 'error')
    //         break
    //     case 404:
    //         window._NOTICE(this._translate('error.not_found'), 2000, 'error')
    //         break
    //     case 500:
    //         window._NOTICE(this._translate('error.server_err'), 2000, 'warning')
    //         break
    //     default:
    //         break
    // }
    return Promise.reject(error)
}

service.interceptors.request.use((config) => {
    const auth = authStore();
    // @ts-ignore
    config.headers['Access-Control-Allow-Origin'] = '*'
    // @ts-ignore
    config.headers['Content-Type'] = 'application/json'
    // @ts-ignore
    config.headers['Authorization'] = auth.getAccessToken
    return config
}, err)

function setAccessToken(token: string) {
    service.defaults.headers.post['Authorization'] = token;
    service.defaults.headers.get['Authorization'] = token;
}

function post(url: string, params: object = {}) {
    const auth = authStore();

    return new Promise((resolve, reject) => {
        service.post(url, params)
            .then(response => {
                resolve(response.data);
            }, err => {
                if (err.response === undefined) {
                    createToast(
                        useI18n().t('error.net_err'), {
                            showIcon: true,
                            type: 'danger',
                            timeout: 2000,
                            transition: "bounce"
                        }
                    )
                } else if (err.response.status === 401) {
                    if (auth.getAccessToken !== null) {
                        auth.logout();
                        createToast(err.response.data.msg, {
                            showIcon: true,
                            type: 'danger',
                            timeout: 2000,
                            transition: "bounce"
                        })
                        router.push({
                            path: '/auth/login',
                            // query: {redirect: router.currentRoute.value.query.toString()}//从哪个页面跳转
                        })
                    }
                }
                reject(err.response)
            })
    })
    // return new Promise((resolve) => {
    //     service.post(url, params).then((res) => {
    //         resolve(res);
    //     });
    // });
}

function patch(url: string, data: any = null) {
    return new Promise((resolve, reject) => {
        service.patch(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

function put(url: string, data: any = null) {
    return new Promise((resolve, reject) => {
        service.put(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

function get(url: string, data: any = null) {
    return new Promise((resolve, reject) => {
        service.get(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

function del(url: string, params: any) {
    return new Promise((resolve) => {
        axios.delete(url, {data: params}).then((res) => {
            resolve(res);
        });
    });
}

export default service;
export {post, patch, put, get, del, setAccessToken};

export const apiAuthRegister = (username: string, password: string, invitecode: string) => post('/auth/register', {
    username,
    password,
    invitecode
});
export const apiAuthLogin = (username: string, password: string) => post('/auth/login', {
    username,
    password
})
export const apiGetMe = () => post("/account/me");
export const apiGetAnnounce = () => get("/conf/announce");
export const apiGetConfig = () => get("/conf/getConf");
export const apiSetConfig = (data: Record<string, boolean>) => post("/conf/setConf", data);
export const apiPostAnnounce = (title: string, titlebar: string, content: string) => post("/conf/announce", {
    title: title,
    title_bar: titlebar,
    content: content
});
export const syncUserAccounts = () => post('/account/syncUserAccounts');
export const getUserEvents = () => get('/account/events');
export const createUserEvents = (data: Record<string, any>) => post('/account/events', data);
export const deleteUserEvents = (eventId: number) => post('/account/events/delete', {
    eventId
});
export const updateUserEvents = (data: Record<string, any>) => post('/account/events/update', data);
export const getLogHistory = () => post('/game/getLogHistory');
export const gameFreezeAccount = (username: string, platform: number) => post('/game/freezeAccount', {
    username,
    platform
});
export const gameUnFreezeAccount = (username: string, platform: number) => post('/game/unFreezeAccount', {
    username,
    platform
});
export const gameStartAccount = (username: string, platform: number) => post('/game/startAccount', {
    username,
    platform
});
export const gameStopAccount = (username: string, platform: number) => post('/game/stopAccount', {
    username,
    platform
});
export const gameCreateAccount = (username: string, password: string, nickname: string, platform: number) => post('/game/createAccount', {
    username,
    password,
    nickname,
    platform
});

export const gameDeleteAccount = (username: string, platform: number) => post('/game/deleteAccount', {
    username,
    platform
});
export const accountSetRemark = (username: string, platform: number, remark: string) => post('/account/setAccountRemark', {
    username,
    platform,
    remark
});
export const finishCaptcha = (captcha: any) => post('/account/finishCaptcha', captcha);
export const getGameUserCard = (username: string, platform: number) => post('/game/userCard', {
    username,
    platform
});
export const getGameSortAlert = (username: string, platform: number) => post('/game/getSortAlert', {
    username,
    platform
});
export const getGameUserInventory = (username: string, platform: number) => post('/game/inventory', {
    username,
    platform
});
export const listGameItemUse = (username: string, platform: number) => post('/game/listItemUse', {
    username,
    platform
});
export const addGameItemUse = (username: string, platform: number, itemId: string, itemInst: number, cnt: number, ex: string) => post('/game/addItemUse', {
    username,
    platform,
    itemId,
    itemInst,
    cnt,
    ex,
});
export const getGameUserTroop = (username: string, platform: number) => post('/game/troop', {
    username,
    platform
});
export const getGameUserBuilding = (username: string, platform: number) => post('/game/custom/building', {
    username,
    platform
});
export const getGameSettings = (username: string, platform: number) => post('/game/getSettings', {
    username,
    platform
});
export const getGameFriends = (username: string, platform: number) => post('/game/friends', {
    username,
    platform
});
export const setGameSettings = (username: string, platform: number, data: any) => post('/game/setSettings', {
    username,
    platform,
    setting: data
});
export const resetGameSettings = (username: string, platform: number) => post('/game/resetSettings', {
    username,
    platform
});
export const getGameUserCustomAll = (username: string, platform: number) => post('/game/custom/all', {
    username,
    platform
});
export const getGameInfoGSP = (username: string, platform: number) => post('/game/info/gs_poster', {
    username,
    platform
});
export const getMonitorInfos = () => post('/account/monitorAccounts', {});
export const getUserModuleList = () => get('/user-module/list', {});
export const uploadUserModule = (script: string, name: string, desc: string) => post('/user-module/upload', {
    script,
    name,
    desc
});
export const addByShareModule = (hash: string) => post('/user-module/addbyshare', {
    hash
});
export const compileUserModule = (hash: string) => post('/user-module/compile', {
    hash
});
export const deleteUserModule = (hash: string) => post('/user-module/delete', {
    hash
});
export const deployModuleToGames = (hash: string, accounts: any[], enable: boolean) => post('/user-module/quickdeploy', {
    hash,
    accounts,
    enable
});
export const getGameModuleList = (username: string, platform: number) => post('/game/module/list', {
    username,
    platform
});
export const addGameModuleList = (username: string, platform: number, hash: string) => post('/game/module/add', {
    username,
    platform,
    hash,
});
export const setGameModuleList = (username: string, platform: number, hash: string, enable: boolean) => post('/game/module/enable', {
    username,
    platform,
    hash,
    enable,
});
