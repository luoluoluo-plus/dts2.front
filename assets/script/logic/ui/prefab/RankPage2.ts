import EventMng from "../../../framework/manager/EventMng";
import UIHelp from "../../../framework/ui/UIHelp";
import { GameEvent } from "../../../userData/EventConst";

const { ccclass, menu, property } = cc._decorator;
@ccclass
@menu("UI/prefab/RankPage2")
export class RankPage2 extends cc.Component{
    protected onEnable(): void {
        EventMng.on(GameEvent.RANK_PAGE_2, this.initUI, this);
    }

    protected onDisable(): void {
        EventMng.off(GameEvent.RANK_PAGE_2, this.initUI, this);
    }

    initUI(rankList: any[]){
        for(let i = 0; i < 10; i++){
            let index = rankList[i];
            let nodeXian = this.node.getChildByName("node_xian").getChildByName(`fengexian${i + 1}`);
            let nodeQuanyi = this.node.getChildByName("node_quanxi").getChildByName(`label_pfqy${i + 1}`);
            let nodeIcon = this.node.getChildByName("node_icon").getChildByName(`VM_coin${i + 1}`);
            let nodeAvatar = this.node.getChildByName("node_avatar").getChildByName(`spr_avatar${i + 1}`);
            let nodeCoin = this.node.getChildByName("node_coin").getChildByName(`lab_coin${i + 1}`);
            let nodeRank = this.node.getChildByName("node_rank").getChildByName(`lab_rank${i + 1}`);
            let nodeName = this.node.getChildByName("node_name").getChildByName(`lab_name${i + 1}`);

            nodeXian.active = Boolean(index);
            nodeQuanyi.active = Boolean(index);
            nodeIcon.active = Boolean(index);
            nodeAvatar.active = Boolean(index);
            nodeCoin.active = Boolean(index);
            nodeRank.active = Boolean(index);
            nodeName.active = Boolean(index);

            if(index){
                UIHelp.SetLabel(nodeCoin, index.score);
                UIHelp.SetLabel(nodeName, index.nickname);
                UIHelp.SetSpriteFrame(nodeAvatar, index.avatar);
            }
        }
    }
}