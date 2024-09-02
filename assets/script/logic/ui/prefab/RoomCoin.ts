import EventMng from "../../../framework/manager/EventMng";
import { GameEvent } from "../../../userData/EventConst";
import GameDataCenter from "../../../userData/GameDataCenter";

const { ccclass, menu, property } = cc._decorator;
@ccclass
@menu("UI/prefab/RoomCoin")
export class RoomCoin extends cc.Component{
    @property(cc.Label) labCoin: cc.Label = null;
    @property(cc.Integer) id: number = 0;

    private scaling: boolean = false;

    protected onLoad(): void {
        EventMng.on(GameEvent.COIN_SCALE, this.showScale, this);
    }

    protected onDestroy(): void {
        EventMng.off(GameEvent.COIN_SCALE, this.showScale, this);
    }

    showScale(rooms: any){
        if(this.scaling){
            return
        }
        if(GameDataCenter.roomInfoModel[`coin${this.id}`] >= rooms[this.id - 1].total){
            return
        }
        this.scaling = true;
        cc.tween(this.node)
        .by(0.5, {scale: 0.2})
        .by(0.5, {scale: -0.2})
        .call(()=>{
            this.scaling = false;
        })
        .start();
    }
}