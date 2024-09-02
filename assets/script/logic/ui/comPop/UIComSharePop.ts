import auto_comSharePop from "../../../data/autoui/comPop/auto_comSharePop";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/comPop/UIComSharePop")
export default class UIComSharePop extends UIBase {
	ui: auto_comSharePop = null;

	protected static prefabUrl = "comPop/comSharePop";
	protected static className = "UIComSharePop";

	onUILoad() {
		this.ui = this.node.addComponent(auto_comSharePop);
	}

	onShow() {
		this.onRegisterEvent(this.ui.btn_close, this.onClose);
	}

	onHide() {

	}

	onStart() {

	}

	onClose() {
		UIHelp.CloseUI(UIComSharePop);
	}
}