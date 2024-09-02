import auto_rankLayer from "../../../data/autoui/prefab/auto_rankLayer";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";
import GameDataCenter from "../../../userData/GameDataCenter";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/prefab/UIRankLayer")
export default class UIRankLayer extends UIBase {
	ui: auto_rankLayer = null;

	protected static prefabUrl = "rankLayer";
	protected static className = "UIRankLayer";

	public static instance: UIRankLayer = null;

	onUILoad() {
		this.ui = this.node.addComponent(auto_rankLayer);
		UIRankLayer.instance = this;
	}

	onShow() {
		this.onRegisterEvent(this.ui.btn_back, this.onClose);
	}

	onHide() {

	}

	onStart() {
		UIHelp.SetLabel(this.ui.lab_my_name, GameDataCenter.accountModel.language == "zh" ? "自己" : "Me")
	}

	onClose() {
		UIHelp.CloseUI(UIRankLayer);
	}
}