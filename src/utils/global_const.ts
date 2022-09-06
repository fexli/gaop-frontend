import {planRecruit, getRecruitDetail, combinations} from "./recruit_planner"

const loggerLvlType = {
    1: {
        color: '#007eff',
        name: 'DEBUG'
    },
    2: {
        color: 'yellow',
        name: 'HELP'
    },
    4: {
        color: 'white',
        name: 'COMMON'
    },
    8: {
        color: 'green',
        name: 'SYSTEM'
    },
    16: {
        color: 'red',
        name: 'WARNING'
    },
    32: {
        color: 'darkred',
        name: 'ERROR'
    },
    64: {
        color: 'darkorchid',
        name: 'NOTICE'
    },
    128: {
        color: 'black',
        name: 'FATAL'
    },
}
const itemTypes = {
    'ACTIVITY_COIN': '活动代币',
    'ACTIVITY_ITEM': '活动物品',
    'AP_BASE': '无人机',
    'AP_GAMEPLAY': '理智',
    'AP_ITEM': '理智物品',
    'AP_SUPPLY': '理智药剂',
    'CARD_EXP': '作战记录',
    'CRS_RUNE_COIN': '行动协议',
    'CRS_SHOP_COIN': '合约赏金',
    'DIAMOND': '至纯源石',
    'DIAMOND_SHD': '合成玉',
    'EPGS_COIN': '寻访参数模型',
    'ET_STAGE': '黑曜石节门票',
    'EXP_PLAYER': '玩家经验',
    'GOLD': '龙门币',
    'HGG_SHD': '高级凭证',
    'LGG_SHD': '资质凭证',
    'LIMITED_TKT_GACHA_10': '限定十连',
    'LINKAGE_TKT_GACHA_10': '联动十连',
    'LMTGS_COIN': '寻访数据契约',
    'MATERIAL': '养成素材',
    'RENAMING_CARD': '改名卡',
    'REP_COIN': '情报凭证',
    'SOCIAL_PT': '信用',
    'TKT_GACHA': '寻访凭证',
    'TKT_GACHA_10': '十连寻访凭证',
    'TKT_GACHA_PRSV': '预约干员',
    'TKT_INST_FIN': '加急许可',
    'TKT_RECRUIT': '招聘许可',
    'TKT_TRY': '演习券',
    'VOUCHER_CGACHA': '新年寻访凭证',
    'VOUCHER_MGACHA': '物资补给',
    'VOUCHER_PICK': '干员兑换券',
    'EXTERMINATION_AGENT': "剿灭代理卡",
    "VOUCHER_SKIN": "时装自选凭证",
}
const loginBG = {
    bg: [
        '88070667_p0.png', 'avg_0_1.png', 'avg_0_2.png', // 自定背景
        'avg_ac18_custom.png', // 凯尔希活动dump
        'E7_hYnXVIAAgxog.jpg', 'E7_hYnXVIAAgxog.jpg', // 水月
    ],
    avgs: [
        'bg_1_lastbreath.png',
        'avg_7_13.png',
        'avg_8_3.png', 'avg_8_37.png', 'avg_8_39.png', 'avg_8_40.png', 'avg_8_42.png', 'avg_8_15.png',
        'ac12_3.png',
        'avg_31_1.png', 'avg_31_2.png',
        'avg_40_2.png', 'avg_40_4.png', 'avg_40_2.png',
        'avg_ac16_3.png',
        'avg_ac17_9.png', 'avg_ac17_13.png',
        'avg_ac18_2.png', 'avg_ac18_3.png', 'avg_ac18_4.png', 'avg_ac18_2.png',
        'ac6_8.png', 'ac5_8.png',
        'ac18_02.png', 'ac18_07.png', 'ac18_09.png', 'ac18_11_1.png', 'ac18_11_3.png', 'ac18_12_1.png', 'ac18_12_2.png',
        'item_tll.png',
        '23_I01.png',
        '24_i03.png',
        '25_i01.png', '25_i03.png', '25_i05.png', '25_i06.png', '25_i09.png',
        '26_i01.png', '26_i16.png', '26_i14.png', '26_i07.png', '26_i12.png', '26_i13.png',
    ]
}

const loadingGIF = [
    "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8",
    "l0",
    "u0"
]
// const itemData = require('../data/item_table.json')['items']
// const characterData = require('../data/character_table.json')
// const gameConstData = require('../data/gamedata_const.json')
// const skillData = require('../data/skill_table.json')

const platformSelector = [
    {
        text: 'IOS',
        value: 0,
        disabled: true,
    },
    {
        text: '安卓',
        value: 1,
        disabled: false,
    },
    {
        text: 'B服',
        value: 2,
        disabled: false,
    }
]
const statusType = {
    '-1': 'red',
    '0': '#007eff',
    '1': 'green',
    '2': '#007eff',
    '3': 'red',
}
const aopVersion = '2.1a - 1.8.61'

const servers = [
    {
        name: "稳定服",
        server: "api.akaem.com:8082",
        secure: false,
    },
    {
        name: "测试服",
        server: "api.aksc.com:8084",
        secure: true,
    },
    {
        name: "[x]本地服",
        server: "127.0.0.1:8084",
        secure: false,
    },
    {
        name: "自定义",
        server: "",
        secure: false,
    },
]

const assetServer = "http://mc.mesord.com:8999/"

const mdiPath: Record<string, string> = {
    "cog-outline": "M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z",
    "comment-text-multiple-outline": "M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15M9,9H19V11H9V9M9,13H17V15H9V13Z",
    "chart-timeline": "M2,2H4V20H22V22H2V2M7,10H17V13H7V10M11,15H21V18H11V15M6,4H22V8H20V6H8V8H6V4Z",
    "package-variant": "M2,10.96C1.5,10.68 1.35,10.07 1.63,9.59L3.13,7C3.24,6.8 3.41,6.66 3.6,6.58L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.66,6.72 20.82,6.88 20.91,7.08L22.36,9.6C22.64,10.08 22.47,10.69 22,10.96L21,11.54V16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V10.96C2.7,11.13 2.32,11.14 2,10.96M12,4.15V4.15L12,10.85V10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V12.69L14,15.59C13.67,15.77 13.3,15.76 13,15.6V19.29L19,15.91M13.85,13.36L20.13,9.73L19.55,8.72L13.27,12.35L13.85,13.36Z",
    "ghost-outline": "M12 2C7.03 2 3 6.03 3 11V22L6 19L9 22L12 19L15 22L18 19L21 22V11C21 6.03 16.97 2 12 2M19 17.17L18 16.17L16.59 17.59L15 19.17L13.41 17.59L12 16.17L10.59 17.59L9 19.17L7.41 17.59L6 16.17L5 17.17V11C5 7.14 8.14 4 12 4S19 7.14 19 11V17.17M11 10C11 11.11 10.11 12 9 12S7 11.11 7 10 7.9 8 9 8 11 8.9 11 10M17 10C17 11.11 16.11 12 15 12S13 11.11 13 10 13.9 8 15 8 17 8.9 17 10Z",
    "home-account": "M12,3L2,12H5V20H19V12H22L12,3M12,8.75A2.25,2.25 0 0,1 14.25,11A2.25,2.25 0 0,1 12,13.25A2.25,2.25 0 0,1 9.75,11A2.25,2.25 0 0,1 12,8.75M12,15C13.5,15 16.5,15.75 16.5,17.25V18H7.5V17.25C7.5,15.75 10.5,15 12,15Z",
    "chart-bar-stacked": "M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21M18,14H22V16H18V14M12,6H16V9H12V6M16,15H12V10H16V15M6,10H10V12H6V10M10,16H6V13H10V16Z",
    "chess-pawn": "M19 22H5V20H19V22M16 18H8L10.18 10H8V8H10.72L10.79 7.74C10.1 7.44 9.55 6.89 9.25 6.2C8.58 4.68 9.27 2.91 10.79 2.25C12.31 1.58 14.08 2.27 14.74 3.79C15.41 5.31 14.72 7.07 13.2 7.74L13.27 8H16V10H13.82L16 18Z",
    "console-line": "M13,19V16H21V19H13M8.5,13L2.47,7H6.71L11.67,11.95C12.25,12.54 12.25,13.5 11.67,14.07L6.74,19H2.5L8.5,13Z",
    "": "",
}
const gameData: Record<string, any> = {}

export const getPlatformAka = function (platform: number) {
    return ['I', 'G', 'B'][platform]
}

export const getUserLogName = function (username: string, platform: number) {
    return ['I', 'G', 'B'][platform] + username
}
export default {
    loggerLvlType,
    loginBG,
    loadingGIF,
    // itemData,
    // characterData,
    // gameConstData,
    // skillData,
    itemTypes,
    aopVersion,
    servers,
    planRecruit,
    getRecruitDetail,
    combinations,
    platformSelector,
    statusType,
    // baseUrl,
    // secures,
    getPlatform: getPlatformAka,
    getUserLogName,
    gameData,
    mdiPath,
    assetServer,
}