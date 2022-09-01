import {finishCaptcha} from "./axios";

class GeeTest {
    public captchaOverlay = ref(false);
    public captchaType = ref("未开启");
    public captchaBox = [] as any[];
    public captchaData = {
        challenge: '',
        gt: '',
    }

    startCaptcha() {
        if (this.captchaBox.length === 0) {
            return 0
        }
        if (this.captchaOverlay.value) {
            return 0
        }
        this.captchaData = this.captchaBox.pop()
        this.captchaOverlay.value = true
        this.getGeetest()
        this.captchaType.value = '生成中'
    }
    getGeetest() {
        const that = this
        const challenge = this.captchaData.challenge
        // @ts-ignore
        if (window["initGeetest"] === undefined) {
            console.log("没有初始化Geetest")
            return
        }
        // @ts-ignore
        window.initGeetest({
                gt: this.captchaData.gt,
                challenge: challenge,
                offline: false,
                new_captcha: true
            }, function (captchaObj: any) {
                console.log(captchaObj);
                captchaObj.onSuccess(function () {
                    let result = captchaObj.getValidate();
                    console.log(result)
                    that.captchaType.value = '验证成功，发送中'
                    finishCaptcha({
                        challenge: challenge,
                        geetest_challenge: result.geetest_challenge,
                        geetest_validate: result.geetest_validate,
                        geetest_seccode: result.geetest_seccode,
                    }).then((suc: any) => {
                        console.log(suc)
                        that.captchaOverlay.value = false
                        that.captchaType.value = '未开启'
                        that.startCaptcha()
                    }).catch((err) => {
                        console.log(err)
                    })
                })
                captchaObj.appendTo('#geetest')
                captchaObj.verify()
                that.captchaType.value = '等待验证'
            }
        )
    }
}

export default new GeeTest();
