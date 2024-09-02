import auto_jiluLayer from "../../../data/autoui/prefab/auto_jiluLayer";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/prefab/UIJiluLayer")
export default class UIJiluLayer extends UIBase {
	ui: auto_jiluLayer = null;

	protected static prefabUrl = "jiluLayer";
	protected static className = "UIJiluLayer";

	public static instance: UIJiluLayer = null;

	onUILoad() {
		this.ui = this.node.addComponent(auto_jiluLayer);
		UIJiluLayer.instance = this;
	}

	onShow() {
		this.onRegisterEvent(this.ui.btn_back, this.onClose);
	}

	onHide() {

	}

	onStart() {

	}

	onClose() {
		UIHelp.CloseUI(UIJiluLayer);
	}
}