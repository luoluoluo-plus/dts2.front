import { Holder } from "../../../framework/adapter/abstract/Holder";
import EventMng from "../../../framework/manager/EventMng";
import { GameEvent } from "../../../userData/EventConst";

const { ccclass, menu, property } = cc._decorator;
@ccclass
@menu("UI/prefab/RankPart3")
export class RankPart3 extends cc.Component{
    @property(cc.Node) tab1: cc.Node = null;
    @property(cc.Node) tab2: cc.Node = null;
    @property([cc.Label]) labJianshaoList: cc.Label[] = [];
    @property([cc.Label]) labNameList: cc.Label[] = [];

    protected onEnable(): void {
        EventMng.on(GameEvent.RANK_TAB_CHANGE, this.tabChange, this);
    }

    protected onDisable(): void {
        EventMng.off(GameEvent.RANK_TAB_CHANGE, this.tabChange, this);
    }

    start() {
        this.tab1.active = true;
        this.tab2.active = false;
    }

    tabChange(index: number){
        this.tab1.active = index == 0;
        this.tab2.active = index == 1;
    }

    show(holder: Holder) {
    }

    hide() {
    }
}