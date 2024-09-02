import { Holder } from "../../../framework/adapter/abstract/Holder";
import { ScrollAdapter } from "../../../framework/adapter/abstract/ScrollAdapter";
import { View } from "../../../framework/adapter/abstract/View";
import { IElement } from "../../../framework/adapter/define/interface";

const { ccclass, menu, property } = cc._decorator;
export interface IChatModel {
    type: number
}
@ccclass
@menu("UI/prefab/RankPageAdapter")
export class RankPageAdapter extends ScrollAdapter<IChatModel> {
    @property(cc.Node) prefab1: cc.Node = null
    @property(cc.Node) prefab2: cc.Node = null
    public getPrefab(data: IChatModel): cc.Node {
        if(data.type == 1){
            return this.prefab1;
        }else {
            return this.prefab2;
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

    start() {
        this.modelManager.insert([{type: 1}, {type: 2}]);
    }
}

class myView extends View<IChatModel, RankPageAdapter> {

    protected onVisible(): void {
    }
    protected onDisable(): void {
    }
}
class myHolder extends Holder<IChatModel, RankPageAdapter>{
    protected onCreated(): void {
    }
    protected onVisible(): void {
    }
    protected onDisable(): void {
    }
}

