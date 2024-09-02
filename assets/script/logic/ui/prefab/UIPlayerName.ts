import auto_playerName from "../../../data/autoui/prefab/auto_playerName";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";
import GameDataCenter from "../../../userData/GameDataCenter";
import UIGameLayer from "./UIGameLayer";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/prefab/UIPlayerName")
export default class UIPlayerName extends UIBase {
	ui: auto_playerName = null;

	protected static prefabUrl = "playerName";
	protected static className = "UIPlayerName";

	public static instance: UIPlayerName = null;

	private speed: number = 200;
	private speed1: number = 200;
	private speed2: number = 300;

	onUILoad() {
		this.ui = this.node.addComponent(auto_playerName);
		UIPlayerName.instance = this;
	}

	onShow() {

	}

	onHide() {

	}

	onStart() {

	}

	setName(nickname: string) {
		this.ui.label_name_bg.active = nickname == (GameDataCenter.accountModel.language == "zh" ? "自己" : "Me") ? true : false;
		this.ui.lan_name.active = nickname == (GameDataCenter.accountModel.language == "zh" ? "自己" : "Me") ? false : true;
		if (nickname == "自己" || nickname == "Me") {
			UIHelp.SetLabel(this.ui.lan_name1, nickname);
			
		}else{
			UIHelp.SetLabel(this.ui.lan_name, nickname);
		}
	}

	flashToRoomById(pos: any) {
		this.node.stopAllActions();
		this.node.setPosition(pos);
	}

	move(list: any[], isBack: boolean) {

		// console.log("移动动画调试",list,isBack)
		if (list.length <= 0) {
			return
		}
		this.speed = isBack ? this.speed2 : this.speed1;
		var dis = this.getDistance(this.node.position, list[0]);
		var t = dis / this.speed;
		cc.tween(this.node)
			.to(t, { position: list[0] })
			.call(() => {
				list.splice(0, 1);
				this.move(list, isBack);
			})
			.start();
	}

	// 距离
	getDistance(start, end) {
		var pos = cc.v2(start.x - end.x, start.y - end.y);
		var dis = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
		return dis;
	}

	onClose() {
		UIHelp.CloseUI(UIPlayerName);
	}
}