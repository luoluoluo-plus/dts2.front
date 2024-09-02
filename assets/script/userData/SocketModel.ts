import EventMng from "../framework/manager/EventMng";
import IDataModel from "../framework/model/IDataModel";
import UIHelp from "../framework/ui/UIHelp";
import UIGameLayer from "../logic/ui/prefab/UIGameLayer";
import UIKiller from "../logic/ui/prefab/UIKiller";
import UIGame from "../logic/ui/scene/UIGame";
import { Log } from "../utils/Log";
import { GameEvent } from "./EventConst";
import GameDataCenter from "./GameDataCenter";
import PlayerModel from "./PlayerModel";
import BaoxiangModel from "./BaoxiangModel";
import * as _ from "lodash";

export default class SocketModel extends IDataModel {
  constructor() {
    super("SocketModel");
  }

  /**需要重写 */
  getMessageListeners() {
    return {
      // 登录成功用户信息
      ["WS_MESSAGE_EVENT_USER_INFO"]: (msg) => {
        this.socket_login(msg);
      },
      // 获取游戏房间信息 - 每秒
      ["WS_MESSAGE_EVENT_GAME_INFO"]: (msg) => {
        this.socket_roominfo(msg);
      },
      // 获取游戏配置信息 - 一次
      ["WS_MESSAGE_EVENT_COIN_CONFIG_INFO"]: (msg) => {
        this.socket_configInfo_coin(msg);
      },
      // 服务端推送报错信息
      ["WS_MESSAGE_EVENT_ERROR"]: (msg) => {
        this.socket_errorMessage(msg);
      },

      ["game_move"]: (msg) => {
        this.socket_move(msg);
      },
      ["game_stage"]: (msg) => {
        this.socket_stage(msg);
      },
      ["game_betting"]: (msg) => {
        this.socket_betting(msg);
      },

      ["game_leave"]: (msg) => {
        this.socket_leave(msg);
      },
      ["game_join"]: (msg) => {
        this.socket_join(msg);
      },
      // ["game_userlist"]: (msg) => {
      //   this.socket_userlist(msg);
      // },
      // ["game_bettinglist"]: (msg) => {
      //   this.socket_bettinglist(msg);
      // },
      ["game_sync_status"]: (msg) => {
        this.socket_sync_status(msg);
      },
      ["game_close"]: (msg) => {
        this.socket_close(msg);
      },
    };
  }

  setTimeDoAni(fun, paramas, timer) {
    setTimeout(function () {
      fun(paramas);
    }, timer);
  }

  //登录
  login() {
    this.sendSocketMsg("WS_REQUEST_USER_LOGIN", {
      token: GameDataCenter.accountModel.token,
    });
  }

  // /** 加入游戏房间 */ 废弃
  // joinRoom(room_type: number) {
  //   this.sendSocketMsg("gamejoinroom", { room_type: room_type });
  // }

  /**
   * 移动到避难所
   * @param roomId
   */
  move(roomId: number) {
    this.sendSocketMsg("WS_REQUEST_USER_JOIN", { roomid: roomId });
  }

  /**
   * 下注
   * @param roomId 房间id
   * @param id 下注id
   */
  betting(roomId: number, id: number) {
    this.sendSocketMsg("WS_MESSAGE_EVENT_USER_INFO", {
      roomid: roomId,
      id: id,
    });
  }

  // 选中房间并下注
  selectRoomAndBetting(data: {
    room_id: number;
    dts_user_id: number;
    dts_game_id: number;
    coin_id: number;
  }) {
    this.sendSocketMsg("WS_REQUEST_USER_JOIN", data);
    // this.move(roomId);
    // this.betting(roomId, id);
  }

  socket_login(data) {
    Log.warn("流程排查1 - Websocket登录成功");
    console.log("查看获取到的数据", data);

    var accountModel = GameDataCenter.accountModel;
    accountModel.nickName = data.nickname;
    accountModel.uid = data.user_id;
    // 玩家账户余额
    accountModel.balance = data.balance;
    accountModel.sex = data.sex;
    // 玩家下注信息
    data.amount = 0;

    // 设置玩家拥有得游戏币
    GameDataCenter.roomInfoModel.setCoin(data.balance);

    // 判断是否渲染玩家元素，如果没有渲染，说明是第一次，需要初始化数据
    var player = GameDataCenter.accountModel.players.get(data.user_id);
    if (!player) {
      // 游戏初始化 - 初始化房间
      GameDataCenter.accountModel.clearRoomPlayers();
      GameDataCenter.accountModel.players.forEach((player) => {
        player.destroy();
      });

      // 登录成功- 创建玩家
      this.createPlayer(data, 0);
    }
  }

  // 更新玩家列表 包含所有玩家+下注玩家，   如果发现玩家房间号不一致，执行移动。 方法在每次用户列表更新的时候执行
  renderingRoomPlayer(userlist) {
    /*
        "dts_game_users": 
        [//游戏用户列表
            {
                "user_id": 1,//用户id
                "nickname": "",//
                "sex": 1,
                "room_id": 0,
                "amount": "22"//用户投注的金额
            }
        ],
    */

    // 判断是否渲染

    if (userlist.length == 0) {
      return;
    }

    // 渲染所有玩家 - 没下注
    for (let index of userlist) {
      //所有玩家都会创建 , 如果游戏角色已经创建，就直接执行更新逻辑
      this.createPlayer(index, index.room_id);

      // if (!this.createPlayer(index, index.room_id)) {
      //   this.updatePlayer(index);
      // }
      // 如果发现玩家在下注列表里，就展示下注的金额
      if (index.user_id == GameDataCenter.accountModel.uid) {
        // 如果玩家已经下注了，且选中了房间，就不要再重置了
        // if (GameDataCenter.roomInfoModel.roomId === 0) {
        //   GameDataCenter.roomInfoModel.roomId = index.room_id;
        // }

        var player = GameDataCenter.accountModel.players.get(index.user_id);
        player.showBetting(index.amount);
      }
    }

    // 将已有玩家列表，和现有数据列表对比， 如果发现房间ID不一致， 就调用移动流程
    // 已有玩家列表
    // console.log("已渲染玩家列表", GameDataCenter.accountModel.players);
    // console.log("服务端推送玩家列表", userlist);

    /**
     *  找到服务端离开的玩家，并销毁
     * */
    let playerIds = userlist.map((e) => e.user_id);
    //--downlevelIteration
    let filteredMap = new Map(
      [...GameDataCenter.accountModel.players].filter(([key, value]) => {
        return !playerIds.includes(value.uid);
      })
    );

    // console.log("不在服务器的玩家列表", filteredMap);
    filteredMap.forEach((e) => {
      var player = GameDataCenter.accountModel.players.get(e.uid);
      player?.destroy();
    });

    /**
     *
     *  找到已经下注的玩家，且房间号不一致的玩家
     *
     * */
    userlist.forEach((e) => {
      // 判断
      var player = GameDataCenter.accountModel.players.get(e.user_id);
      // console.log("遍历玩家信息", player);
      if (player.roomId !== e.room_id) {
        // console.log("这个是房间不正确的，所以需要移动房间", player);
        player.moveToRoomById(e.room_id);
      }
    });

    // if (GameDataCenter.accountModel.players.get(user.user_id)) {
    //   return;
    // }

    // 移动到其他房间
  }

  // 错误提示
  socket_errorMessage(data) {
    UIHelp.ShowTips(data.message);
  }
  // 进入游戏 - 更新一次
  socket_configInfo_coin(data) {
    Log.warn("流程排查2 - 获取下注配置", data);
    let { coin_types } = data;
    GameDataCenter.roomInfoModel.initBettingConf(coin_types, coin_types[0].id);
    UIGameLayer.instance.showLastKillerAni();
  }
  //进入游戏 - 每秒更新
  socket_roominfo(data) {
    // 清理所有房间玩家UI
    /**
     *  dts_game   游戏状态
     *  dts_game_users  游戏玩家
     *  rooms 游戏房间
     *  room_results   游戏结果
     */
    let { dts_game, dts_game_users, rooms, room_results, CoinTypes } = data;

    /*
      {
    "dts_game": {
        "id": 61,
        "dts_game_config_id": 1,
        "issue": "2024072800061",
        "stage": 3,
        "stage_string": "开始",
        "user_num": 2,
        "amount": "60",
        "start_at": 1722157858,
        "end_at": 1722157878,
        "dts_game_config": {
            "id": 1,
            "game_type": 1,
            "max": 2,
            "created_at": 1722157878,
            "updated_at": 1722157878
        }
    },
    // 没有下注也在里面
    "dts_game_users": [
        {
            "user_id": 9,
            "nickname": "1231235",
            "sex": 0,
            "room_id": 5,
            "amount": "20",
            "dts_game_record": {
                "status": 1,
                "win_amount": "0"
            },
            "prize_log": {
                "type": 0,
                "status": 0,
                "amount": "0"
            }
        },
        {
            "user_id": 8,
            "nickname": "123123",
            "sex": 0,
            "room_id": 6,
            "amount": "20",
            "dts_game_record": {
                "status": 1,
                "win_amount": "0"
            },
            "prize_log": {
                "type": 0,
                "status": 0,
                "amount": "0"
            }
        }
    ],
    "rooms": [
        {
            "room_id": 6,
            "amount": "40"
        },
        {
            "room_id": 5,
            "amount": "20"
        }
    ],
    "room_results": [
        {
            "room_id": 2,
            "status": 2
        },
        {
            "room_id": 5,
            "status": 3
        },
        {
            "room_id": 1,
            "status": 3
        },
        {
            "room_id": 3,
            "status": 1
        },
        {
            "room_id": 4,
            "status": 1
        },
        {
            "room_id": 6,
            "status": 1
        },
        {
            "room_id": 7,
            "status": 1
        },
        {
            "room_id": 8,
            "status": 1
        }
    ],
    "timestamp": 1722157878
}
    */

    var game_stage: number = dts_game.stage;
    GameDataCenter.roomInfoModel.changeRoomStage(dts_game, data.timestamp);

    UIGameLayer.instance.showLastKillerAni();

    switch (dts_game.stage) {
      case 1: {
        Log.warn("全局房间信息推送推送 - state1 等待", data);
        EventMng.emit(GameEvent.OPEN_GAME);

        // GameDataCenter.roomInfoModel.initRoomsCoin(rooms, false);

        // 渲染用户
        // 更新用户信息

        break;
      }
      case 2: {
        Log.warn("全局房间信息推送推送 - state2 杀手倒计时", data);
        // 渲染用户
        // 更新用户信息
        break;
      }
      case 3: {
        Log.warn("全局房间信息推送推送 - state3 杀人结算", data);

        /**
         * 定时动画
         */
        let timerCount = 1;

        // 动画一  - 播放关门动画
        this.setTimeDoAni(
          () => {
            console.log("播放关门动画");
            UIGameLayer.instance.showStage3Ani();
          },
          "",
          0 * 1000
        );
        timerCount += 1;

        // 动画二  -  播放杀手出现动画
        this.setTimeDoAni(
          () => {
            console.log("展示杀手即将出现提示");
            UIGame.instance.showStage3Ani();
          },
          "",
          timerCount * 1000
        );
        timerCount += 2;

        // 动画三  -  杀人动画
        // 被杀房间ID
        let killRoomObj = room_results.find((e) => e.status === 2);
        // 通过ID查询房间信息
        let killRoomInfo = rooms.find((e) => e.room_id === killRoomObj.room_id);

        this.setTimeDoAni(
          (res) => {
            // 杀手开始杀人
            console.log("杀手开始杀人");
            UIKiller.instance.kill(res);
          },
          killRoomObj.room_id,
          timerCount * 1000
        );
        timerCount += 7;

        // 动画四  -  结算动画
        //  设置结算数据

        // 找到自己结算数据
        let thisPlayerResult = dts_game_users.find(
          (e) => e.user_id == GameDataCenter.accountModel.uid
        );

        console.log("结算数据 - 找到自己的用户", thisPlayerResult);

        // 自己玩家的结果
        let resultType = 0;

        // 1.判断是否下注
        if (thisPlayerResult.room_id == 0) {
          //没进房间
          resultType = 2;
        } else {
          //2.判断是否被杀
          if (killRoomObj.room_id !== thisPlayerResult.room_id) {
            // 判断是否存在下注金额
            if (parseInt(thisPlayerResult.amount) === 0) {
              //赢
              resultType = 3;
            } else {
              //已下注，赢
              resultType = 4;
            }
          } else {
            //已下注，输
            resultType = 1;
          }
        }

        let killResultData = {
          shaid: killRoomObj.room_id, // 房间ID或标识符
          sha_total: killRoomInfo?.amount ?? 0, // 总分或总数 -
          betting_coin: parseFloat(thisPlayerResult?.amount), // 投注的硬币数
          win_coin: _.round(thisPlayerResult?.record.win_amount, 6), // 赢得的硬币数
          resultType: resultType, // 游戏结果类型   over lose win
        };

        this.setTimeDoAni(
          (res) => {
            GameDataCenter.roomInfoModel.setKillResult(res);
          },
          killResultData,
          timerCount * 1000
        );

        //  展示结算动画
        timerCount += 9;

        // 创建宝箱 - 并打开,简单弹窗提示获取信息
        if (thisPlayerResult.prize_log.status !== 0) {
          this.setTimeDoAni(
            () => {
              console.log("创建宝箱");
              this.createBaoxiang(thisPlayerResult.prize_log);
            },
            "",
            timerCount * 1000
          );
        }

        this.setTimeDoAni(
          () => {
            UIGame.instance.showStage5Ani();
          },
          "",
          timerCount * 1000
        );

        // 结算结束,需要设置用户账户余额
        // GameDataCenter.roomInfoModel.setCoin(data.user);

        break;
      }
      default:
        break;
    }

    /*
      自己玩家渲染时机：
        login就渲染自己玩家；
      其他玩家渲染时机：
        获取房间信息就渲染；
    */

    // 初始化房间信息  -  不管用户什么阶段进来，都需要执行的动作
    GameDataCenter.roomInfoModel.initData(dts_game, data.timestamp);
    GameDataCenter.roomInfoModel.initRoomsCoin(rooms, false);

    // 每次更新信息都渲染用户列表
    this.renderingRoomPlayer(dts_game_users);
    EventMng.emit(GameEvent.SET_DOORS, dts_game.stage);
  }

  socket_move(msg) {
    Log.warn("mock排查3 - 移动房间数据");
    var data = msg.data;
    GameDataCenter.roomInfoModel.initRoomsCoin(data.rooms, true);

    if (data.betting.uid == GameDataCenter.accountModel.uid) {
      GameDataCenter.roomInfoModel.roomId = data.betting.roomid;
    }
    GameDataCenter.accountModel.players
      .get(data.betting.uid)
      .moveToRoomById(data.betting.roomid);
  }

  socket_stage(msg) {
    Log.warn("mock排查7 - 同步房间状态");
    var data = msg.data;
    var game_stage: number = data.game_stage;
    GameDataCenter.roomInfoModel.changeRoomStage(data, data.timestamp);
    UIGameLayer.instance.showLastKillerAni();
    switch (game_stage) {
      case 1:
        EventMng.emit(GameEvent.OPEN_GAME);
        GameDataCenter.roomInfoModel.initData(data.roominfo, data.timestamp);
        GameDataCenter.roomInfoModel.initRoomsCoin(data.rooms, false);
        GameDataCenter.roomInfoModel.initBettingConf(
          data.betting_config,
          data.betting_id
        );
        break;
      case 3:
        UIGame.instance.showStage3Ani();
        UIGameLayer.instance.showStage3Ani();
        break;
      case 4:
        UIKiller.instance.kill(data.shaid);

        break;
      case 5:
        GameDataCenter.roomInfoModel.setKillResult(data);
        GameDataCenter.roomInfoModel.setCoin(data.user);
        UIGame.instance.showStage5Ani();
        // 创建宝箱
        break;
      default:
        break;
    }
  }

  socket_betting(msg) {
    Log.warn("mock排查6 - 获取下注的信息");
    var data = msg.data;
    var betting = data.betting;
    var player = GameDataCenter.accountModel.players.get(betting.uid);
    if (betting.uid != GameDataCenter.accountModel.uid) {
      player.moveToRoomById(betting.roomid);
    } else {
      player.showBetting(betting.coin);
    }

    GameDataCenter.roomInfoModel.minPlayerNum = data.betting_num;
    GameDataCenter.roomInfoModel.maxPlayerNum = data.total_num;
    GameDataCenter.roomInfoModel.initRoomsCoin(data.rooms, true);
    GameDataCenter.roomInfoModel.setCoin(msg.data.user);
  }

  socket_leave(msg) {
    var data = msg.data;
    var player = GameDataCenter.accountModel.players.get(data.uid);
    player?.destroy();
  }

  //加入房间逻辑  - 完成
  socket_join(msg) {
    var data = msg.data;
    if (data.is_betting) {
      return;
    }

    this.createPlayer(data.user, 0);
  }

  socket_sync_status(msg) {
    var data = msg.data;
    GameDataCenter.roomChoseModel.initData(data.room_status);
  }

  socket_close(msg) {
    EventMng.emit(GameEvent.CLOSE_GAME);
  }

  private updatePlayer(user: any) {
    let player = GameDataCenter.accountModel.players.get(user.user_id);
    if (player) {
      // 更新下注金额
      player.coin = _.round(user.amount, 2);
    }
  }

  private createPlayer(user: any, roomId: number) {
    // console.log("创建玩家UI-查看数量", GameDataCenter.accountModel.players);

    if (GameDataCenter.accountModel.players.get(user.user_id)) {
      return false;
    }

    /*
    {
      "user_id": 5,
      "nickname": "上善若水",
      "sex": 0,
      "balance": "99840"
    }
    */

    // 这里是new出来的
    let player = new PlayerModel();
    player.initData(user, roomId);
    player.loadPlayerAni(roomId);
    GameDataCenter.accountModel.players.set(user.user_id, player);

    GameDataCenter.accountModel.roomPlayers
      .get(roomId)
      ?.set(user.user_id, player);

    GameDataCenter.roomInfoModel.refreshRoomPlayer();

    return true;
  }

  // 创建宝箱并播放动画
  private createBaoxiang(prize_log: any) {
    // console.log("new 一个宝箱", prize_log);

    // 这里是new出来的
    let baoxiang = new BaoxiangModel();
    // baoxiang.initData({ lv: prize_log.type, other: 2 });
    baoxiang.loadBaoxiangAni(prize_log);

    // GameDataCenter.accountModel.roomPlayers.get(roomId).set(user.uid, player);
    // GameDataCenter.roomInfoModel.refreshRoomPlayer();
  }
}
