import auto_jiluItem1 from "../../../data/autoui/prefab/auto_jiluItem1";
import { Holder } from "../../../framework/adapter/abstract/Holder";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";
import { IChatModel } from "./JiluAdapter";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/prefab/UIJiluItem1")
export default class UIJiluItem1 extends UIBase {
  ui: auto_jiluItem1 = null;

  protected static prefabUrl = "jiluItem1";
  protected static className = "UIJiluItem1";

  public static instance: UIJiluItem1 = null;

  onUILoad() {
    this.ui = this.node.addComponent(auto_jiluItem1);
    UIJiluItem1.instance = this;
  }

  onShow() {}

  onHide() {}

  onStart() {}

  show(holder: Holder) {
    console.log("获取展示数据", holder.data.list);
    for (let index of Object.values(holder.data.list)) {
      UIHelp.SetLabel(
        this.ui[`lab_name_num_${index.room_id}`],
        index.room_killed_times
      );
    }
  }
  hide() {}

  onClose() {
    UIHelp.CloseUI(UIJiluItem1);
  }
}
