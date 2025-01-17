import auto_comDialog from "../../../data/autoui/comPop/auto_comDialog";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp, { DialogParams } from "../../../framework/ui/UIHelp";
import { Log } from "../../../utils/Log";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/comPop/UIComDialog")
export default class UIComDialog extends UIBase {
	ui: auto_comDialog = null;

	protected static prefabUrl = "comPop/comDialog";
	protected static className = "UIComDialog";

	private _title: string;
	private _content: string;
	private _certainCb: Function;
	private _cancelCb: Function;

	onInit(params) {
		if (params == undefined) {
			Log.error(`UIComDialog:没有传入参数！！！`);
			return;
		}
		let data = params[0] as DialogParams;
		this._title = data.title;
		this._content = data.content;
		this._certainCb = data.certainCb;
		this._cancelCb = data.cancelCb;
	}

	onUILoad() {
		this.ui = this.node.addComponent(auto_comDialog);
	}

	onShow() {
		this.onRegisterEvent(this.ui.btn_close, this.onClose);
		this.onRegisterEvent(this.ui.btn_cancel, this.onCancel);
		this.onRegisterEvent(this.ui.btn_certain, this.onCertain);
	}

	onHide() {

	}

	onStart() {
		UIHelp.SetLabel(this.ui.lbl_title, this._title);
		UIHelp.SetLabel(this.ui.lbl_content, this._content);
		this.ui.btn_cancel.active = Boolean(this._cancelCb);
		this.ui.btn_certain.active = Boolean(this._certainCb);
	}

	onClose() {
		UIHelp.CloseUI(UIComDialog);
	}

	onCancel() {
		this.onClose();
		this._cancelCb && this._cancelCb();
	}

	onCertain() {
		this.onClose();
		this._certainCb && this._certainCb();
	}
}