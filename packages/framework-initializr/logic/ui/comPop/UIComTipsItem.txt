import auto_comTipsItem from "../../../data/autoui/comPop/auto_comTipsItem";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/comPop/UIComTipsItem")
export default class UIComTipsItem extends UIBase {
	ui: auto_comTipsItem = null;

	protected static prefabUrl = "comPop/comTipsItem";
	protected static className = "UIComTipsItem";

	private ready: boolean = true;

	onUILoad() {
		this.ui = this.node.addComponent(auto_comTipsItem);
	}

	onShow() {

	}

	onHide() {

	}

	onStart() {

	}

	onClose() {
		UIHelp.CloseUI(UIComTipsItem);
	}

	public playTip(message: string) {
        this.node.stopAllActions();
        this.ready = false;
		UIHelp.SetLabel(this.ui.lab_des, message);
        this.reset();
        let action0 = cc.moveTo(0.5, 0, 128);
        let action1 = cc.fadeIn(0.5);
        let action2 = cc.spawn(action0, action1);
        let action3 = cc.delayTime(1);
        let action4 = cc.fadeOut(0.5);
        let callback = cc.callFunc(
            function () {
                this.ready = true;
            }
            , this
        );

        let action = cc.sequence(action2, action3, action4, callback);
        this.node.runAction(action);
    }

    public isReady(): boolean {
        return this.ready;
    }

    private reset() {
        this.node.setPosition(0, 0);
        this.node.opacity = 255;
    }
}