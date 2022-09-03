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
    "d0", "d1", "d2", "d3", "d4",
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
const gameData: Record<string, any> = {}

export const getPlatformAka = function (platform: number) {
    return ['A', 'G', 'B'][platform]
}

export const getUserLogName = function (username: string, platform: number) {
    return ['A', 'G', 'B'][platform] + username
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
}