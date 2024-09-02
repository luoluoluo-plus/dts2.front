import auto_jiluItem2 from "../../../data/autoui/prefab/auto_jiluItem2";
import { Holder } from "../../../framework/adapter/abstract/Holder";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";
import GameDataCenter from "../../../userData/GameDataCenter";
import { IChatModel } from "./JiluAdapter";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/prefab/UIJiluItem2")
export default class UIJiluItem2 extends UIBase {
  ui: auto_jiluItem2 = null;

  protected static prefabUrl = "jiluItem2";
  protected static className = "UIJiluItem2";

  @property({ type: [cc.SpriteFrame] })
  roomNameSprList: cc.SpriteFrame[] = [];
  @property({ type: [cc.SpriteFrame] })
  roomNameSprList_en: cc.SpriteFrame[] = [];
  public static instance: UIJiluItem2 = null;

  onUILoad() {
    this.ui = this.node.addComponent(auto_jiluItem2);
    UIJiluItem2.instance = this;
  }

  onShow() {}

  onHide() {}

  onStart() {}

  show(holder: Holder) {
    console.log("获取数据type2", holder.data.list);
    for (let i = 0; i < 10; i++) {
      let index = holder.data.list[i];
      let labQi = this.ui[`lab_qi_${i + 1}`];
      let spr = this.ui[`room_name_${i + 1}`];


      UIHelp.SetLabel(
        this.ui['room_name_Lab'+(i+1)],
        `${index?.room_name||''}`
      );

      console.log("获取type2的每一个房间数", index);
      if (index) {
        labQi.active = true;
        spr.active = true;
        
        UIHelp.SetLabel(labQi, `${index.issue.slice(2)}`);
    

        if (GameDataCenter.accountModel.language == "zh") {
          spr.getComponent(cc.Sprite).spriteFrame =
            this.roomNameSprList[Number(index.room_id) - 1];
        } else {
          spr.getComponent(cc.Sprite).spriteFrame =
            this.roomNameSprList_en[Number(index.room_id) - 1];
        }

      } else {
        labQi.active = false;
        spr.active = false;
      }
    }
  }
  hide() {}

  onClose() {
    UIHelp.CloseUI(UIJiluItem2);
  }
}
