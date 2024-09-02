import auto_choseRoomLayer from "../../../data/autoui/prefab/auto_choseRoomLayer";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";
import GameDataCenter from "../../../userData/GameDataCenter";
import UIGameLayer from "./UIGameLayer";
import UIKiller from "./UIKiller";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/prefab/UIChoseRoomLayer")
export default class UIChoseRoomLayer extends UIBase {
  ui: auto_choseRoomLayer = null;

  protected static prefabUrl = "choseRoomLayer";
  protected static className = "UIChoseRoomLayer";

  public static instance: UIChoseRoomLayer = null;

  onUILoad() {
    this.ui = this.node.addComponent(auto_choseRoomLayer);
    UIChoseRoomLayer.instance = this;
  }

  onShow() {
    this.onRegisterEvent(this.ui.btn_close, this.onClose);
    this.onRegisterEvent(this.ui.btn_1, this.onRoom1Click);
    this.onRegisterEvent(this.ui.btn_2, this.onRoom2Click);
    this.onRegisterEvent(this.ui.btn_3, this.onRoom3Click);
  }

  onHide() {}

  onStart() {}

  onRoom1Click() {
    if (GameDataCenter.roomInfoModel.roomType == 1) {
      this.onClose();
      return;
    }

    GameDataCenter.socketModel.joinRoom(1);
    UIGameLayer.instance.resetRoomChose();
    UIKiller.instance.resetUI();
    this.onClose();
  }

  onRoom2Click() {
    if (GameDataCenter.roomInfoModel.roomType == 2) {
      this.onClose();
      return;
    }

    GameDataCenter.socketModel.joinRoom(2);
    UIGameLayer.instance.resetRoomChose();
    UIKiller.instance.resetUI();
    this.onClose();
  }

  onRoom3Click() {
    if (GameDataCenter.roomInfoModel.roomType == 3) {
      this.onClose();
      return;
    }

    GameDataCenter.socketModel.joinRoom(3);
    UIGameLayer.instance.resetRoomChose();
    UIKiller.instance.resetUI();
    this.onClose();
  }

  onClose() {
    UIHelp.CloseUI(UIChoseRoomLayer);
  }
}
