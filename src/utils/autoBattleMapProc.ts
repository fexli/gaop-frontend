import global_const from "./global_const";

export class BattleMapWithTimes {
    mapId: string;
    times: number;

    constructor() {
        this.mapId = "";
        this.times = 0;
    }
}

export class ManagedSkillTarget {
    skillId: number;
    target: number;

    constructor() {
        this.skillId = 0;
        this.target = 0;
    }
}

export const ManagedCharTrainingUnknown = 0;
export const ManagedCharTrainingSkill = 1;
export const ManagedCharTrainingElite = 2;

export class ManagedCharTrainingInfo {
    charId: string;
    trainType: number;
    eliteTo: number;
    skillTarg: Array<ManagedSkillTarget>;

    constructor() {
        this.charId = "";
        this.trainType = 0;
        this.eliteTo = 0;
        this.skillTarg = [];
    }

    public Marshal(): string {
        let s = this.charId + "/"
        switch (this.trainType) {
            case ManagedCharTrainingElite:
                if (this.eliteTo === 0) {
                    return "";
                }
                s += "e/" + this.eliteTo;
                break;
            case ManagedCharTrainingSkill:
                if (this.skillTarg.length === 0) {
                    return "";
                }
                s += "s/";
                for (let i = 0; i < this.skillTarg.length; i++) {
                    if (i > 0) {
                        s += "/";
                    }
                    s += this.skillTarg[i].skillId + "-" + this.skillTarg[i].target;
                }
                break
        }
        return s;
    }
}

export class BattleParam implements Record<any, any> {
    type: string;
    maps: Array<string>;
    mapt: Array<BattleMapWithTimes>
    mng: Array<ManagedCharTrainingInfo>

    constructor() {
        this.type = "";
        this.maps = [];
        this.mapt = [];
        this.mng = [];
    }

    public Marshal(): string {
        return "TYPE=" + this.type +
            (this.maps.length > 0 ? "|MAP=" + this.maps.join(",") : "") +
            (this.mapt.length > 0 ? "|MAPT=" + this.mapt.map((v) => v.mapId + "~" + v.times).join(",") : "") +
            (this.mng.length > 0 ? "|MNG=" + this.mng.map((v) => v.Marshal()).filter((v) => v !== '').join(",") : "");
    }
}

export const bTypeDesc = [
    {
        type: 'AUTO',
        text: '随机选择[任意地图]',
        desc: '根据当前账号情况自动选择进攻地图',
        icon: 'dice-multiple-outline',
    },
    {
        type: 'RANDOM',
        text: '随机选择[指定地图中]',
        desc: '在指定的地图列表中随机选择一个地图',
        icon: 'format-list-bulleted-type',
    },
    {
        type: 'FIRST',
        text: '顺序选择[指定地图中首个可进攻关卡]',
        desc: '在指定的地图列表中顺序选择第一个可进攻的关卡',
        icon: 'format-list-numbered',
    },
    {
        type: 'MAPARG',
        text: '指定地图进攻次数',
        desc: '按照指定的地图进攻列表以及进攻次数进行关卡进攻',
        icon: 'timetable',
    },
    {
        type: 'MANAGED',
        text: '指定干员练度优先',
        desc: '按照指定的干员精英化/技能/专精/模组材料需求进行最优关卡进攻',
        icon: 'account-arrow-up-outline',
    },
] as Record<string, any>[]
export const parseMatWithTimes = function (ctx: string): Array<BattleMapWithTimes> {
    let result: Array<BattleMapWithTimes> = [];
    let parts = ctx.split(",");
    for (let i = 0; i < parts.length; i += 1) {
        let part = parts[i].split("~");
        if (part.length !== 2) {
            continue;
        }
        let tmp = new BattleMapWithTimes();
        tmp.mapId = part[0];
        tmp.times = parseInt(part[1]) || 0;
        result.push(tmp);
    }
    return result;
}

export const parseCharManaged = function (ctx: string): Array<ManagedCharTrainingInfo> {
    let result: Array<ManagedCharTrainingInfo> = [];
    let parts = ctx.split(","); // parts[0] = char_xxx/s/1-7
    for (let i = 0; i < parts.length; i += 1) {
        let part = parts[i].split("/"); // part = char,s,1-7
        if (part.length < 3) {
            continue;
        }
        let tmp = new ManagedCharTrainingInfo();
        tmp.charId = part[0];
        tmp.trainType = part[1] === 's' ? ManagedCharTrainingSkill : part[1] === 'e' ? ManagedCharTrainingElite : ManagedCharTrainingUnknown
        if (tmp.trainType === ManagedCharTrainingElite) {
            tmp.eliteTo = parseInt(part[2]) || 0;
        }
        if (tmp.trainType === ManagedCharTrainingSkill) {
            for (let j = 2; j < part.length; j++) {
                let parts2 = part[j].split("-");
                if (parts2.length !== 2) {
                    continue;
                }
                let skillTarget = new ManagedSkillTarget();
                skillTarget.skillId = parseInt(parts2[0]) || 0;
                skillTarget.target = parseInt(parts2[1]) || 0;
                tmp.skillTarg.push(skillTarget);
            }
        }
        result.push(tmp);
    }
    return result
}

export const parseSingleBattleParam = function (ctx: string): BattleParam {
    console.log("parseSingleBattleParam", ctx);
    let battleParam = new BattleParam();

    battleParam.type = 'AUTO'
    if (!ctx || ctx === '') {
        return battleParam
    }
    for (let kw of ctx.split("|")) {
        let args = kw.split("=", 2)
        if (args.length < 2) {
            continue
        }
        switch (args[0]) {
            case 'TYPE':
                battleParam.type = args[1]
                break
            case 'MAP':
                if (args[1] !== '') {
                    battleParam.maps = args[1].split(',')
                }
                break
            case 'MAPT':
                if (args[1] !== '') {
                    battleParam.mapt = parseMatWithTimes(args[1])
                }
                break
            case 'MNG':
                if (args[1] !== '') {
                    battleParam.mng = parseCharManaged(args[1])
                }
                break
        }
    }
    return battleParam;
}

export const parseSingleBattleParamToStr = function (data: BattleParam): string {
    let result = ''
    for (let i = 0; i < bTypeDesc.length; i++) {
        if (bTypeDesc[i].type === data.type) {
            result += bTypeDesc[i].text
        }
    }
    result += "："
    let r = [] as string[]
    switch (data.type) {
        case 'AUTO':
            break
        case 'RANDOM':
        case 'FIRST':
            for (let mid of data.maps || []) {
                if (global_const.gameData.stageTable['stages'][mid] != null) {
                    r.push(global_const.gameData.stageTable['stages'][mid].code)
                } else {
                    r.push("未知关卡" + mid)
                }
            }
            result += r.join(',')
            break
        case 'MAPARG':
            for (let mid of data.mapt || []) {
                if (global_const.gameData.stageTable['stages'][mid.mapId] != null) {
                    r.push(global_const.gameData.stageTable['stages'][mid.mapId].code + "(" + mid.times + "次)")
                } else {
                    r.push("未知关卡" + mid.mapId + "(" + mid.times + "次)")
                }
            }
            result += r.join(',')
            break
        case 'MANAGED':
            let cInfos = {} as Record<string, string[]>

            for (let minfo of data.mng || []) {
                console.log("mifo", minfo)
                let cname = (global_const.gameData.characterData[minfo.charId]?.name || minfo.charId)
                if (cInfos[cname] == null) {
                    cInfos[cname] = []
                }
                if (minfo.eliteTo != 0) {
                    cInfos[cname].push("精" + minfo.eliteTo)
                }
                for (let mskil of minfo.skillTarg) {
                    cInfos[cname].push(['一', '二', '三'][mskil.skillId] + "技能至" + mskil.target + "级")
                }
            }
            for (let cname in cInfos) {
                r.push(cname + "(" + cInfos[cname].join(",") + ")")
            }
            result += r.join(',')
            break
    }
    return result
}