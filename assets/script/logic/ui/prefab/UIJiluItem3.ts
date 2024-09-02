import auto_jiluItem3 from "../../../data/autoui/prefab/auto_jiluItem3";
import { Holder } from "../../../framework/adapter/abstract/Holder";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";
import GameDataCenter from "../../../userData/GameDataCenter";
import { IChatModel } from "./JiluAdapter";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/prefab/UIJiluItem3")
export default class UIJiluItem3 extends UIBase {
	ui: auto_jiluItem3 = null;

	protected static prefabUrl = "jiluItem3";
	protected static className = "UIJiluItem3";

	public static instance: UIJiluItem3 = null;

	onUILoad() {
		this.ui = this.node.addComponent(auto_jiluItem3);
		UIJiluItem3.instance = this;
	}

	onShow() {

	}

	onHide() {

	}

	onStart() {

	}

	show(holder: Holder) {
		var roomType = GameDataCenter.roomInfoModel.roomType;
		this.ui.coin_1_1.active = roomType == 1;
		this.ui.coin_1_2.active = roomType == 2;
		this.ui.coin_1_3.active = roomType == 3;
		this.ui.coin_2_1.active = roomType == 1;
		this.ui.coin_2_2.active = roomType == 2;
		this.ui.coin_2_3.active = roomType == 3;
		UIHelp.SetLabel(this.ui.lab_touru_num, holder.data.betting_total);
		UIHelp.SetLabel(this.ui.lab_huode_num, holder.data.result_total);
    }
    hide() {
    }

	onClose() {
		UIHelp.CloseUI(UIJiluItem3);
	}
}