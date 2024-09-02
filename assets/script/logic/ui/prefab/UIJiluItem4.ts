import auto_jiluItem4 from "../../../data/autoui/prefab/auto_jiluItem4";
import { Holder } from "../../../framework/adapter/abstract/Holder";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";
import GameDataCenter from "../../../userData/GameDataCenter";
import { ROAD_NAME, ROAD_NAME_EN ,ROAD_NAME_KR ,ROAD_NAME_JP } from "../../../userData/RoomInfoModel";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/prefab/UIJiluItem4")
export default class UIJiluItem4 extends UIBase {
  ui: auto_jiluItem4 = null;

  protected static prefabUrl = "jiluItem4";
  protected static className = "UIJiluItem4";

  public static instance: UIJiluItem4 = null;

  onUILoad() {
    this.ui = this.node.addComponent(auto_jiluItem4);
    UIJiluItem4.instance = this;
  }

  onShow() {}

  onHide() {}

  onStart() {}

  show(holder: Holder) {
    console.log("记录4 - 展示数据", holder);
    var user = holder.data.user;
    var isWin = user.killed_room_id !== user.room_id;
    if (GameDataCenter.accountModel.language == "zh") {
      UIHelp.SetLabel(
        this.ui.lab_qi,
        `第${user.issue}期  ${user.created_at_string}`
      );
      UIHelp.SetLabel(
        this.ui.lab_choose_room,
        `「${ROAD_NAME[user.room_id]}」`
      );
      UIHelp.SetLabel(
        this.ui.lba_kill_room,
        `「${ROAD_NAME[user.killed_room_id]}」`
      );
      UIHelp.SetLabel(this.ui.lab_touru_num, user.amount);
      UIHelp.SetLabel(this.ui.lab_huode_num, user.win_amount);
      UIHelp.SetLabel(this.ui.lab_touru_name, `投入`);
      UIHelp.SetLabel(this.ui.lab_huode_name, isWin ? `獲得` : `損失`);
    } else if (GameDataCenter.accountModel.language == "en") {
      UIHelp.SetLabel(
        this.ui.lab_qi,
        `Issue ${user.issue}  ${user.created_at_string}`
      );
      UIHelp.SetLabel(
        this.ui.lab_choose_room,
        `「${ROAD_NAME_EN[user.room_id]}」`
      );
      UIHelp.SetLabel(
        this.ui.lba_kill_room,
        `「${ROAD_NAME_EN[user.killed_room_id]}」`
      );
      
      UIHelp.SetLabel(this.ui.lab_touru_num, user.amount);
      UIHelp.SetLabel(this.ui.lab_huode_num, user.win_amount);
      UIHelp.SetLabel(this.ui.lab_touru_name, `Investment`);
      UIHelp.SetLabel(this.ui.lab_huode_name, isWin ? `Get` : `Loss`);
    } else if (GameDataCenter.accountModel.language == "ko") {
      UIHelp.SetLabel(
        this.ui.lab_qi,
        `회차 ${user.issue}  ${user.created_at_string}`
      );
      UIHelp.SetLabel(
        this.ui.lab_choose_room,
        `「${ROAD_NAME_KR[user.room_id]}」`
      );
      UIHelp.SetLabel(
        this.ui.lba_kill_room,
        `「${ROAD_NAME_KR[user.killed_room_id]}」`
      );
      UIHelp.SetLabel(this.ui.lab_touru_num, user.amount);
      UIHelp.SetLabel(this.ui.lab_huode_num, user.win_amount);
      UIHelp.SetLabel(this.ui.lab_touru_name, `투자`);
      UIHelp.SetLabel(this.ui.lab_huode_name, isWin ? `획득` : `손실`);
    } else {
      UIHelp.SetLabel(
        this.ui.lab_qi,
        `第${user.issue}期  ${user.created_at_string}`
      );
      UIHelp.SetLabel(
        this.ui.lab_choose_room,
        `「${ROAD_NAME_JP[user.room_id]}」`
      );
      UIHelp.SetLabel(
        this.ui.lba_kill_room,
        `「${ROAD_NAME_JP[user.killed_room_id]}」`
      );
      UIHelp.SetLabel(this.ui.lab_touru_num, user.amount);
      UIHelp.SetLabel(this.ui.lab_huode_num, user.win_amount);
      UIHelp.SetLabel(this.ui.lab_touru_name, `投資`);
      UIHelp.SetLabel(this.ui.lab_huode_name, isWin ? `獲得` : `損失`);
    }

    this.ui.lab_win.active = isWin ? true : false;
    this.ui.lab_lose.active = isWin ? false : true;
  }
  hide() {}

  onClose() {
    UIHelp.CloseUI(UIJiluItem4);
  }
}
