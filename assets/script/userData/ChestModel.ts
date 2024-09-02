// ID数据
import IDataModel from "../framework/model/IDataModel";
// 游戏数据中心
import GameDataCenter from "./GameDataCenter";
// 宝箱UI
import BaoxiangModel from "./BaoxiangModel";

// 宝箱UI
import UIBaoxiang from "../logic/ui/prefab/UIBaoxiang";

// 继承类
export default class ChestModel extends IDataModel {
  // 公共属性

  // 宝箱列表
  public chests: Map<number, UIBaoxiang> = new Map();
  // 整个游戏的宝箱列表
  public gameChests: Map<number, Map<number, UIBaoxiang>> = new Map();
  // 宝箱层是否展示
  public isShowChests: boolean = false;

  constructor() {
    super("chest");
  }

  // 初始化三个宝箱，生成三个级别的宝箱并设置整体透明度都改为0
  initAllChests(chestInfoList: any[]) {
    console.log("由服务端推送过来的宝箱记录", chestInfoList);

    // // 设置宝箱外层的位置 - 放在整体画面居中
    // let pos = UIHelp.getTwoPointDistance(
    //   this.node_chestwrap.getPosition(),
    //   UIGameLayer.instance.ui.bg.getPosition()
    // );
    // // 设置宝箱外层的位置
    // this.node_chestwrap.setPosition(pos);
  }
}
