import auto_jiluItem5 from "../../../data/autoui/prefab/auto_jiluItem5";
import { Holder } from "../../../framework/adapter/abstract/Holder";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/prefab/UIJiluItem5")
export default class UIJiluItem5 extends UIBase {
	ui: auto_jiluItem5 = null;

	protected static prefabUrl = "jiluItem5";
	protected static className = "UIJiluItem5";

	public static instance: UIJiluItem5 = null;

	onUILoad() {
		this.ui = this.node.addComponent(auto_jiluItem5);
		UIJiluItem5.instance = this;
	}

	onShow() {

	}

	onHide() {

	}

	onStart() {

	}
	show(holder: Holder) {
    }
    hide() {
    }

	onClose() {
		UIHelp.CloseUI(UIJiluItem5);
	}
}