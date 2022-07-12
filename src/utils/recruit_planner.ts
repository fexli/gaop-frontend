export interface PushableDictInternal {
    [key: number]: string[]
}

// eslint-disable-next-line no-unused-vars
export class PushableDict {
    private _internal: PushableDictInternal;

    constructor(kv: number[] | null = null) {
        if (kv == null) this._internal = {}
        else {
            this._internal = {}
            for (let ident of kv) {
                this._internal[ident] = []
            }
        }
    }

    push(key: number, value: string, create = false) {
        if (key in this._internal) {
            this._internal[key].push(value)
            return true
        } else if (create) {
            this._internal[key] = []
            this._internal[key].push(value)
            return true
        }
        return false
    }

    where(value: string) {
        for (let entr of Object.entries(this._internal)) {
            if (entr[1].indexOf(value) !== -1) {
                return entr[0]
            }
        }
    }

    wheres(values: string) {
        let ret = []
        for (let val of values) {
            ret.push(this.where(val))
        }
        return ret
    }
}

export const combinations = function (arr: any[], num: number) {
    const result: any[][] = [];
    const range = function (r: any[], _arr: any[]) {
        if (r.length === num) {
            result.push(r)
        } else {
            let l = r.length;
            let i = 0, len = _arr.length - num + l;
            for (; i <= len; i++) {
                range(r.concat(_arr[i]), _arr.slice(i + 1))
            }
        }
    };
    range([], arr);
    return result
}
const average = function (li: number[]) {
    if (li.length === 0) {
        return 0
    }
    let q = 0
    for (let v of li) q += v
    return q / li.length
}
const getIndexsOf = function (tag_list: string[], selector: string[]) {
    let t: number[] = []
    for (let i of selector) {
        t.push(tag_list.indexOf(i))
    }
    return t
}
export const getRecruitDetail = function (tag_list: string[], charRateTag: any, recruitTag: any) {
    let inst: any
    if (tag_list.length === 1) {
        inst = [tag_list, recruitTag[tag_list[0]]]
    } else {
        let kv = recruitTag[tag_list[0]]
        if (kv == null) {
            console.log(`Unknown Tag ${tag_list[0]} Please Check`)
        }
        for (let v of tag_list.slice(1)) {
            let recTag = new Set(recruitTag[v])
            if (recTag == null) {
                console.log(`Unknown Tag ${v} Please Check`)
            }
            // @ts-ignore
            kv = kv.filter(x => recTag.has(x))
        }
        inst = [tag_list, kv]
    }

    if (inst[1].length === 0) return null
    if (inst[0].length > 3) return null
    let rarities: number[] = []
    for (let i of charRateTag.wheres(inst[1])) {
        rarities.push(Number(i))
    }
    let charList = []
    let recruitType = -1
    if (inst[0].indexOf('高级资深干员') !== -1) {
        charList = inst[1]
        recruitType = 1
    } else if (inst[0].indexOf('支援机械') !== -1) {
        // @ts-ignore
        charList = inst[1].filter(x => rarities[inst[1].indexOf(x)] !== 6)
        recruitType = 2
        rarities = rarities.filter(x => x !== 6)
    } else if (inst[0].indexOf('新手') !== -1) {
        recruitType = 0
        // @ts-ignore
        charList = inst[1].filter(x => rarities[inst[1].indexOf(x)] !== 6)
        rarities = rarities.filter(x => x !== 6)
    } else {
        recruitType = 0
        // @ts-ignore
        charList = inst[1].filter(x => rarities[inst[1].indexOf(x)] !== 6)
        rarities = rarities.filter(x => x !== 6)
        rarities = rarities.filter(x => x !== 1)
        rarities = rarities.filter(x => x !== 2)
    }
    if (rarities.length === 0) return null
    let low_rate = rarities.length === 0 ? 0 : Math.min(...rarities)
    let score = average(rarities) + inst[0].length * 0.1 + low_rate - 5 - charList.length * 0.03 + recruitType * 3.4
    return {
        tags: tag_list,
        score: score,
        chars: charList,
        type: recruitType,
        low_rarity: low_rate,
        rarities: rarities,
    }
}
export const planRecruit = function (tag_lisk: string[], charRateTag: any, recruitTag: any, can_refresh = false, ignore_robot = false) {
    // no aka replacement
    let s_t = new Date().valueOf()
    let recruit = []
    for (let i = 0; i < tag_lisk.length; i++) {
        for (let tags of combinations(tag_lisk, i + 1)) {
            recruit.push(tags)
        }
    }
    let final = []
    let ret
    for (let tags of recruit) {
        ret = getRecruitDetail(tags, charRateTag, recruitTag)
        if (ret != null) {
            final.push(ret)
        }
    }
    final.sort(x => -x.score)
    console.log(final)
    let best: any = {}
    let selType = 0
    for (let tpl of final) {
        if (tpl.type === 1) {
            best = tpl
            selType = 1
            break
        }
        if (tpl.low_rarity === 5) {
            best = tpl
            selType = 2
            break
        }
        if (tpl.type === 2) {
            if (ignore_robot) {
                continue
            }
            best = tpl
            selType = 3
            break
        }
        if (tpl.low_rarity === 4) {
            best = tpl
            selType = 4
            break
        }
    }
    let decision
    if (can_refresh) decision = {action: 'refresh'}
    else decision = {action: 'exit'}
    if (best.tags) decision = {
        action: 'choose',
        tags: best.tags,
        tags_index: getIndexsOf(tag_lisk, best.tags),
        time: [[9, 0], [9, 0], [3, 5]][best.type],
        type: selType,
    }
    let cost = new Date().valueOf() - s_t
    return {
        raw_input: tag_lisk,
        input: tag_lisk,
        raw_output: recruit,
        output: final,
        decision: decision,
        best: best,
        cost: cost
    }
}
