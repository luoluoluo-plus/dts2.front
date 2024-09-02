import auto_comTips from "../../../data/autoui/comPop/auto_comTips";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";
import UIComTipsItem from "./UIComTipsItem";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/comPop/UIComTips")
export default class UIComTips extends UIBase {
	ui: auto_comTips = null;

	protected static prefabUrl = "comPop/comTips";
	protected static className = "UIComTips";

	@property(cc.Prefab)
    private tipPrefab: cc.Prefab = null;

    private tipPool: UIComTipsItem[] = [];

	onUILoad() {
		this.ui = this.node.addComponent(auto_comTips);
	}

	onShow() {

	}

	onHide() {

	}

	onStart() {

	}

	onClose() {
		UIHelp.CloseUI(UIComTips);
	}

	showTip(message: string) {
        for (let i = 0; i < this.tipPool.length; ++i) {
            if (this.tipPool[i] != null && this.tipPool[i].isReady()) {
                this.tipPool[i].playTip(message);
                return;
            }
        }
        let TipNode = cc.instantiate(this.tipPrefab);
        TipNode.parent = this.node;
        let tip = TipNode.getComponent(UIComTipsItem);
        this.tipPool.push(tip);
        tip.playTip(message);
    }
}