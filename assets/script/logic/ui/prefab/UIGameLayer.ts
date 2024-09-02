import { Utils } from "./../../../utils/Utils";
import auto_gameLayer from "../../../data/autoui/prefab/auto_gameLayer";
import { AudioMng } from "../../../framework/manager/AudioMng";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";
import { GameEvent } from "../../../userData/EventConst";
import GameDataCenter from "../../../userData/GameDataCenter";
import UIChoseRoomLayer from "./UIChoseRoomLayer";
import UIJiluLayer from "./UIJiluLayer";
import UIRankLayer from "./UIRankLayer";
import UIWeihuLayer from "./UIWeihuLayer";
import UIBaoxiang from "./UIBaoxiang";

import { i18nMgr } from "../../../framework/i18n/i18nMgr";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/prefab/UIGameLayer")
export default class UIGameLayer extends UIBase {
  ui: auto_gameLayer = null;

  protected static prefabUrl = "gameLayer";
  protected static className = "UIGameLayer";

  public static instance: UIGameLayer = null;

  @property({ type: cc.Prefab })
  baoxaingPrefab: cc.Prefab = null;
  @property({ type: cc.Prefab })
  playerPrefab: cc.Prefab = null;
  @property({ type: cc.Prefab })
  playerNamePrefab: cc.Prefab = null;
  @property({ type: cc.Prefab })
  coinPrefab: cc.Prefab = null;

  private baoxiangAniNUm: number = 0;
  private tipsIndex: number = 0;
  private tipsTween: cc.Tween = null;
  private tipsList: string[] = [];

  onUILoad() {
    this.ui = this.node.addComponent(auto_gameLayer);
    UIGameLayer.instance = this;
  }

  onShow() {
    this.onRegisterEvent(this.ui.btn_room1, this.onRoom1Click);
    this.onRegisterEvent(this.ui.btn_room2, this.onRoom2Click);
    this.onRegisterEvent(this.ui.btn_room3, this.onRoom3Click);
    this.onRegisterEvent(this.ui.btn_room4, this.onRoom4Click);
    this.onRegisterEvent(this.ui.btn_room5, this.onRoom5Click);
    this.onRegisterEvent(this.ui.btn_room6, this.onRoom6Click);
    this.onRegisterEvent(this.ui.btn_room7, this.onRoom7Click);
    this.onRegisterEvent(this.ui.btn_room8, this.onRoom8Click);
    this.onRegisterEvent(
      this.ui.btn_chose_betting_num,
      this.onChoseBettingNumClick
    );
    this.onRegisterEvent(this.ui.toggle1, this.onBettingNum1Click);
    this.onRegisterEvent(this.ui.toggle2, this.onBettingNum2Click);
    this.onRegisterEvent(this.ui.toggle3, this.onBettingNum3Click);
    this.onRegisterEvent(this.ui.btn_betting, this.onBettingClick);

    // this.onRegisterEvent(this.ui.baoxiang, this.onBaoxiangClick);
    this.onRegisterEvent(this.ui.btn_rank, this.onRankClick);
    this.onRegisterEvent(this.ui.btn_jilu, this.onJiluClick);
    this.onRegisterEvent(this.ui.btn_changeLua, this.onChangeLua);

    this.initEvent(GameEvent.SET_DOORS, this.onStageChange);
    this.initEvent(GameEvent.CLOSE_GAME, this.onCloseGame);
    this.initEvent(GameEvent.OPEN_GAME, this.onOpenGame);
  }

  onHide() {}

  onStart() {
    // 初始化宝箱  0-4  一共五种
    // UIBaoxiang.instance.initChest(4);
  }

  onCloseGame() {
    UIHelp.ShowUI(UIWeihuLayer);
  }

  onOpenGame() {
    UIHelp.CloseUI(UIWeihuLayer);
  }

  /** 切换房间类型，刷新页面 */
  resetRoomChose() {
    this.ui.toggle1.getComponent(cc.Toggle).isChecked = true;
    this.unscheduleAllCallbacks();
    this.showLastKillerAni();
  }

  //点击切换语言按钮
  onChangeLua() {
    console.log("切换语言", GameDataCenter.accountModel.language);

    this.ui.yuyanToggleGroup.active = !this.ui.yuyanToggleGroup.active;

    // let languageList = ["zh", "en", "kr", "ja"];
    // //  切换到下一个语言
    // const currentIndex = languageList.indexOf(
    //   GameDataCenter.accountModel.language
    // );
    // console.log("当前索引", currentIndex);

    // if (currentIndex !== -1) {
    //   console.log("当前索引2", currentIndex);
    //   // 计算下一个语言的索引，如果当前是最后一个语言，则循环到数组的第一个元素
    //   const nextIndex = (currentIndex + 1) % languageList.length;

    //   console.log("下一个索引", nextIndex);
    //   GameDataCenter.accountModel.language = languageList[nextIndex];
    // } else {
    //   GameDataCenter.accountModel.language = "en";
    // }

    // console.log("切换后语言", GameDataCenter.accountModel.language);
    // i18nMgr.setLanguage(GameDataCenter.accountModel.language);
  }

  // 展示上一次杀手去了哪个房间
  showLastKillerAni() {
    if (GameDataCenter.accountModel.language == "zh") {
      this.tipsList = [
        `快點個房間躲起來，殺手要來了`,
        `成功躲避殺手獲得${GameDataCenter.roomInfoModel.coinName}獎勵哦`,
        `上期殺手去了「${GameDataCenter.roomInfoModel.lastShaRoomName}」`,
      ];
    } else if (GameDataCenter.accountModel.language == "ko") {
      this.tipsList = [
        `방을 선택하여 숨으세요, 살인이 다가오고 있습니다.`,
        `살인을 성공적으로 피하면 ${GameDataCenter.roomInfoModel.coinName} 보상을 받을 수 있습니다.`,
        `지난 번, 살인은 「${GameDataCenter.roomInfoModel.lastShaRoomName}」에 갔습니다.`,
      ];
    } else if (GameDataCenter.accountModel.language == "ja") {
      this.tipsList = [
        `部屋を選んで隠れてください、殺人者が来ます`,
        `殺人者をうまく避けると${GameDataCenter.roomInfoModel.coinName}の報酬がもらえます`,
        `前回、殺人者は「${GameDataCenter.roomInfoModel.lastShaRoomName}」に行きました`,
      ];
    } else {
      this.tipsList = [
        `Choose a room to hide in, the killer is coming`,
        `Successfully avoid the killer to get ${GameDataCenter.roomInfoModel.coinName} rewards`,
        `Last time, the killer went to 「${GameDataCenter.roomInfoModel.lastShaRoomName}」`,
      ];
    }

    if (GameDataCenter.roomInfoModel.gameStage <= 2) {
      this.tipsIndex = 0;
    } else {
      this.tipsIndex = 2;
    }
    UIHelp.SetLabel(this.ui.lab_shangqi, this.tipsList[this.tipsIndex]);
    if (!this.tipsTween) {
      this.tipsTween = cc.tween(this.ui.lab_shangqi);
      this.tipsTween
        .repeatForever(
          cc
            .tween()
            .delay(2)
            .call(() => {
              UIHelp.SetLabel(
                this.ui.lab_shangqi,
                this.tipsList[this.tipsIndex]
              );
              if (GameDataCenter.roomInfoModel.gameStage <= 2) {
                this.tipsIndex += 1;
                if (this.tipsIndex > 2) {
                  this.tipsIndex = 0;
                }
              }
            })
        )
        .start();
    }
  }

  onStageChange(stage: number) {
    switch (stage) {
      // 1 等待 2 开始(倒计时) 3 结束(开始杀人)
      case 1:
        this.setDoors(1);
        break;
      case 2:
        this.setDoors(1);
        break;
      case 3:
        this.setDoors(2);
        break;

      // case 4:
      //   this.setDoors(2);
      //   break;
      // case 5:
      //   this.setDoors(2);
      //   break;
      default:
        break;
    }
  }

  /**
   * 设置所有门的显示状态
   * @param type 1: 开，2:关
   */
  setDoors(type: number) {
    for (let i = 1; i <= 9; i++) {
      let aniName = type == 1 ? "open" : `guan${i}`;
      let spine: sp.Skeleton = this.ui[`men${i}`].getComponent(sp.Skeleton);
      spine.setAnimation(0, aniName, false);
    }
  }

  openAllDoors() {
    console.warn("打开所有门");
    this.scheduleOnce(() => {
      for (let i = 1; i <= 9; i++) {
        let spine: sp.Skeleton = this.ui[`men${i}`].getComponent(sp.Skeleton);
        if (spine.animation.indexOf("open") == -1) {
          spine.setAnimation(0, `open${i}`, false);
        }
      }
    }, 2);

    this.scheduleOnce(() => {
      GameDataCenter.accountModel.players.forEach((element) => {
        element.moveBack();
      });
    }, 2.5);
  }

  closeAllDoors() {
    for (let i = 1; i <= 9; i++) {
      let spine: sp.Skeleton = this.ui[`men${i}`].getComponent(sp.Skeleton);
      spine.setAnimation(0, `close${i}`, false);
    }
    this.scheduleOnce(() => {
      AudioMng.getInstance().playSFX("guanmen");
    }, 0.3);
  }

  showStage3Ani() {
    console.log("查看this", this);

    this.scheduleOnce(
      this.closeAllDoors,
      GameDataCenter.roomInfoModel.waitTime - 1
    );
  }

  openDoor(id: number) {
    let spine: sp.Skeleton = this.ui[`men${id}`].getComponent(sp.Skeleton);
    spine.setAnimation(0, `open${id}`, false);
  }
  resetRoomId() {
    this.data.roomId = 0;
  }

  onBettingNumClick(id: number) {
    this.scheduleOnce(() => {
      this.ui.node_chose_coin.active = false;
    });
    GameDataCenter.roomInfoModel.bettingId = id;
    GameDataCenter.roomInfoModel.bettingNum =
      GameDataCenter.roomInfoModel[`bettingConfig${id}`];
  }

  onChoseBettingNumClick() {
    this.ui.node_chose_coin.active = !this.ui.node_chose_coin.active;
    switch (GameDataCenter.roomInfoModel.bettingId) {
      case 1:
        this.ui.toggle1.getComponent(cc.Toggle).isChecked = true;
        break;
      case 2:
        this.ui.toggle2.getComponent(cc.Toggle).isChecked = true;
        break;
      case 3:
        this.ui.toggle3.getComponent(cc.Toggle).isChecked = true;
        break;
      default:
        break;
    }
  }

  onChoseRoomClick() {
    UIHelp.ShowUI(UIChoseRoomLayer);
  }

  onRoomClick(id: number) {
    // 这里要判断当前玩家在哪个房间
    if (GameDataCenter.roomInfoModel.roomId == id) {
      return;
    }
    GameDataCenter.roomInfoModel.roomId = id;

    // UIHelp.ShowTips("点击了房间" + id);
    // 拿到自己玩家列表
    // let myPlayer = GameDataCenter.accountModel.players.get(
    //   GameDataCenter.accountModel.uid
    // );

    // 判断是否下注  下注了，就通过下注请求发送给后端，基于数据移动到指定房间， 以前没有做多房间切换逻辑，56种路线需要AI找路
    // if (myPlayer?.coin !== 0) {
    //   let data = {
    //     room_id: id,
    //     dts_user_id: GameDataCenter.accountModel.uid,
    //     dts_game_id: GameDataCenter.roomInfoModel.dts_game_id,
    //     coin_id: 0,
    //   };
    //   GameDataCenter.socketModel.selectRoomAndBetting(data);
    // }

    // 判断是否下注，如果没下注，就不移动。
    // 如果下注了，就直接移动;
    // 下注按钮，不能点击多次， 点击一次就要置灰
  }

  onBettingClick() {
    if (!GameDataCenter.roomInfoModel.roomId) {
      UIHelp.ShowTips("请选择房间后投入");
      return;
    }

    let paramas = {
      room_id: GameDataCenter.roomInfoModel.roomId,
      dts_user_id: GameDataCenter.accountModel.uid,
      dts_game_id: GameDataCenter.roomInfoModel.dts_game_id,
      coin_id: GameDataCenter.roomInfoModel.bettingId,
    };

    // 拿到自己玩家列表
    let myPlayer = GameDataCenter.accountModel.players.get(
      GameDataCenter.accountModel.uid
    );

    // 判断是否下注  如果没有下注，就执行这个方法， 如果有下注，就提示
    if (myPlayer?.coin === 0) {
      GameDataCenter.socketModel.selectRoomAndBetting(paramas);
    } else {
      UIHelp.ShowTips("已下注，不可重新下注");
    }
  }

  onBaoxiangClick() {
    // 点击了宝箱
    console.log("点击了宝箱");
    UIHelp.ShowTips("点击了宝箱");
    UIBaoxiang.instance.bounceOpen();
  }

  onRankClick() {
    UIHelp.ShowUI(UIRankLayer);
  }

  onJiluClick() {
    UIHelp.ShowUI(UIJiluLayer);
  }

  onBettingNum1Click() {
    // UIHelp.ShowTips("点击了下注1");
    this.onBettingNumClick(1);
  }

  onBettingNum2Click() {
    // UIHelp.ShowTips("点击了下注2");
    this.onBettingNumClick(2);
  }

  onBettingNum3Click() {
    // UIHelp.ShowTips("点击了下注3");
    this.onBettingNumClick(3);
  }

  onRoom1Click() {
    this.onRoomClick(1);
  }
  onRoom2Click() {
    this.onRoomClick(2);
  }
  onRoom3Click() {
    this.onRoomClick(3);
  }
  onRoom4Click() {
    this.onRoomClick(4);
  }
  onRoom5Click() {
    this.onRoomClick(5);
  }
  onRoom6Click() {
    this.onRoomClick(6);
  }
  onRoom7Click() {
    this.onRoomClick(7);
  }
  onRoom8Click() {
    this.onRoomClick(8);
  }

  dropCoins(roomId: number) {
    const numCoins = 35;
    const startDelay = 0.02;
    var startPosition = this.ui[`btn_room${roomId}`].position;
    var endPosList = [];

    for (let i = 1; i <= 8; i++) {
      if (i != roomId) {
        endPosList.push(this.ui[`btn_room${i}`].position);
      }
    }

    for (let i = 0; i < numCoins; i++) {
      this.scheduleOnce(() => {
        let coin = cc.instantiate(this.coinPrefab);

        coin.setPosition(startPosition);
        this.node.addChild(coin);

        // 初始隐藏状态
        coin.opacity = 0;
        coin.scale = 0;
        let randomX = Utils.random(-65, 65); // 随机生成 x 坐标偏移量
        let randomY = Utils.random(80, 120); // 随机生成 y 坐标偏移量
        let randomY2 = Utils.random(-150, -100);
        let endX = endPosList[Math.floor(i / 5)].x;
        let endY = endPosList[Math.floor(i / 5)].y;

        // 动画序列
        let delayTime = cc.delayTime(i * startDelay);
        let showAction = cc.spawn(
          cc.fadeIn(0.3),
          cc.scaleTo(0.3, 1).easing(cc.easeBackOut())
        );
        let riseAction = cc
          .moveBy(0.5, cc.v2(randomX, randomY))
          .easing(cc.easeCircleActionOut());
        let fallAction = cc
          .moveBy(0.5, cc.v2(0, randomY2))
          .easing(cc.easeQuadraticActionIn());
        let rotateAction = cc.repeatForever(cc.rotateBy(1, 360)); // 持续旋转
        let delayTime2 = cc.delayTime(
          1 + numCoins * startDelay - i * startDelay
        );
        let endAction = cc
          .moveTo(0.5, cc.v2(endX, endY))
          .easing(cc.easeQuadraticActionIn());
        let removeAction = cc.removeSelf();
        let sequence = cc.sequence(
          delayTime,
          showAction,
          riseAction,
          fallAction,
          delayTime2,
          endAction,
          removeAction
        );
        coin.runAction(sequence);

        coin.runAction(rotateAction); // 添加持续旋转动作
      }, i * startDelay);
    }
  }

  onClose() {
    UIHelp.CloseUI(UIGameLayer);
  }
}
