import auto_baoxiang from "../../../data/autoui/prefab/auto_baoxiang";
import { AudioMng } from "../../../framework/manager/AudioMng";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";
import GameDataCenter from "../../../userData/GameDataCenter";
// import { KILLER_ROADS, ROADS } from "../../../userData/PlayerModel";
import UIGameLayer from "./UIGameLayer";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/prefab/UIBaoxiang")
export default class UIBaoxiang extends UIBase {
  ui: auto_baoxiang = null;

  protected static prefabUrl = "baoxiang";
  protected static className = "UIBaoxiang";
  public static instance: UIBaoxiang = null;
  public skeletonAnimation: sp.Skeleton = null;

  public amount: number = null;

  //皮肤类型
  private skinList = [
    "chest1",
    "chest2",
    "chest3",
    "chest4",
    "chest5",
    "chest6",
  ];
  //动画 - 入场 - intro
  private animationList_intro = [
    "intro1",
    "intro2",
    "intro3",
    "intro4",
    "intro5",
  ];

  //动画 - 勾引 - callout
  private animationList_callout = [
    "callout1",
    "callout2",
    "callout3",
    "callout4",
    "callout5",
  ];

  //动画 - 开宝箱 - bounce_open
  private animationList_bounceOpen = [
    "bounce_open1",
    "bounce_open2",
    "bounce_open3",
    "bounce_open4",
    "bounce_open5",
  ];
  //动画 - 开启抖动 - openIdle
  private animationList_openIdle = [
    "open_idle1",
    "open_idle2",
    "open_idle3",
    "open_idle4",
    "open_idle5",
  ];
  //动画 - 离场 - outro
  private animationList_outro = ["outro", "outro", "outro", "outro", "outro"];

  //宝箱等级 至少为1
  private chestLv: number = 1;
  private skinNum: number = 1;
  /**
   *
   * 宝箱状态
   * 0并未入场
   * 1执行了入场动画
   * 2执行了勾引动画
   * 3执行完了打开动画
   * 4执行打开完等待动画
   * 5执行了退场动画
   *
   */
  private chestState: number = 0;
  /**
   *
   * 回调区域
   *
   *
   */
  onUILoad() {
    this.ui = this.node.addComponent(auto_baoxiang);
    UIBaoxiang.instance = this;
  }

  onShow() {}

  onHide() {}

  onStart() {}

  resetUI() {
    this.unscheduleAllCallbacks();
    // this.ui.baoxiang.stopAllActions();
  }

  onClose() {
    UIHelp.CloseUI(UIBaoxiang);
  }

  /**
   *
   * 组件事件区域
   *
   */

  //刷新宝箱位置
  refreshChestPos(pos: any) {
    // this.ui.baoxiang.stopAllActions();
    // this.ui.baoxiang.setPosition(pos);
  }

  // 初始化宝箱
  initChest(prize_log: any) {
    this.chestLv = prize_log.type;
    this.skinNum = prize_log.type;
    this.chestState = 0;
    this.amount = prize_log.amount;

    console.log("");

    let baoxiang = GameDataCenter.chestModel.chests.get(this.chestLv);
    console.log("UI种获取宝箱1", baoxiang);
    console.log("UI种获取宝箱1", baoxiang.node.getChildByName("sp_baoxiang"));
    // console.log("UI种获取宝箱2", GameDataCenter.chestModel.chests);
    // console.log("UI种获取宝箱3", this.ui.baoxiang);
    // console.log(
    //   "UI种获取宝箱3",
    //   this.ui.baoxiang.getChildByName("sp_baoxiang")
    // );

    // 获取骨骼动画
    this.skeletonAnimation = baoxiang.node
      .getChildByName("sp_baoxiang")
      .getComponent(sp.Skeleton);
    // 设置皮肤
    this.skeletonAnimation.defaultSkin = this.skinList[this.skinNum + 1];
    this.skeletonAnimation.setSkin(this.skinList[this.chestLv + 1]);
    // 注册事件监听器
    this.skeletonAnimation.setCompleteListener(
      this.onSpineCompleteEvent.bind(this)
    );

    // 宝箱入场
    this.intro();
  }

  // 宝箱入场动画 只执行一次
  async intro() {
    // 播放入场动画，false 表示动画只播放一次
    this.skeletonAnimation.setAnimation(
      0,
      this.animationList_intro[this.chestLv],
      false
    );

    // 等待动画执行完成，执行下一个动画
    // this.ui.sp_baoxiang.getComponent(sp.Skeleton).
  }

  //   动画完成 监听器
  onSpineCompleteEvent(entry, event) {
    // 检查动画名称
    console.log("动画名称", entry);

    let anitype = entry.animation.name.replaceAll(/\d/g, "");

    switch (anitype) {
      case "intro": {
        // 入场之后进入勾引
        this.skeletonAnimation.setAnimation(
          0,
          this.animationList_bounceOpen[this.chestLv],
          true
        );

        setTimeout(() => {
          UIHelp.ShowTips("恭喜您获得宝箱奖励" + this.amount);
        }, 1500);

        this.chestState = 1;
        break;
      }
      case "callout": {
        this.chestState = 2;
        // 开启之后开启抖动
        this.skeletonAnimation.setAnimation(
          0,
          this.animationList_bounceOpen[this.chestLv],
          true
        );

        break;
      }
      case "bounce_open": {
        this.chestState = 3;
        // 开启之后开启抖动
        this.skeletonAnimation.setAnimation(
          0,
          this.animationList_outro[this.chestLv],
          false
        );
        break;
      }
      case "open_idle": {
        this.chestState = 4;
        // 开启之后开启退场
        this.skeletonAnimation.setAnimation(
          0,
          this.animationList_outro[this.chestLv],
          false
        );
        break;
      }
      case "outro": {
        this.chestState = 5;
        break;
      }
      default:
        break;
    }
  }

  bounceOpen() {
    this.skeletonAnimation.setAnimation(
      0,
      this.animationList_bounceOpen[this.chestLv],
      true
    );
  }
}
