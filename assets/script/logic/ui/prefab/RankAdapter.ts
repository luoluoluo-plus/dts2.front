import { Holder } from "../../../framework/adapter/abstract/Holder";
import { ScrollAdapter } from "../../../framework/adapter/abstract/ScrollAdapter";
import { View } from "../../../framework/adapter/abstract/View";
import { IElement } from "../../../framework/adapter/define/interface";
import GameDataCenter from "../../../userData/GameDataCenter";
import { RankPart1 } from "./RankPart1";
import { RankPart2 } from "./RankPart2";
import { RankPart3 } from "./RankPart3";

const { ccclass, menu, property } = cc._decorator;
export interface IChatModel {
    type: number,
    data: any
}
@ccclass
@menu("UI/prefab/RankAdapter")
export class RankAdapter extends ScrollAdapter<IChatModel> {
    @property(cc.Node) prefab1: cc.Node = null
    @property(cc.Node) prefab2: cc.Node = null
    @property(cc.Node) prefab3: cc.Node = null
    public getPrefab(data: IChatModel): cc.Node {
        if(data.type == 1){
            return this.prefab1;
        }else if(data.type == 2){
            return this.prefab2;
        }else{
            return this.prefab3;
        }
    }
    public getHolder(node: cc.Node, code: string): Holder<IChatModel> {
        return new myHolder(node, code, this)
    }
    public getView(): View<IChatModel> {
        return new myView(this)
    }
    public initElement(element: IElement, data: any): void {
    }

    async start() {
        var data = await GameDataCenter.accountModel.getRank();
        var list =[
            {type: 1, data: data.mian},
            {type: 2, data: {lastWeekRank: data.last_week_rank, thisWeekRank: data.this_week_rank}},
            {type: 3, data: data.mian}
        ]
        this.modelManager.insert(list);
    }
}

class myView extends View<IChatModel, RankAdapter> {

    protected onVisible(): void {
    }
    protected onDisable(): void {
    }
}
class myHolder extends Holder<IChatModel, RankAdapter>{
    private _chatItem: RankPart1 | RankPart2 | RankPart3;
    protected onCreated(): void {
        this._chatItem = this.node.getComponent(RankPart1) || this.node.getComponent(RankPart2) || this.node.getComponent(RankPart3);
    }
    protected onVisible(): void {
        this._chatItem.show(this)
    }
    protected onDisable(): void {
        this._chatItem.hide()
    }
}

