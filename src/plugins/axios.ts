import axios from "axios";
import {createToast} from "mosha-vue-toastify";
import {authStore} from "../store/auth";
import {useRouter} from "vue-router";
import Vue, {getCurrentInstance} from "vue";
import {router} from "../router/router";

const service = axios.create({
    baseURL: localStorage.getItem('host') || "https://api.arknights.host/",
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


function post(url: string, params: object = {}) {
    const auth = authStore();

    return new Promise((resolve, reject) => {
        service.post(url, params)
            .then(response => {
                resolve(response.data);
            }, err => {
                if (err.response === undefined) {
                    createToast(
                        getCurrentInstance()?.appContext.config.globalProperties._translate('error.net_err'), {
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
                        useRouter().push({
                            path: '/auth/login',
                            query: {redirect: useRouter().currentRoute.value.fullPath}//从哪个页面跳转
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
export {post, patch, put, get, del};
// export const apiRegister = (params: any) => post("Auth", params); // Register
// export const apiLogin = (params: string) => get(`Auth/${params}`); // Login
// export const apiReLogin = (token: string) => get(`Auth/${token}`); // ReLogin
// export const apiCron = () => get("Nodes"); // Cron
// export const apiAnnounce = () => get("System/Announcement"); // Announce
// export const apiAddGame = (params: any) => post("Game", params); // Game
// export const apiGameLogin = (params: any) => post("Game/Login", params); // Game
// export const apiListGame = () => get("Game"); // GameList
// export const apiDelGame = (params: any) => del("Game", params); // Del
// export const apiScreen = (account: string, platform: string) =>
//     get(`Game/Screenshot/${account}/${platform}`); // GetScreen
// export const apiDetails = (account: string, platform: string) =>
//     get(`Game/${account}/${platform}`); // GetDetails
// export const apiConf = (account: string, platform: string) =>
//     get(`Game/Config/${account}/${platform}`); // GetConf
// export const apiConfEdit = (account: string, platform: number, params: any) =>
//     post(`Game/Config/${account}/${platform}`, params); // UpdateConfig
// export const apiLog = (account: string, platform: number, index: string) =>
//     get(`Log/${account}/${platform}/${index}`); // Log
// export const apiScreenshots = (account: string, platform: number) =>
//     get(`Game/Screenshots/${account}/${platform}`); // GetScreen
// export const apiGetMapList = () => get("System/Maps"); // GetMapList
//
// export const apiGetLog = () => get("System/LogFile"); // GetLog
// export const apiGameDataUpdate = () => post("System/GameDataUpdate", {}); // UpdateData
// export const apiEditAnnounce = (params: any) =>
//     post("System/Announcement", params); // EditAnnounce
// export const apiStatus = () => get("System/Status"); // Status
