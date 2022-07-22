import { useI18n } from "vue-next-i18n";

export function useLoginPlaceholder() {
    const { t } = useI18n();

    const usernameInputText = computed(() => {
        return t("login.username");
    });

    const passwordInputText = computed(() => {
        return t("login.password");
    });

    const regUserInputText = computed(() => {
        return t("register.username");
    });

    const regPassInputText = computed(() => {
        return t("register.password");
    });

    const regInviteInputText = computed(() => {
        return t("register.invitecode");
    });

    return {
        passwordInputText,
        usernameInputText,
        regPassInputText,
        regUserInputText,
        regInviteInputText
    };
}
