import auto_killer from "../../../data/autoui/prefab/auto_killer";
import { AudioMng } from "../../../framework/manager/AudioMng";
import UIBase from "../../../framework/ui/UIBase";
import UIHelp from "../../../framework/ui/UIHelp";
import GameDataCenter from "../../../userData/GameDataCenter";
import { KILLER_ROADS, ROADS } from "../../../userData/PlayerModel";
import UIGameLayer from "./UIGameLayer";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/prefab/UIKiller")
export default class UIKiller extends UIBase {
  ui: auto_killer = null;

  protected static prefabUrl = "killer";
  protected static className = "UIKiller";

  public static instance: UIKiller = null;

  private speed: number = 200;
  private speed1: number = 200;
  private speed2: number = 700;
  private killing: boolean = false;
  private roadList: any[] = [];
  private killRoomId: number = 0;

  onUILoad() {
    this.ui = this.node.addComponent(auto_killer);
    UIKiller.instance = this;
  }

  onShow() {}

  onHide() {}

  onStart() {}

  resetUI() {
    this.unscheduleAllCallbacks();
    this.node.stopAllActions();
    this.node.setPosition(UIGameLayer.instance.ui.pos12.position);
  }

  kill(roomId: number) {
    this.killRoomId = roomId;
    this.killing = true;
    this.speed = this.speed1;
    this.roadList = [];
    var roads = KILLER_ROADS[roomId];
    var pos0 = UIGameLayer.instance.ui[`pos${roads[0]}`].position;
    var pos1 = UIGameLayer.instance.ui[`pos${roads[1]}`].position;
    var pos2 = UIGameLayer.instance.ui[`pos${roads[2]}`].position;
    var pos3 = UIGameLayer.instance.ui[`pos${roads[3]}`].position;
    var pos4 = UIGameLayer.instance.ui[`pos${roads[4]}`].position;
    var d2 = pos1.sub(pos2).mag();
    var d3 = pos2.sub(pos3).mag();
    var d4 = pos3.sub(pos4).mag();
    var spd = (d2 + d3 + d4) / 5;
    var p1 = { t: 0, p: pos0 };
    var p2 = { t: 2, p: pos1 };
    var p3 = { t: d2 / spd, p: pos2 };
    var p4 = { t: d3 / spd, p: pos3 };
    var p5 = { t: d4 / spd, p: pos4 };
    var p6 = { t: 2, p: UIGameLayer.instance.ui[`kill_${roomId}`].position };
    this.roadList = [p1, p2, p3, p4, p5, p6];

    // for(let index of KILLER_ROADS[roomId]){
    // 	let node: cc.Node = UIGameLayer.instance.ui[`pos${index}`];
    // 	this.roadList.push(node.position);
    // }
    // this.roadList.push(UIGameLayer.instance.ui[`kill_${roomId}`].position);

    var list = [].concat(this.roadList);
    this.move(list, false);
  }

  moveBack() {
    this.killing = false;
    this.speed = this.speed2;
    this.roadList.reverse();
    var list = [].concat(this.roadList);
    this.move(list, true);
  }

  move(list: any[], isBack: boolean) {
    if (list.length <= 0) {
      if (this.killing) {
        this.ui.sp_killer.getComponent(sp.Skeleton).animation = "attack";
        AudioMng.getInstance().playSFX("kan");
        this.scheduleOnce(() => {
          AudioMng.getInstance().playSFX("jianshe");
        }, 0.4);
        this.scheduleOnce(() => {
          GameDataCenter.accountModel.players.forEach((element) => {
            if (element.roomId == this.killRoomId) {
              element.destroy();
            }
          });
          this.ui.sp_killer.getComponent(sp.Skeleton).animation = "walk";
          this.moveBack();
          UIGameLayer.instance.dropCoins(this.killRoomId);
        }, 2);
      }
      console.warn("杀手抵达房间");
      return;
    }
    this.ui.sp_killer.scaleX = this.node.x > list[0].p.x ? 1 : -1;
    var dis = this.getDistance(this.node.position, list[0].p);
    var t = isBack ? dis / this.speed : list[0].t;
    if (list.length == 1 && !isBack) {
      UIGameLayer.instance.openDoor(this.killRoomId);
    }
    cc.tween(this.node)
      .to(t, { position: list[0].p })
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
    UIHelp.CloseUI(UIKiller);
  }
}
