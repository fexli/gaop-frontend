import global_const from "./global_const";

export class BattleMapWithTimes {
    Map: string;
    Times: number;

    constructor() {
        this.Map = "";
        this.Times = 0;
    }
}

export class ManagedSkillTarget {
    SkillId: number;
    Target: number;

    constructor() {
        this.SkillId = 0;
        this.Target = 0;
    }
}

export class ManagedCharTrainingInfo {
    CharId: string;
    TrainType: string;
    EliteTo: number;
    SkillTarget: Array<ManagedSkillTarget>;

    constructor() {
        this.CharId = "";
        this.TrainType = "";
        this.EliteTo = 0;
        this.SkillTarget = [];
    }

    public Marshal(): string {
        let s = this.CharId + "/"
        switch (this.TrainType) {
            case "e":
                if (this.EliteTo === 0) {
                    return "";
                }
                s += "e/" + this.EliteTo;
                break;
            case "s":
                if (this.SkillTarget.length === 0) {
                    return "";
                }
                s += "s/";
                for (let i = 0; i < this.SkillTarget.length; i++) {
                    if (i > 0) {
                        s += "/";
                    }
                    s += this.SkillTarget[i].SkillId + "-" + this.SkillTarget[i].Target;
                }
                break
        }
        return s;
    }
}

export class BattleParam implements Record<any, any> {
    Type: string;
    Map: Array<string>;
    MapT: Array<BattleMapWithTimes>
    Managed: Array<ManagedCharTrainingInfo>

    constructor() {
        this.Type = "";
        this.Map = [];
        this.MapT = [];
        this.Managed = [];
    }

    public Marshal(): string {
        return "TYPE=" + this.Type +
            (this.Map.length > 0 ? "|MAP=" + this.Map.join(",") : "") +
            (this.MapT.length > 0 ? "|MAPT=" + this.MapT.map((v) => v.Map + "~" + v.Times).join(",") : "") +
            (this.Managed.length > 0 ? "|MNG=" + this.Managed.map((v) => v.Marshal()).filter((v) => v !== '').join(",") : "");
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
        tmp.Map = part[0];
        tmp.Times = parseInt(part[1]) || 0;
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
        tmp.CharId = part[0];
        tmp.TrainType = part[1];
        if (tmp.TrainType === "e") {
            tmp.EliteTo = parseInt(part[2]) || 0;
        }
        if (tmp.TrainType === "s") {
            for (let j = 2; j < part.length; j++) {
                let parts2 = part[j].split("-");
                if (parts2.length !== 2) {
                    continue;
                }
                let skillTarget = new ManagedSkillTarget();
                skillTarget.SkillId = parseInt(parts2[0]) || 0;
                skillTarget.Target = parseInt(parts2[1]) || 0;
                tmp.SkillTarget.push(skillTarget);
            }
        }
        result.push(tmp);
    }
    return result
}

export const parseSingleBattleParam = function (ctx: string): BattleParam {
    console.log("parseSingleBattleParam", ctx);
    let battleParam = new BattleParam();

    battleParam.Type = 'AUTO'
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
                battleParam.Type = args[1]
                break
            case 'MAP':
                if (args[1] !== '') {
                    battleParam.Map = args[1].split(',')
                }
                break
            case 'MAPT':
                if (args[1] !== '') {
                    battleParam.MapT = parseMatWithTimes(args[1])
                }
                break
            case 'MNG':
                if (args[1] !== '') {
                    battleParam.Managed = parseCharManaged(args[1])
                }
                break
        }
    }
    return battleParam;
}

export const parseSingleBattleParamToStr = function (ctx: string): string {
    let data = parseSingleBattleParam(ctx)
    let result = ''
    for (let i = 0; i < bTypeDesc.length; i++) {
        if (bTypeDesc[i].type === data.Type) {
            result += bTypeDesc[i].text
        }
    }
    let r = [] as string[]
    switch (data.Type) {
        case 'AUTO':
            break
        case 'RANDOM':
        case 'FIRST':
            for (let mid of data.Map) {
                if (global_const.gameData.stageTable['stages'][mid] != null) {
                    r.push(global_const.gameData.stageTable['stages'][mid].code)
                } else {
                    r.push("未知关卡" + mid)
                }
            }
            result += r.join(',')
            break
        case 'MAPARG':
            for (let mid of data.MapT) {
                if (global_const.gameData.stageTable['stages'][mid.Map] != null) {
                    r.push(global_const.gameData.stageTable['stages'][mid.Map].code + "(" + mid.Times + "次)")
                } else {
                    r.push("未知关卡" + mid.Map + "(" + mid.Times + "次)")
                }
            }
            result += r.join(',')
            break
        case 'MANAGED':
            break
    }
    return result
}