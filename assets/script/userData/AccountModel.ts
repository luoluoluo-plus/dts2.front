import IDataModel from "../framework/model/IDataModel";
import GameDataCenter from "./GameDataCenter";
import PlayerModel from "./PlayerModel";

export default class AccountModel extends IDataModel {
  public avatar: string = "";
  public sex: string = "";
  public balance: string = "";
  public nickName: string = "";
  public uid: number = 0;
  public status: number = 0;
  public players: Map<number, PlayerModel> = new Map();
  public roomPlayers: Map<number, Map<number, PlayerModel>> = new Map();
  public noMoreJilu: boolean = false;
  public myRankNo: string = ""; //vm显示排行榜自己排名
  public lastRankNo: string = "";
  public thisRankNo: string = "";
  public myRankNum: string = ""; //vm显示排行榜自己金币
  public lastRankNum: string = "";
  public thisRankNum: string = "";

  //浏览器首选语言
  public language: string = "";

  constructor() {
    super("account");
  }

  public get token(): string {
    return this.Query("token", "");
  }

  public set token(v: string) {
    this.Set("token", v);
    this.Save();
  }

  //登录
  login(data: {
    channel_id: string;
    channel_user_id: string;
    sex: string;
    nickname: string;
  }) {
    var params = {
      channel_id: data.channel_id,
      channel_user_id: data.channel_user_id,
      sex: parseInt(data.sex),
      nickname: data.nickname,
    };

    // 这里的回调不生效的
    this.postHttpMsg(
      "/client/user/login",
      params,
      function (res) {
        let data = res.data;
        console.log("登录接口回调", data);
      }.bind(this)
    );
  }

  //游戏记录
  records(): Promise<any> {
    var params = {
      room_type: GameDataCenter.roomInfoModel.roomType,
    };

    return new Promise((resolve, reject) => {
      this.postHttpMsg(
        "/client/game/records",
        params,
        function (res) {
          let data = res.data;

          console.log("近10局游戏被杀统计", data);
          var item2 = {
            type: 2,
            list: data.games,
          };
          resolve(item2);
        }.bind(this)
      );
    });
  }

  //最近一百局游戏被杀统计
  kill_room_statistics(): Promise<any> {
    var params = {
      room_type: GameDataCenter.roomInfoModel.roomType,
    };

    return new Promise((resolve, reject) => {
      this.postHttpMsg(
        "/client/game/kill_room_statistics",
        params,
        function (res) {
          let data = res.data;

          console.log("近一百局游戏被杀统计", data);
          var item2 = {
            type: 1,
            list: data.rooms,
          };
          resolve(item2);
        }.bind(this)
      );
    });
  }

  //用户游戏投入获取统计
  game_record_statistic(): Promise<any> {
    var params = {
      room_type: GameDataCenter.roomInfoModel.roomType,
    };

    return new Promise((resolve, reject) => {
      this.postHttpMsg(
        "/client/user/game_record_statistic",
        params,
        function (res) {
          console.log("获取游戏下注记录", res);
          let data = res.data;

          var item3 = {
            type: 3,
            betting_total: data.in_amount,
            result_total: data.reward_amount,
          };

          resolve(item3);
        }.bind(this)
      );
    });
  }

  //下注记录
  
  getBettingLog(page: number): Promise<any> {
    var params = {
      room_type: GameDataCenter.roomInfoModel.roomType,
      page: page,
      page_size: 20,
    };

    return new Promise((resolve, reject) => {
      if (this.noMoreJilu) {
        resolve([]);
        return;
      }
      this.postHttpMsg(
        "/client/user/records",
        params,
        function (res) {
          console.log("获取游戏下注记录", res)
          let data = res.data;
          let list = [];
          for (let index of data.list) {
            let item = {
              type: 4,
              user: index,
            };
            list.push(item);
          }

          if (list.length < 20) {
            if (!this.noMoreJilu) {
              this.noMoreJilu = true;
              list.push({ type: 5 });
            }
          }
          resolve(list);
        }.bind(this)
      );
    });
  }

  //获得排行榜数据
  getRank(): Promise<any> {
    var params = {
      room_type: GameDataCenter.roomInfoModel.roomType,
    };

    return new Promise((resolve, reject) => {
      this.postHttpMsg("game/v1/getRank", params, (res) => {
        let data = res.data;
        this.lastRankNum = data.last_rank_num;
        this.myRankNum = this.thisRankNum = data.this_rank_num;
        this.lastRankNo =
          data.last_rank_no == 0
            ? GameDataCenter.accountModel.language == "zh"
              ? "未上榜"
              : "Not on the list"
            : String(data.last_rank_no);
        this.myRankNo = this.thisRankNo =
          data.this_rank_no == 0
            ? GameDataCenter.accountModel.language == "zh"
              ? "未上榜"
              : "Not on the list"
            : String(data.this_rank_no);

        resolve(data);
      });
    });
  }

  clearRoomPlayers() {
    for (let i = 0; i <= 8; i++) {
      this.roomPlayers.set(i, new Map());
    }
  }
}
