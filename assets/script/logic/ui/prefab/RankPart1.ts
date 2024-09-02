import { Holder } from "../../../framework/adapter/abstract/Holder";

const { ccclass, menu, property } = cc._decorator;
@ccclass
@menu("UI/prefab/RankPart1")
export class RankPart1 extends cc.Component{
    @property(cc.Label) labMian1: cc.Label = null;
    @property(cc.Label) labMian2: cc.Label = null;
    @property(cc.Label) labMian3: cc.Label = null;
    @property(cc.Label) labDes: cc.Label = null;

    show(holder: Holder) {
        var mian = holder.data.data;
        this.labMian1.string = `免伤${mian.mian_top1}`;
        this.labMian2.string = `免伤${mian.mian_top2}`;
        this.labMian3.string = `免伤${mian.mian_top3}`;
        this.labDes.string = `奖励免杀手伤害皮肤，最高免伤${mian.mian_top1}`;
    }

    hide() {
    }
}