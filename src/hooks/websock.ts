import {serverStore} from "../store/server";
import {authStore} from "../store/auth";
import {useToast} from "./toast";
import {ToastType} from "mosha-vue-toastify";
import {Ref} from "vue";
import {appStore} from "../store/app";
import {accountStore} from "../store/account";
import {_StoreWithState} from "pinia";


class WebSock {
    // @ts-ignore
    public wsInstance: WebSocket = undefined;
    public hasAuthed: boolean = false;
    public isActive: Ref<boolean> = ref(false);
    public wsReconTime: number = 0;
    private _showMessage: (key: string, timeout?: number, type?: ToastType, ...args: any[]) => void;
    public _setFinalLogInfo: Function | undefined;
    public _setStatusInfo: Function | undefined;

    constructor() {
        this._showMessage = () => {
            console.warn("useToast not setup")
        }
    }

    tempT() {
        this.isActive.value = !this.isActive.value;
    }

    setup() {
        const {showMessage} = useToast();
        this._showMessage = showMessage;
        const account = accountStore();
        this._setFinalLogInfo = account.setFinalLogInfo;
        this._setStatusInfo = account.setStatusInfo;
    }

    initWebSocket() {
        const server = serverStore();
        const wsuri = `ws${server.getSecure ? 's' : ''}://${server.getServer}/ws`
        this.clearWebSocket();
        console.log("ws init", wsuri)
        this.wsInstance = new WebSocket(wsuri);
        this.wsInstance.onmessage = this.onMessage()
        this.wsInstance.onopen = this.onWsOpen
        this.wsInstance.onerror = this.onWsError()
        this.wsInstance.onclose = this.onWsClose
    }

    public onMessage() {
        const that = this;
        return (e: MessageEvent) => {
            console.log("wsRer", e)
            if (typeof e.data !== "string") {
                console.log("wsRer DataNotString", e.data)
                return;
            }
            const redata = JSON.parse(e.data)
            console.log('wsRecv', redata)
            if (redata.errCode === 0) {
                switch (redata.type) {
                    case 0: {
                        // logger info
                        console.log('logger', redata.data)
                        // TODO:this.$logger(redata.data)
                        if (that._setFinalLogInfo) {
                            that._setFinalLogInfo(redata.data)
                        }
                        break
                    }
                    case 1: {
                        // state info
                        console.log('state', redata.data)
                        if (that._setStatusInfo) {
                            that._setStatusInfo(redata.data)
                        }
                        break
                    }
                    case 2: {
                        // captcha info
                        console.log('captcha', redata.data)
                        // TODO:this.captchaBox.push(redata.data)
                        // TODO:this.startCaptcha()
                    }
                }
            }
        }
    }

    public onWsClose() {
        this.isActive.value = false;
        this.hasAuthed = false;
        this.wsReconTime = 0;
        console.log("ws close");
    }

    public onWsError() {
        const auth = authStore();
        const that = this;
        return () => {
            that.isActive.value = false
            console.log("ws error")
            if (auth.getAccessToken == null || auth.getAccessToken == "") {
                return
            }
            if (that.wsReconTime === 0) {
                that._showMessage("ws.error_reconn", 4000, "warning");
                that.initWebSocket()
                that.wsReconTime += 5
            } else if (this.wsReconTime >= 20) {
                that._showMessage("ws.error", 200000, "danger");
            } else {
                console.log(that._showMessage)
                that._showMessage("ws.error_reconn_t", 4000, "warning", this.wsReconTime);
                setTimeout(() => {
                    that._showMessage("ws.error_reconn_r", 3000, "info");
                    that.initWebSocket()
                }, that.wsReconTime * 1000)
                that.wsReconTime += 5
            }
        };
    }

    public onWsSend(data: any) {
        if (!this.isActive.value) {
            return;
        }
        this.wsInstance.send(data);
    }

    public onWsOpen = () => {
        const auth = authStore();
        console.log("wsAcToken", auth.getAccessToken)
        if (!auth.getAccessToken) {
            return;
        }
        this.wsInstance.send(auth.getAccessToken);
        this.isActive.value = true;
        this.wsReconTime = 0;
    }

    private clearWebSocket() {
        if (this.wsInstance) {
            this.wsInstance.close();
        }
        this.hasAuthed = false;
        this.isActive.value = false;

    }
}

export default new WebSock();
