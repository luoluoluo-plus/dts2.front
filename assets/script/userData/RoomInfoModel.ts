import EventMng from "../framework/manager/EventMng";
import IDataModel from "../framework/model/IDataModel";
import { GameEvent } from "./EventConst";
import { i18nMgr } from "../../script/framework/i18n/i18nMgr";
import GameDataCenter from "./GameDataCenter";

import * as _ from "lodash";
export var ROAD_NAME = {
  1: "梦幻星空房",
  2: "璀璨星耀房",
  3: "星云幻梦房",
  4: "星际遨游房",
  5: "星辰港湾房",
  6: "星芒璀璨房",
  7: "星语心愿房",
  8: "流星花园房",
};
export var ROAD_NAME_EN = {
  1: "Dreamy Starry Room",
  2: "Brilliant Starry Room",
  3: "Nebula Dream Room",
  4: "Interstellar Travel Room",
  5: "Stellar Harbor Room",
  6: "Shining Star Room",
  7: "Starlight Wish Room",
  8: "Meteor Garden Room",
};
export var ROAD_NAME_KR = {
  1: "꿈의 별방",
  2: "빛나는 별방",
  3: "성운의 꿈방",
  4: "우주여행 방",
  5: "별 항구 방",
  6: "반짝이는 별방",
  7: "별의 소원 방",
  8: "유성 정원 방",
};
export var ROAD_NAME_JP = {
  1: "夢幻の星空の部屋",
  2: "輝く星の部屋",
  3: "星雲の夢の部屋",
  4: "星間旅行の部屋",
  5: "星の港の部屋",
  6: "輝く星の部屋",
  7: "星の願いの部屋",
  8: "流星の庭の部屋",
};
export var ROOM_NAME = {
  1: "DLT",
  2: "DLT",
  3: "DLT",
};
export default class RoomInfoModel extends IDataModel {
  public gameStage: number = 1; //游戏状态
  public roomType: number = 1; //房间类型
  public waitTime: number = 0; //状态等待时间
  public coin: number = 0; //拥有的coin
  public coin1: number = 0; //房间1所有玩家下注的coin
  public coin2: number = 0;
  public coin3: number = 0;
  public coin4: number = 0;
  public coin5: number = 0;
  public coin6: number = 0;
  public coin7: number = 0;
  public coin8: number = 0;
  public coinName: string = "";
  public bettingConfig1: number = 0;
  public bettingConfig2: number = 0;
  public bettingConfig3: number = 0;
  public minPlayerNum: number = 0; //等待状态当前人数
  public maxPlayerNum: number = 0; //等待状态所需最大人数
  public killRoomName: string = "杂物室"; //被杀房间名字
  public coinGuafenNum: number = 0; //所有人瓜分的coin数量
  public resultType: number = 0; //游戏结束显示的类型
  public gameNo: number = 0; //当前期数
  public lastShaRoomName: string = ""; //上期被杀房间名字
  public bettingCoin: number = 0; //下注coin数量
  public winCoin: number = 0; //获得coin数量

  /* "dts_game": { //游戏对象
  "id": 52,// 游戏id
  "dts_game_config_id": 1, //游戏配置id
  "issue": "2024072700012",//游戏期数
  "stage": 3, // 1 等待 2 开始(倒计时) 3 结束(开始杀人)
  "stage_string": "开始",
  "user_num": 0,//当前游戏用户数
  "amount": "0",//当前游戏总宝石数
  "start_at": 1722010943,//倒计时开始时间
  "end_at": 1722010963,//倒计时结束时间
  "dts_game_config": {
      "id": 1,
      "game_type": 1,
      "max": 1,
      "created_at": 1722010963,
      "updated_at": 1722010963
  }
},
*/

  public bettingNum: number = 0;
  public bettingId: number = 1; //下注id：1-3
  public roomId: number = 0; //房间id：1-8

  public dts_game_id: number = 0; // 游戏id
  public dts_game_config_id: number = 0; // 游戏配置id
  public issue: number = 0; // 游戏期数
  public stage: number = 0; // 1 等待 2 开始(倒计时) 3 结束(开始杀人)
  public stage_string: number = 0; //游戏状态字符串
  public user_num: number = 0; //当前游戏用户数
  public amount: number = 0; //当前游戏总宝石数
  public start_at: number = 0; //倒计时开始时间 -
  public end_at: number = 0; //倒计时结束时间 -

  public dts_game_configid: number = 0; //游戏配置-ID
  public dts_game_config_game_type: string = ""; //游戏配置 - 币种
  public dts_game_config_max: number = 0; //游戏配置 - 最大人数
  public dts_game_config_created_at: number = 0; //游戏配置 -
  public dts_game_config_updated_at: number = 0; //游戏配置 -

  // 当前房间玩家列表 -

  // 当前房间玩家列表；

  constructor() {
    super("roomInfo");
  }

  initData(data: any, serverTimeStamp: number) {
    this.roomType = 1;
    // this.roomType = data.dts_game_config.game_type;
    this.minPlayerNum = data.user_num;
    this.maxPlayerNum = data.dts_game_config.max;
    this.gameNo = data.issue;

    this.dts_game_id = data.id;
    // // 上一期杀手房间ID
    // if (GameDataCenter.accountModel.language == "zh") {
    //   this.lastShaRoomName = ROAD_NAME[res.last_shaid] || "";
    // } else {
    //   this.lastShaRoomName = ROAD_NAME_EN[res.last_shaid] || "";
    // }

    this.changeRoomStage(data, serverTimeStamp);
    this.setRoomName(1);
    // this.setRoomName(data.dts_game_config.game_type);
  }

  /** 改变房间状态
   * 阶段1 等待阶段 满人即开局
   * 阶段2 等待杀手阶段
   * 阶段3 杀手准备出现阶段
   * 阶段4 杀手出现阶段
   * 阶段5 游戏结果阶段
   */

  changeRoomStage(data: any, serverTimeStamp: number) {
    this.gameStage = data.stage;
    this.stage = data.stage;

    console.warn("game_stage1:  ", this.gameStage);
    // 等待为0 才计算  游戏状态进入 2得时候才需要道济是
    if (this.waitTime === 0 && data.stage == 2) {
      // 一致在房间内，和倒计时开始再进入房间
      let start_at =
        serverTimeStamp >= data.start_at ? serverTimeStamp : data.start_at;

      this.waitTime = data.end_at - start_at;
      console.warn("game_stage:  ", this.gameStage);
    }
  }

  /** 初始化金币/钻石消耗数量 */
  initBettingConf(res: any, bettingId: number) {
    this.bettingConfig1 = parseInt(res[0]?.amount) || 0.2;
    this.bettingConfig2 = parseInt(res[1]?.amount) || 0.2;
    this.bettingConfig3 = parseInt(res[2]?.amount) || 0.2;
    if (bettingId) {
      this.bettingNum = res.find((e) => e.id === bettingId)?.amount;
      this.bettingId = bettingId;
    }
  }

  /** vm刷新房间下注的金币/钻石 */
  initRoomsCoin(
    rooms: { room_id: number; amount: number }[],
    isScale: boolean
  ) {
    //
    // if (isScale) {
    //   EventMng.emit(GameEvent.COIN_SCALE, rooms);
    // }

    for (let index of rooms) {
      this[`coin${index.room_id}`] = index.amount;
    }
  }

  setCoin(balance: any) {
    this.coin =     _.round(balance, 2);

  }

  setKillResult(data: any) {
    if (GameDataCenter.accountModel.language == "zh") {
      this.killRoomName = `「${ROAD_NAME[data.shaid]}」`;
      this.lastShaRoomName = ROAD_NAME[data.shaid];
    } else if (GameDataCenter.accountModel.language == "en") {
      this.killRoomName = `「${ROAD_NAME_EN[data.shaid]}」`;
      this.lastShaRoomName = ROAD_NAME_EN[data.shaid];
    } else if (GameDataCenter.accountModel.language == "ko") {
      this.killRoomName = `「${ROAD_NAME_EN[data.shaid]}」`;
      this.lastShaRoomName = ROAD_NAME_EN[data.shaid];
    } else {
      this.killRoomName = `「${ROAD_NAME_EN[data.shaid]}」`;
      this.lastShaRoomName = ROAD_NAME_EN[data.shaid];
    }

    this.coinGuafenNum = data.sha_total;
    this.bettingCoin = data.betting_coin;
    this.winCoin = data.win_coin;

    //  下注结果

    this.resultType = data.resultType;
    // if (data.tp == "over") {
    //   //没下注
    //   if (this.roomId == 0) {
    //     //没进房间
    //     this.resultType = 2;
    //   } else if (this.roomId == data.shaid) {
    //     //输
    //     this.resultType = 1;
    //   } else {
    //     //赢
    //     this.resultType = 3;
    //   }
    // } else if (data.tp == "win") {
    //   //已下注，赢
    //   this.resultType = 4;
    // } else if (data.tp == "lose") {
    //   //已下注，输
    //   this.resultType = 1;
    // }
  }

  /** 刷新每个房间显示的小人 */
  refreshRoomPlayer(roomId?: number) {
    if (typeof roomId == "number") {
      let map = GameDataCenter.accountModel.roomPlayers.get(roomId);
      let l = map.size;
      let min = Math.max(0, l - 100);
      let j = 0;
      map.forEach((element) => {
        j += 1;
        element.setAniActive(j > min);
      });
    } else {
      for (let i = 0; i <= 8; i++) {
        let map = GameDataCenter.accountModel.roomPlayers.get(i);
        let l = map.size;
        let min = Math.max(0, l - 200);
        let j = 0;
        map.forEach((element) => {
          j += 1;
          element.setAniActive(j > min);
        });
      }
    }
  }

  /** 设置房间名 */
  private async setRoomName(id: number) {
    console.log("查看金币名称", await i18nMgr._getLabel("i18n_coinName", []));
    // 设置金币名称
    this.coinName = await i18nMgr._getLabel("i18n_coinName", []);
  }
}
