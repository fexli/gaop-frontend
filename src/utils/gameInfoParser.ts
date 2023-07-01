import global_const from "./global_const";

export class GameInfoParser {

    public static onComplete = ref(false)

    public static NC = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

    public charAttrKeyNames = {
        "maxHp": "生命",
        "atk": "攻击",
        "def": "防御",
        "magicResistance": "法术抗性",
        "cost": "部署费用",
        "blockCnt": "阻挡数",
        "moveSpeed": "移动速度",
        "attackSpeed": "攻击速度",
        "baseAttackTime": "基础攻击间隔",
        "respawnTime": "再部署时间",
        "hpRecoveryPerSec": "每秒回复生命",
        "spRecoveryPerSec": "每秒回复技力",
        "maxDeployCount": "最大部署数量",
        "maxDeckStackCnt": "最大存在数量",
        "tauntLevel": "tauntLevel",
        "massLevel": "massLevel",
        "baseForceLevel": "baseForceLevel",
        "abilityRangeForwardExtend": "abilityRangeForwardExtend",
        "defPenetrate": "defPenetrate",
        "magicResistPenetrate": "magicResistPenetrate",
        "hpRecoveryPerSecByMaxHpRatio": "hpRecoveryPerSecByMaxHpRatio",
        "defPenetrateFixed": "defPenetrateFixed",
        "oneMinusStatusResistance": "oneMinusStatusResistance",
        "magicResistPenetrateFixed": "magicResistPenetrateFixed",
        "maxEp": "maxEp",
        "epRecoveryPerSec": "epRecoveryPerSec",
        "spRecoverRatio": "spRecoverRatio",
        "stunImmune": "眩晕抗性",
        "silenceImmune": "沉默抗性",
        "sleepImmune": "沉睡抗性",
        "frozenImmune": "冻结抗性",
        "levitateImmune": "levitateImmune",
    }

    constructor() {
        global_const.requireAssets(["game_const_data", "character_data", "char_patch_table","range_table"], () => {
            GameInfoParser.onComplete.value = true
        })
    }


    fixRepStyle(rep: string) {
        // <span style="color: #233333">2333w</span>
        // <color=#ff8d00>{0}</color>
        // console.log('rep', rep)
        return rep.replace(/<color=(?<color>.+?)>/gm, "<span style='color: $1'>").replace(/<\/color>/gm, "</span>")
    }

    replaceRichText(type: string, inner: string, showDetail: boolean) {
        // console.log("replaceRichText", type, inner, showDetail)
        let pos = ''
        let rep
        if (type[0] === '@') {
            pos = 'richTextStyles'
            rep = global_const.gameData.gameConstData[pos][type.slice(1)]
            if (rep && rep.indexOf("color") !== -1) {
                rep = global_const.gameData.gameConstData[pos][type] = this.fixRepStyle(rep)
            }
        } else if (type[0] === '$') {
            pos = 'termDescriptionDict'
            rep = global_const.gameData.gameConstData[pos][type.slice(1)]
            if (rep != null && showDetail) {
                return this.compileDescRichText(`${inner}【${rep.description}】`, 'cornflowerblue', false)
            } else {
                return `<span style="color: goldenrod">${inner}</span>`
            }
        }
        if (pos === '' || rep === '') {
            return inner
        }
        if (rep != null) {
            rep = this.fixRepStyle(rep)
            return rep.replace('{0}', inner)
        }
        return inner
    }

    reMatchRichText(txt: string) {
        return /<(?<cmd>[^si/][^/]+?)>(?<inner>.+?)<\/>/gm.exec(txt)
    }

    compileDescRichText(txt: string, color: string, showDetail: boolean): string {
        // console.log("compileDescRichText", txt, color, showDetail)
        let res = this.reMatchRichText(txt)
        // console.log('first', res)
        while (res != null) {
            //@ts-ignore
            txt = txt.slice(0, res.index) + this.replaceRichText(res.groups.cmd, res.groups.inner, showDetail) + txt.slice(res.index + res[0].length)
            // console.log('after', res, txt)
            res = this.reMatchRichText(txt)
            // console.log("res->", res)
        }
        // console.log(txt)
        return color !== '' ? `<span style="color: ${color}">${txt}</span>` : `<span>${txt}</span>`
    }

    reMatchSkillText(txt: string) {
        return /{(?<type>.+?)(?<format>:.+?)?}/gm.exec(txt)
    }

    findBlackboard(blackboard: Record<string, any>[], type: string) {
        for (let i = 0; i < blackboard.length; i++) {
            if (blackboard[i].key === type) {
                return blackboard[i]
            }
        }
        return {key: undefined, value: undefined, valueStr: undefined}
    }

    replaceSkillText(type: string, format: string, blackboard: Record<string, any>[]): string {
        let neg = false
        if (type[0] === '-') {
            neg = true
            type = type.slice(1)
        }
        let bb = this.findBlackboard(blackboard, type)
        if (bb.key === undefined) {
            return `!${type}%`
        }
        switch (format) {
            case ":0%":
                //@ts-ignore
                return parseInt(bb.value * 100 * (neg ? -1 : 1)) + "%"
            case "":
                if (bb.valueStr) {
                    return bb.valueStr
                }
                return bb.value
            default:
                return ""
        }
    }

    compileSkillBlackboard(txt: string, blackboard: Record<string, any>[]): string {
        let res = this.reMatchSkillText(txt)
        while (res != null) {
            //@ts-ignore
            txt = txt.slice(0, res.index) + this.replaceSkillText(res.groups.type, res.groups.format || "", blackboard) + txt.slice(res.index + res[0].length)
            res = this.reMatchSkillText(txt)
        }
        txt = txt.replaceAll("\\n", "</br>")
        return txt
    }

    parseUnlockCond(talent: Record<string, any>): string {
        let data = `精${talent['unlockCondition']['phase']} | ${talent['unlockCondition']['level']}级`
        if (talent['requiredPotentialRank'] !== 0) {
            data += ` | ${GameInfoParser.NC[talent['requiredPotentialRank'] - 1]}潜`
        }
        return data
    }

    parseTalentCurrent(charData: Record<string, any>, playerCharInfo: Record<string, any>): TalentObject[] {
        let data = []
        for (let talent of charData['talents']) {
            if (talent['candidates'].length === 0) {
                continue
            }
            let cur = new TalentObject(talent['candidates'], 0, false, false)
            for (let condIdx in talent['candidates']) {
                let cond = talent['candidates'][condIdx]
                if (cond['unlockCondition']['phase'] <= playerCharInfo.evolvePhase && cond['unlockCondition']['level'] <= playerCharInfo.level && cond['requiredPotentialRank'] <= playerCharInfo.potentialRank) {
                    cur['current'] = parseInt(condIdx)
                    cur['isUnlock'] = true
                    cur['canImprove'] = parseInt(condIdx) < (talent['candidates'].length - 1)
                }
            }
            data.push(cur)
        }
        return data
    }

    parseSkillCurrent(charData: Record<string, any>, skillData: Record<string, any>, playerCharInfo: Record<string, any>): SkillObject[] {
        let data = []
        let i = 0
        for (let skill of charData['skills']) {
            if (!this.charTmpl(playerCharInfo)['skills'][i]) {
                continue
            }
            let cur = new SkillObject(
                skillData[skill.skillId],
                skill.skillId,
                this.charTmpl(playerCharInfo)['skills'][i]['specializeLevel'],
                playerCharInfo.mainSkillLvl + this.charTmpl(playerCharInfo)['skills'][i]['specializeLevel'],
                this.charTmpl(playerCharInfo)['skills'][i]['unlock'],
            )
            i += 1
            data.push(cur)
        }
        return data
    }

    charTmpl(charInfo: Record<string, any>): Record<string, any> {
        return charInfo['currentTmpl'] ? charInfo['tmpl'][charInfo['currentTmpl']] : charInfo
    }

    findCharData(playerCharInfo: Record<string, any>): Record<string, any> {
        if (playerCharInfo.currentTmpl) {
            return global_const.gameData.charPatchTable['patchChars'][playerCharInfo.currentTmpl] || {} as Record<string, any>
        }
        return global_const.gameData.characterData[playerCharInfo.charId] || {} as Record<string, any>
    }

    getRangeData(rangeId: string) {
        return global_const.gameData.rangeTable[rangeId]
    }
}

export class TalentObject {
    public talent: Record<string, any>
    public current: number
    public canImprove: boolean
    public isUnlock: boolean

    constructor(talent: Record<string, any>, current: number, canImprove: boolean, isUnlock: boolean) {
        this.talent = talent
        this.current = current
        this.canImprove = canImprove
        this.isUnlock = isUnlock
    }
}

export class SkillObject {
    public skill: Record<string, any>
    public skillId: string
    public specializeLevel: number
    public current: number
    public isUnlock: boolean

    constructor(skill: Record<string, any>, skillId: string, specializeLevel: number, current: number, isUnlock: boolean) {
        this.skill = skill
        this.skillId = skillId
        this.specializeLevel = specializeLevel
        this.current = current
        this.isUnlock = isUnlock
    }
}