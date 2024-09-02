import GameController from "../../GameController";
import { Log } from "../../utils/Log";
import EventMng from "../manager/EventMng";
import ISerialize from "./ISerialize";

export default class IDataModel extends ISerialize {
  constructor(modelName = "default") {
    super(modelName);
    this.registerListeners();
  }

  clear() {}

  /**
   * 注册网络监听事件
   */
  private registerListeners() {
    let tbMsg = this.getMessageListeners();
    for (const key in tbMsg) {
      if (tbMsg.hasOwnProperty(key)) {
        console.log("注册网络事件", key.toString());
        EventMng.on(key.toString(), function (msg) {
          tbMsg[key](msg);
        });
      }
    }
  }

  /**
   * 子类需要重写此方法，返回需要注册的监听事件
   */
  getMessageListeners() {
    return {};
  }

  postHttpMsg(cmd, msg, callback, loding: boolean = true) {
    try {
      GameController.network.httpPost(cmd, msg, callback, loding);
    } catch (e) {
      Log.error("send http proto", msg, e);
    }
  }

  sendHttpMsg(cmd, msg, callback?, loding: boolean = true) {
    try {
      GameController.network.httpSend(cmd, msg, callback, loding);
    } catch (e) {
      Log.error("send http proto", msg, e);
    }
  }

  sendSocketMsg(c: string, data: any) {
    try {
      GameController.socket.send(c, data);
    } catch (e) {
      Log.error("send socket proto", e);
    }
  }
}
