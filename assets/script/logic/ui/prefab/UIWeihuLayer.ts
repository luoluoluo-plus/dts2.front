import auto_weihuLayer from "../../../data/autoui/prefab/auto_weihuLayer";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/prefab/UIWeihuLayer")
export default class UIWeihuLayer extends UIBase {
	ui: auto_weihuLayer = null;

	protected static prefabUrl = "weihuLayer";
	protected static className = "UIWeihuLayer";

	public static instance: UIWeihuLayer = null;

	onUILoad() {
		this.ui = this.node.addComponent(auto_weihuLayer);
		UIWeihuLayer.instance = this;
	}

	onShow() {

	}

	onHide() {

	}

	onStart() {

	}

	onClose() {
		UIHelp.CloseUI(UIWeihuLayer);
	}
}