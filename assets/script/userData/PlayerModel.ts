import { PoolMng } from "../framework/manager/PoolMng";
import IDataModel from "../framework/model/IDataModel";
import UIHelp from "../framework/ui/UIHelp";
import UIGameLayer from "../logic/ui/prefab/UIGameLayer";
import UIPlayer from "../logic/ui/prefab/UIPlayer";
import UIPlayerName from "../logic/ui/prefab/UIPlayerName";
import GameDataCenter from "./GameDataCenter";
import * as _ from "lodash";
export var ROADS = {
  1: [1, 3, 4, 1111],
  2: [1, 3, 5, 2222],
  3: [1, 2, 3, 3333],
  4: [1, 3, 4, 4444],
  5: [1, 2, 6, 5555],
  6: [1, 9, 2, 6666],
  7: [1, 2, 8, 7777],
  8: [1, 2, 7, 8888],
};

export var KILLER_ROADS = {
  1: [12, 9, 3, 4, 111],
  2: [12, 9, 3, 5, 222],
  3: [12, 9, 2, 3, 333],
  4: [12, 9, 3, 4, 444],
  5: [12, 9, 2, 6, 555],
  6: [12, 9, 10, 2, 666],
  7: [12, 9, 2, 8, 777],
  8: [12, 9, 2, 7, 888],
};
export default class PlayerModel extends IDataModel {
  // public avatar: string = "";
  // 下注金额
  public coin: number = 0;
  public nickname: string = "";
  public uid: number = 0;
  public node: cc.Node = null;
  public nodeName: cc.Node = null;
  public roomId: number = 0;
  public rankNo: number = 0;
  public isMySelf: boolean = false;

  constructor() {
    super("player");
  }

  destroy() {
    GameDataCenter.accountModel.players.delete(this.uid);
    GameDataCenter.accountModel.roomPlayers.get(this.roomId).delete(this.uid);
    this.node.stopAllActions();
    PoolMng.instance.putNode(this.node);
    this.nodeName.stopAllActions();
    PoolMng.instance.putNode(this.nodeName);
  }

  initData(res, roomId) {
    /*
    {
      "user_id": 5,
      "nickname": "上善若水",
      "sex": 0,
      "balance": "99840"
    } 
    */

    // console.log("初始化玩家对象打印内容", res);
    this.roomId = roomId;
    // this.avatar = res.avatar;
    this.coin = _.round(res.amount, 2);
    this.isMySelf =
      res.user_id == GameDataCenter.accountModel.uid ? true : false;
    this.nickname = this.isMySelf
      ? GameDataCenter.accountModel.language == "zh"
        ? "自己"
        : "Me"
      : res.nickname;
    this.uid = res.user_id;

    // 排行榜逻辑

    // if (this.isMySelf) {
    //   if (res.rank_no == 0) {
    //     this.rankNo = -1;
    //   } else {
    //     this.rankNo = res.rank_no;
    //   }
    // } else {
    //   this.rankNo = res.rank_no;
    // }

    // 判断是不是自己， 其他人用第三个
    if (this.isMySelf) {
      this.rankNo = -1;
    } else {
      this.rankNo = 3;
    }
  }

  setAniActive(active: boolean) {
    if (this.isMySelf) {
      this.node.active = true;
      this.nodeName.active = true;
    } else {
      this.node.active = active;
      this.nodeName.active = active;
    }
  }

  showBetting(bettingCoin: number) {
    this.node.getComponent(UIPlayer)?.showBetting(bettingCoin);
  }
  /** 加载并显示人物 */
  loadPlayerAni(roomId: number) {
    var nodePlayer = (this.node = PoolMng.instance.getNode(
      UIGameLayer.instance.playerPrefab,
      this.isMySelf
        ? UIGameLayer.instance.ui.node_player_my
        : UIGameLayer.instance.ui.node_player
    ));
    var nodePlayerName = (this.nodeName = PoolMng.instance.getNode(
      UIGameLayer.instance.playerNamePrefab,
      this.isMySelf
        ? UIGameLayer.instance.ui.node_player_name_my
        : UIGameLayer.instance.ui.node_player_name
    ));
    var pos = this.isMySelf
      ? UIHelp.getRadomPos(UIGameLayer.instance.ui[`room${roomId * 100}`])
      : UIHelp.getRadomPos(UIGameLayer.instance.ui[`room${roomId}`]);
    nodePlayer.setPosition(pos);
    nodePlayer.getComponent(UIPlayer)?.initAni(this.rankNo);
    nodePlayerName.setPosition(pos);
    nodePlayerName.getComponent(UIPlayerName)?.setName(this.nickname);
    this.node.active = false;
    this.nodeName.active = false;
  }

  /** 移动到某一房间 */
  moveToRoomById(roomId: number) {
    // 判断是不是移动到0
    if (this.roomId == 0) {
      GameDataCenter.accountModel.roomPlayers.get(this.roomId).delete(this.uid);
      GameDataCenter.roomInfoModel.refreshRoomPlayer(0);
      this.roomId = roomId;

      var list = [];
      for (let index of ROADS[roomId]) {
        let node: cc.Node = UIGameLayer.instance.ui[`pos${index}`];
        list.push(node.position);
      }

      if (this.isMySelf) {
        list.push(
          UIHelp.getRadomPos(UIGameLayer.instance.ui[`room${roomId * 100}`])
        );
      } else {
        list.push(UIHelp.getRadomPos(UIGameLayer.instance.ui[`room${roomId}`]));
      }

      this.node.getComponent(UIPlayer)?.playWalk();
      this.node.getComponent(UIPlayer)?.move([].concat(list), false, () => {
        if (this.node.active) {
          GameDataCenter.accountModel.roomPlayers
            .get(roomId)
            .set(this.uid, GameDataCenter.accountModel.players.get(this.uid));
          GameDataCenter.roomInfoModel.refreshRoomPlayer();
        }
      });
      this.nodeName.getComponent(UIPlayerName)?.move([].concat(list), false);
    } else {
      if (this.roomId == roomId) {
        return;
      }
      GameDataCenter.accountModel.roomPlayers.get(this.roomId).delete(this.uid);
      GameDataCenter.accountModel.roomPlayers
        .get(roomId)
        .set(this.uid, GameDataCenter.accountModel.players.get(this.uid));
      GameDataCenter.roomInfoModel.refreshRoomPlayer();
      this.roomId = roomId;
      this.node.getComponent(UIPlayer)?.playWait();
      if (this.isMySelf) {
        var pos = UIHelp.getRadomPos(
          UIGameLayer.instance.ui[`room${roomId * 100}`]
        );
      } else {
        var pos = UIHelp.getRadomPos(UIGameLayer.instance.ui[`room${roomId}`]);
      }
      this.node.getComponent(UIPlayer)?.flashToRoomById(pos);
      this.nodeName.getComponent(UIPlayerName)?.flashToRoomById(pos);
    }
  }

  /** 从某一房间回到初始位置 */
  moveBack() {
    if (this.roomId == 0) {
      return;
    }

    GameDataCenter.accountModel.roomPlayers.get(this.roomId).delete(this.uid);

    var list = [];
    for (let index of ROADS[this.roomId]) {
      let node: cc.Node = UIGameLayer.instance.ui[`pos${index}`];
      list.push(node.position);
    }
    list.reverse();
    list.push(UIHelp.getRadomPos(UIGameLayer.instance.ui[`room0`]));
    this.node.getComponent(UIPlayer)?.playWalk();
    this.node.getComponent(UIPlayer)?.move([].concat(list), true, () => {
      GameDataCenter.roomInfoModel.refreshRoomPlayer();
      if (this.node.active) {
        GameDataCenter.accountModel.roomPlayers
          .get(0)
          .set(this.uid, GameDataCenter.accountModel.players.get(this.uid));
        GameDataCenter.roomInfoModel.refreshRoomPlayer();
      }
    });
    this.nodeName.getComponent(UIPlayerName)?.move([].concat(list), true);
    this.roomId = 0;
    UIGameLayer.instance.resetRoomId();
  }

  //同步
  demoXXX1(): Promise<any> {
    var params = {};

    return new Promise((resolve, reject) => {
      this.sendHttpMsg(
        "index",
        params,
        function (res) {
          let data = res.data;
          resolve(data);
        }.bind(this)
      );
    });
  }
}
