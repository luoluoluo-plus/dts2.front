import { PoolMng } from "../framework/manager/PoolMng";
import IDataModel from "../framework/model/IDataModel";
import UIHelp from "../framework/ui/UIHelp";
// import UIGameLayer from "../logic/ui/prefab/UIGameLayer";

import UIGame from "../logic/ui/scene/UIGame";
import UIPlayer from "../logic/ui/prefab/UIPlayer";
import UIPlayerName from "../logic/ui/prefab/UIPlayerName";
import GameDataCenter from "./GameDataCenter";
// 宝箱UI
import UIBaoxiang from "../logic/ui/prefab/UIBaoxiang";

export default class BaoxiangModel extends IDataModel {
  // 宝箱等级
  public baoxiangLv: number = 0;
  // 宝箱信息 - 至少包含宝箱属于大中小哪个奖池
  public baoxiangInfo: any = null;
  // // 宝箱外层节点
  // public node: cc.Node = null;
  // 宝箱外层节点
  public node_chestwrap: cc.Node = null;
  public node: cc.Node = null;
  constructor() {
    super("baoxiang");
  }

  // 初始化宝箱
  initData(res) {
    console.log("获取宝箱信息", res);
    // 设置宝箱等级
    this.baoxiangLv = res.type;
  }

  /** 加载并显示宝箱 */
  loadBaoxiangAni(prize_log: any) {
    // 获取到了宝箱的节点
    this.node_chestwrap = UIGame.instance.ui.node_chestwrap;

    var nodebaoxaing = PoolMng.instance.getNode(
      UIGame.instance.baoxaingPrefab,
      UIGame.instance.ui.node_chestwrap
    );

    this.node = nodebaoxaing;
    console.log(
      "加载动画，判断是否存在宝箱",
      nodebaoxaing.getComponent(UIBaoxiang)
    );

    GameDataCenter.chestModel.chests.set(
      prize_log.type,
      nodebaoxaing.getComponent(UIBaoxiang)
    );

    // 定义宝箱，并执行入场动画
    nodebaoxaing.getComponent(UIBaoxiang)?.initChest(prize_log);
  }
}
