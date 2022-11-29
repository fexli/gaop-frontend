import global_const from "./global_const";

export interface AutoBattleMapCondition {
    Test(): boolean;
}

export class AutoBattleMapAtkSet {
    mapSetting: string;
    isComplete: boolean;
    conditions: Record<string, any>;

    constructor(data:Record<string, any>) {
        this.mapSetting = data.mapSetting || "";
        this.isComplete = data.isComplete || false;
        this.conditions = data.conditions || {};
    }
}

export class AutoBattleMapSumms {
    ts: number;
    ver: number;
    atks: Array<AutoBattleMapAtkSet>;
    fbid: string;

    constructor(data: Record<string, any>) {
        this.ts = data.ts || 0;
        this.ver = data.ver || 1;
        this.atks = data.atks || [];
        this.fbid = data.fbid || "";

        Object.assign(this, data);
    }
}

