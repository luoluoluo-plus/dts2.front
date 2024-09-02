import IDataModel from "../framework/model/IDataModel";
import { SingletonFactory } from "../framework/lib/SingletonFactory";
import { VM } from "./../framework/component/ViewModel";
import SocketModel from "./SocketModel";
import AccountModel from "./AccountModel";
import RoomInfoModel from "./RoomInfoModel";
import RoomChoseModel from "./RoomChoseModel";
import ChestModel from "./ChestModel";

class GameDataCenter {
  private _tModel: Array<IDataModel> = [];

  accountModel: AccountModel = null;
  socketModel: SocketModel = null;
  roomInfoModel: RoomInfoModel = null;
  roomChoseModel: RoomChoseModel = null;
  chestModel: ChestModel = null;

  public static instance;

  constructor() {
    GameDataCenter.instance = this;
  }

  newModel<T extends IDataModel>(c: { new (): T }): T {
    let obj = SingletonFactory.getInstance(c);
    this._tModel.push(obj);
    return obj;
  }

  clear() {
    this._tModel.forEach((m) => {
      m.clear();
    });
  }

  initModule() {
    this.accountModel = this.newModel(AccountModel);
    this.socketModel = this.newModel(SocketModel);
    this.roomInfoModel = this.newModel(RoomInfoModel);
    this.roomChoseModel = this.newModel(RoomChoseModel);
    this.chestModel = this.newModel(ChestModel);

    VM.add(this.accountModel, "account");
    VM.add(this.roomInfoModel, "roomInfo");
    VM.add(this.roomChoseModel, "roomChose");
    VM.add(this.chestModel, "chestModel");
  }
}

export default new GameDataCenter();
(window as any).GameDataCenter = GameDataCenter;
