import {createToast, ToastType} from "mosha-vue-toastify";
import {useTranslate} from "./translate";


export function useToast() {
    const {translate} = useTranslate();
    const showMessage = (key: string, timeout: number = 1000, type: ToastType = "info", ...args: any[]) => {
        createToast(translate(key, args), {
            showIcon: true,
            type: type,
            transition: "bounce",
            timeout: timeout,
        });
    }
    return {
        showMessage,
    }
}