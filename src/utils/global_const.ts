import {planRecruit, getRecruitDetail, combinations} from "./recruit_planner"

const loggerLvlType = {
    1: {
        color: '#00d9ff',
        name: 'DEBUG',
        name_cn: '调试',
        icon: 'bug-outline'
    },
    2: {
        color: 'yellow',
        name: 'HELP',
        name_cn: '帮助',
        icon: 'help-circle-outline'
    },
    4: {
        color: '#bde7d3',
        name: 'COMMON',
        name_cn: '常规',
        icon: 'check-circle-outline'
    },
    8: {
        color: '#6ef88d',
        name: 'SYSTEM',
        name_cn: '系统',
        icon: 'cog-outline'
    },
    16: {
        color: '#f1b40d',
        name: 'WARNING',
        name_cn: '警告',
        icon: 'alert-circle-outline'
    },
    32: {
        color: '#f4293a',
        name: 'ERROR',
        name_cn: '错误',
        icon: 'close-circle-outline'
    },
    64: {
        color: '#44a2de',
        name: 'NOTICE',
        name_cn: '提示',
        icon: 'bell-outline'
    },
    128: {
        color: '#ff6a00',
        name: 'FATAL',
        name_cn: '致命错误',
        icon: 'skull-outline'
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
const aopVersion = '2.1a - 1.8.81'

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
    "database-search-outline": "M11 18.95C7.77 18.72 6 17.45 6 17V14.77C7.13 15.32 8.5 15.69 10 15.87C10 15.21 10.04 14.54 10.21 13.89C8.5 13.67 6.97 13.16 6 12.45V9.64C7.43 10.45 9.5 10.97 11.82 11C11.85 10.97 11.87 10.93 11.9 10.9C14.1 8.71 17.5 8.41 20 10.03V7C20 4.79 16.42 3 12 3S4 4.79 4 7V17C4 19.21 7.59 21 12 21C12.34 21 12.68 21 13 20.97C12.62 20.72 12.24 20.44 11.9 20.1C11.55 19.74 11.25 19.36 11 18.95M12 5C15.87 5 18 6.5 18 7S15.87 9 12 9 6 7.5 6 7 8.13 5 12 5M20.31 17.9C20.75 17.21 21 16.38 21 15.5C21 13 19 11 16.5 11S12 13 12 15.5 14 20 16.5 20C17.37 20 18.19 19.75 18.88 19.32L22 22.39L23.39 21L20.31 17.9M16.5 18C15.12 18 14 16.88 14 15.5S15.12 13 16.5 13 19 14.12 19 15.5 17.88 18 16.5 18Z",
    "gold": "M1 22L2.5 17H9.5L11 22H1M13 22L14.5 17H21.5L23 22H13M6 15L7.5 10H14.5L16 15H6M23 6.05L19.14 7.14L18.05 11L16.96 7.14L13.1 6.05L16.96 4.96L18.05 1.1L19.14 4.96L23 6.05Z",
    "account-multiple": "M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z",
    "domain": "M18,15H16V17H18M18,11H16V13H18M20,19H12V17H14V15H12V13H14V11H12V9H20M10,7H8V5H10M10,11H8V9H10M10,15H8V13H10M10,19H8V17H10M6,7H4V5H6M6,11H4V9H6M6,15H4V13H6M6,19H4V17H6M12,7V3H2V21H22V7H12Z",
    "human-queue": "M5 6C3.9 6 3 6.9 3 8S3.9 10 5 10 7 9.11 7 8 6.11 6 5 6M12 4C10.9 4 10 4.89 10 6S10.9 8 12 8 14 7.11 14 6 13.11 4 12 4M19 2C17.9 2 17 2.9 17 4S17.9 6 19 6 21 5.11 21 4 20.11 2 19 2M3.5 11C2.67 11 2 11.67 2 12.5V17H3V22H7V17H8V12.5C8 11.67 7.33 11 6.5 11H3.5M10.5 9C9.67 9 9 9.67 9 10.5V15H10V20H14V15H15V10.5C15 9.67 14.33 9 13.5 9H10.5M17.5 7C16.67 7 16 7.67 16 8.5V13H17V18H21V13H22V8.5C22 7.67 21.33 7 20.5 7H17.5Z",
    "map-legend": "M9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21L3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19.03 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3L20.34,3.03L15,5.1L9,3M8,5.45V17.15L5,18.31V6.46L8,5.45M10,5.47L14,6.87V18.53L10,17.13V5.47M19,5.7V17.54L16,18.55V6.86L19,5.7M7.46,6.3L5.57,6.97V9.12L7.46,8.45V6.3M7.46,9.05L5.57,9.72V11.87L7.46,11.2V9.05M7.46,11.8L5.57,12.47V14.62L7.46,13.95V11.8M7.46,14.55L5.57,15.22V17.37L7.46,16.7V14.55Z",
    "bug-outline": "M20,8H17.19C16.74,7.2 16.12,6.5 15.37,6L17,4.41L15.59,3L13.42,5.17C12.96,5.06 12.5,5 12,5C11.5,5 11.05,5.06 10.59,5.17L8.41,3L7,4.41L8.62,6C7.87,6.5 7.26,7.21 6.81,8H4V10H6.09C6.03,10.33 6,10.66 6,11V12H4V14H6V15C6,15.34 6.03,15.67 6.09,16H4V18H6.81C8.47,20.87 12.14,21.84 15,20.18C15.91,19.66 16.67,18.9 17.19,18H20V16H17.91C17.97,15.67 18,15.34 18,15V14H20V12H18V11C18,10.66 17.97,10.33 17.91,10H20V8M16,15A4,4 0 0,1 12,19A4,4 0 0,1 8,15V11A4,4 0 0,1 12,7A4,4 0 0,1 16,11V15M14,10V12H10V10H14M10,14H14V16H10V14Z",
    "help-circle-outline": "M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z",
    "play": "M8,5.14V19.14L19,12.14L8,5.14Z",
    "alert-circle-outline": "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",
    "close-box": "M19,3H16.3H7.7H5A2,2 0 0,0 3,5V7.7V16.4V19A2,2 0 0,0 5,21H7.7H16.4H19A2,2 0 0,0 21,19V16.3V7.7V5A2,2 0 0,0 19,3M15.6,17L12,13.4L8.4,17L7,15.6L10.6,12L7,8.4L8.4,7L12,10.6L15.6,7L17,8.4L13.4,12L17,15.6L15.6,17Z",
    "bell-outline": "M10 21H14C14 22.1 13.1 23 12 23S10 22.1 10 21M21 19V20H3V19L5 17V11C5 7.9 7 5.2 10 4.3V4C10 2.9 10.9 2 12 2S14 2.9 14 4V4.3C17 5.2 19 7.9 19 11V17L21 19M17 11C17 8.2 14.8 6 12 6S7 8.2 7 11V18H17V11Z",
    "space-invaders": "M7,6H5V4H7V6M17,6H19V4H17V6M23,12V18H21V14H19V18H17V16H7V18H5V14H3V18H1V12H3V10H5V8H7V6H9V8H15V6H17V8H19V10H21V12H23M15,10V12H17V10H15M7,12H9V10H7V12M11,18H7V20H11V18M17,18H13V20H17V18Z",
    "skull-outline": "M8,15A2,2 0 0,1 6,13A2,2 0 0,1 8,11A2,2 0 0,1 10,13A2,2 0 0,1 8,15M10.5,17L12,14L13.5,17H10.5M16,15A2,2 0 0,1 14,13A2,2 0 0,1 16,11A2,2 0 0,1 18,13A2,2 0 0,1 16,15M22,11A10,10 0 0,0 12,1A10,10 0 0,0 2,11C2,13.8 3.2,16.3 5,18.1V22H19V18.1C20.8,16.3 22,13.8 22,11M17,20H15V18H13V20H11V18H9V20H7V17.2C5.2,15.7 4,13.5 4,11A8,8 0 0,1 12,3A8,8 0 0,1 20,11C20,13.5 18.8,15.8 17,17.2V20Z",
    "close-circle-outline": "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z",
    "check-circle-outline": "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z",
    "dice-multiple-outline": "M14 8C13.45 8 13 7.55 13 7S13.45 6 14 6C14.55 6 15 6.45 15 7C15 7.55 14.55 8 14 8M12 12V19H5V12H12M12.78 10H4.22C3.55 10 3 10.55 3 11.22V19.78C3 20.45 3.55 21 4.22 21H12.78C13.45 21 14 20.45 14 19.78V11.22C14 10.55 13.45 10 12.78 10M19.78 3H11.22C10.55 3 10 3.55 10 4.22V8H12V5H19V12H16V14H19.78C20.45 14 21 13.45 21 12.78V4.22C21 3.55 20.45 3 19.78 3M17 8C16.45 8 16 7.55 16 7S16.45 6 17 6C17.55 6 18 6.45 18 7C18 7.55 17.55 8 17 8M17 11C16.45 11 16 10.55 16 10S16.45 9 17 9C17.55 9 18 9.45 18 10C18 10.55 17.55 11 17 11M7 15C6.45 15 6 14.55 6 14S6.45 13 7 13C7.55 13 8 13.45 8 14C8 14.55 7.55 15 7 15M10 18C9.45 18 9 17.55 9 17S9.45 16 10 16C10.55 16 11 16.45 11 17C11 17.55 10.55 18 10 18",
    "format-list-bulleted-type": "M5,9.5L7.5,14H2.5L5,9.5M3,4H7V8H3V4M5,20A2,2 0 0,0 7,18A2,2 0 0,0 5,16A2,2 0 0,0 3,18A2,2 0 0,0 5,20M9,5V7H21V5H9M9,19H21V17H9V19M9,13H21V11H9V13Z",
    "format-list-numbered": "M7,13V11H21V13H7M7,19V17H21V19H7M7,7V5H21V7H7M3,8V5H2V4H4V8H3M2,17V16H5V20H2V19H4V18.5H3V17.5H4V17H2M4.25,10A0.75,0.75 0 0,1 5,10.75C5,10.95 4.92,11.14 4.79,11.27L3.12,13H5V14H2V13.08L4,11H2V10H4.25Z",
    "account-arrow-up-outline": "M17 17V21H19V17H21L18 14L15 17H17M11 4C8.8 4 7 5.8 7 8S8.8 12 11 12 15 10.2 15 8 13.2 4 11 4M11 6C12.1 6 13 6.9 13 8S12.1 10 11 10 9 9.1 9 8 9.9 6 11 6M11 13C8.3 13 3 14.3 3 17V20H12.5C12.2 19.4 12.1 18.8 12 18.1H4.9V17C4.9 16.4 8 14.9 11 14.9C11.5 14.9 12 15 12.5 15C12.8 14.4 13.1 13.8 13.6 13.3C12.6 13.1 11.7 13 11 13",
    "timetable": "M14,12H15.5V14.82L17.94,16.23L17.19,17.53L14,15.69V12M4,2H18A2,2 0 0,1 20,4V10.1C21.24,11.36 22,13.09 22,15A7,7 0 0,1 15,22C13.09,22 11.36,21.24 10.1,20H4A2,2 0 0,1 2,18V4A2,2 0 0,1 4,2M4,15V18H8.67C8.24,17.09 8,16.07 8,15H4M4,8H10V5H4V8M18,8V5H12V8H18M4,13H8.29C8.63,11.85 9.26,10.82 10.1,10H4V13M15,10.15A4.85,4.85 0 0,0 10.15,15C10.15,17.68 12.32,19.85 15,19.85A4.85,4.85 0 0,0 19.85,15C19.85,12.32 17.68,10.15 15,10.15Z",
    "lock-alert-outline": "M10 17C8.9 17 8 16.1 8 15C8 13.9 8.9 13 10 13C11.1 13 12 13.9 12 15S11.1 17 10 17M16 20V10H4V20H16M16 8C17.1 8 18 8.9 18 10V20C18 21.1 17.1 22 16 22H4C2.9 22 2 21.1 2 20V10C2 8.9 2.9 8 4 8H5V6C5 3.2 7.2 1 10 1S15 3.2 15 6V8H16M10 3C8.3 3 7 4.3 7 6V8H13V6C13 4.3 11.7 3 10 3M22 7H20V13H22V7M22 15H20V17H22V15Z",
    "gift-off-outline": "M21 6H17.83C17.94 5.69 18 5.35 18 5C18 3.34 16.66 2 15 2C14 2 13.12 2.5 12.57 3.24V3.23L12 4L11.43 3.23V3.24C10.88 2.5 10 2 9 2C7.97 2 7.06 2.5 6.5 3.32L8.03 4.83C8.12 4.36 8.5 4 9 4C9.55 4 10 4.45 10 5C10 5.5 9.64 5.88 9.17 5.97L13 9.8V8H21V10H13.2L15.2 12H20V16.8L22 18.8V12C22.55 12 23 11.55 23 11V8C23 6.9 22.11 6 21 6M15 6C14.45 6 14 5.55 14 5S14.45 4 15 4 16 4.45 16 5 15.55 6 15 6M1.11 3L4.11 6H3C1.9 6 1 6.9 1 8V11C1 11.55 1.45 12 2 12V20C2 21.11 2.9 22 4 22H20C20.03 22 20.07 22 20.1 22L21.56 23.45L22.83 22.18L2.39 1.73L1.11 3M13 14.89L18.11 20H13V14.89M11 12.89V20H4V12H10.11L11 12.89M8.11 10H3V8H6.11L8.11 10Z",
    "video-off-outline": "M3.41,1.86L2,3.27L4.73,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16C16.21,18 16.39,17.92 16.55,17.82L19.73,21L21.14,19.59L12.28,10.73L3.41,1.86M5,16V8H6.73L14.73,16H5M15,8V10.61L21,16.61V6.5L17,10.5V7A1,1 0 0,0 16,6H10.39L12.39,8H15Z",
    "close": "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
    "": "",
}
const gameData: Record<string, any> = {}

const profNick = {
    CASTER: "术士",
    PIONEER: "先锋",
    TANK: "重装",
    SNIPER: "狙击",
    SUPPORT: "辅助",
    MEDIC: "医疗",
    SPECIAL: "特种",
    WARRIOR: "近卫",
    "": "未筛选",
} as Record<string, string>

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
    profNick
}