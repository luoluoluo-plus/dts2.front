import GameController from "../../../GameController";
import auto_game from "../../../data/autoui/scene/auto_game";
import { i18nMgr } from "../../../framework/i18n/i18nMgr";
import { AudioMng } from "../../../framework/manager/AudioMng";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";
import { ConfigModule } from "../../../userData/ConfigModule";
import GameDataCenter from "../../../userData/GameDataCenter";
import { Utils } from "../../../utils/Utils";
import UIGameLayer from "../prefab/UIGameLayer";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/scene/UIGame")
export default class UIGame extends UIBase {
  ui: auto_game = null;

  protected static prefabUrl = "";
  protected static className = "UIGame";

  public static instance: UIGame = null;

  @property({ type: cc.Prefab })
  baoxaingPrefab: cc.Prefab = null;
  @property(cc.Prefab) gamePrefab: cc.Prefab = null;
  @property(cc.Prefab) wanfaPrefab: cc.Prefab = null;

  onUILoad() {
    this.ui = this.node.addComponent(auto_game);
    UIGame.instance = this;
    GameController.init();
  }

  onShow() {
    console.log(navigator.language);
    GameDataCenter.accountModel.language =
      navigator.language.indexOf("zh") !== -1 ? "en" : "zh";
    GameDataCenter.accountModel.language = "en";
    i18nMgr.setLanguage(GameDataCenter.accountModel.language);
  }

  onHide() {}

  async onStart() {
    this.ui.content.addChild(cc.instantiate(this.gamePrefab));
    this.ui.content.addChild(cc.instantiate(this.wanfaPrefab));
    AudioMng.getInstance().initBgm();
    ConfigModule.IS_TEST = Utils.getQueryString("env") == "test";

    // mock 数据跑动画
    // GameDataCenter.socketModel.mockDataToShowDemo();

    // {

    //   "channel_id":"45",
    //   "channel_user_id":"a_3",
    //   "sex":1,
    //   "nickname":"上善若水"}

    //192.168.191.172:7456/?channel_id=1&channel_user_id=a_3&sex=1&nickname=上善若水

    let params = {
      channel_id: Utils.getQueryString("channel_id") ?? "1",
      channel_user_id: Utils.getQueryString("channel_user_id") ?? "33",
      sex: Utils.getQueryString("sex") ?? "1",
      nickname: Utils.getQueryString("nickname") ?? "上善若水3",
    };

    // 接口流程排查：1、刚进入游戏获取url参数code上传给后端   
    // await GameDataCenter.accountModel.login(params);


    // 直接通过url来获取token
    GameDataCenter.accountModel.token = Utils.getQueryString("token");

    // 接口流程排查：2、连接websocket
    GameController.socket.connect();
  }

  showStage3Ani() {
    // this.playShashouChuxian();

    this.ui.stage_3.getComponent(cc.Animation).play();
  }

  showStage5Ani() {

    
    if (
      GameDataCenter.roomInfoModel.resultType == 1 ||
      GameDataCenter.roomInfoModel.resultType == 2
    ) {
      AudioMng.getInstance().playSFX("beisha_canjiao");
    } else {
      AudioMng.getInstance().playSFX("duobi_chenggong");
    }
    UIGameLayer.instance.openAllDoors();
    this.ui.stage_5.active = true;
    this.ui.VM_result.active = true;
    var resultType = GameDataCenter.roomInfoModel.resultType;

    console.log("游戏结束状态码",resultType)
    if (resultType == 3 || resultType == 4) {
      this.ui.caidai.active = true;
      this.ui.caidai
        .getComponent(sp.Skeleton)
        .setAnimation(0, "animation", false);
      this.ui.caidai.getComponent(sp.Skeleton).setCompleteListener(() => {
        this.ui.caidai.active = false;
      });
    }


    this.scheduleOnce(() => {
      this.ui.VM_result.active = false;
      this.ui.stage_5.active = false;
    }, 8);
  }

  playShashouChuxian() {}

  onClose() {
    UIHelp.CloseUI(UIGame);
  }
}
