export class UserModule {
    createTs: number | undefined
    scriptName: string | undefined
    scriptDesc: string | undefined
    deleted: boolean | undefined
    inCompied: boolean | undefined
    scriptHash: string | undefined
    compiled: number | undefined
    moduleName: string | undefined
    moduleVersion: string | undefined
    moduleType: number | undefined
}

export class GameModuleStatus {
    gameAccount: string | undefined
    scriptHash: string | undefined
    scriptName: string | undefined
    enabled: boolean | undefined
}

export const moduleRunningType = (type: number) => {
    switch (type) {
        case 0:
            return "留档模块（禁用）"
        case 1:
            return "单次执行模块"
        case 2:
            return "触发型模块"
        case 3:
            return "定时模块"
        default:
            return "未知类型(" + type + ")"
    }
}
export const compiledType = (type: number) => {
    switch (type) {
        case 0:
            return {
                type: "未编译",
                color: "",
                btn: "开始编译",
            }
        case 1:
            return {
                type: "编译失败",
                color: "text-error",
            }
        case 2:
            return {
                type: "模块载入失败",
                color: "text-error",
            }
        case 3:
            return {
                type: "编译成功",
                color: "text-success",
            }
    }
}