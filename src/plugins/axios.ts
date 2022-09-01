import axios from "axios";
import {createToast} from "mosha-vue-toastify";
import {authStore} from "../store/auth";
import {useRouter} from "vue-router";
import Vue, {getCurrentInstance} from "vue";
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
export const syncUserAccounts = () => post('/account/syncUserAccounts');
export const getLogHistory = () => post('/game/getLogHistory');
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
export const finishCaptcha = (captcha: any) => post('/account/finishCaptcha', captcha);
