import { Holder } from "../../../framework/adapter/abstract/Holder";
import EventMng from "../../../framework/manager/EventMng";
import UIHelp from "../../../framework/ui/UIHelp";
import { GameEvent } from "../../../userData/EventConst";
import GameDataCenter from "../../../userData/GameDataCenter";

const { ccclass, menu, property } = cc._decorator;
@ccclass
@menu("UI/prefab/RankPart2")
export class RankPart2 extends cc.Component {
    @property(cc.Node) labCoinName: cc.Node = null;
    show(holder: Holder) {
        EventMng.emit(GameEvent.RANK_PAGE_1, holder.data.data.thisWeekRank);
        EventMng.emit(GameEvent.RANK_PAGE_2, holder.data.data.lastWeekRank);
    }

    hide() {
    }

    protected start(): void {
        if (GameDataCenter.accountModel.language == "zh") {
            UIHelp.SetLabel(this.labCoinName, `獎勵${GameDataCenter.roomInfoModel.coinName}數`);
        } else {
            UIHelp.SetLabel(this.labCoinName, `Number of rewarded ${GameDataCenter.roomInfoModel.coinName}`);
        }
    }
}