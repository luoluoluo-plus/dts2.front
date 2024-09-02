import { Http } from "./Http";
import EventMng from "../framework/manager/EventMng";
import { ConfigModule } from "../userData/ConfigModule";
import UIHelp from "../framework/ui/UIHelp";
import GameDataCenter from "../userData/GameDataCenter";
import { Log, LOG_TAG } from "../utils/Log";

export class Network {
  private _httpUrl: string;

  constructor() {}

  //http请求
  httpSend(cmd, params, callback, loding) {
    if (ConfigModule.IS_TEST) {
      this._httpUrl = ConfigModule.HTTP_URL_TEST;
    } else {
      this._httpUrl = ConfigModule.HTTP_URL_DEV;
    }
    if (CC_DEBUG) {
      this._httpUrl = ConfigModule.HTTP_URL_LOCAL;
    }
    var self = this;

    if (loding) {
      UIHelp.ShowLoding();
    }

    if (params && GameDataCenter.accountModel.token) {
      params["token"] = GameDataCenter.accountModel.token;
    }

    var param = this.obj_contact(params);
    var url = encodeURI(self._httpUrl + "/" + cmd + param);

    Log.logTag(
      LOG_TAG.HTTP,
      `%chttp发送: ${cmd}-->`,
      "color:#000;background:yellow",
      url
    );

    Http.get(
      url,
      function (eventName: string, xhr: XMLHttpRequest) {
        UIHelp.CloseLoding();
        if (eventName == "COMPLETE") {
          if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
            var response = JSON.parse(xhr.responseText);
            let replace = cmd.replace(/\//g, "_");

            // if (cc.sys.isNative) {
            //   Log.logTag(
            //     LOG_TAG.HTTP,
            //     `%chttp接收: ${replace}-->`,
            //     "color:#000;background:orange",
            //     JSON.stringify(response)
            //   );
            // } else {
            //   Log.logTag(
            //     LOG_TAG.HTTP,
            //     `%chttp接收: ${replace}-->`,
            //     "color:#000;background:orange",
            //     response
            //   );
            // }

            // console.log("获取请求回调1", callback);

            if (response["errcode"] != 0) {
              if (response["errcode"] == "1000") {
                GameDataCenter.accountModel.token = "";
              }
              if (GameDataCenter.accountModel.language == "zh") {
                UIHelp.ShowTips(response["errmsg"]);
              } else {
                UIHelp.ShowTips(response["errmsg_en"]);
              }
              return;
            }

            // console.log("获取请求回调2", callback);

            callback && callback(response);
          } else {
            UIHelp.ShowTips("服务器维护中");
          }
        } else if (eventName == "TIMEOUT") {
          //TODO:添加提示连接网关超时
          // this.et.emit('TIMEOUT', {})
          Log.error("添加提示连接网关超时");
        } else if (eventName == "ERROR") {
          //TODO:添加提示连接网关发生错误
          Log.error("添加提示连接网关发生错误");
        }
      },
      this
    );
  }

  public httpPost(url: string, params: any, callback: Function, loding) {
    //异步httppost
    if (ConfigModule.IS_TEST) {
      this._httpUrl = ConfigModule.HTTP_URL_TEST;
    } else {
      this._httpUrl = ConfigModule.HTTP_URL_DEV;
    }
    if (CC_DEBUG) {
      this._httpUrl = ConfigModule.HTTP_URL_LOCAL;
    }
    var self = this;
    if (loding) {
      UIHelp.ShowLoding();
    }

    var surl;
    surl = url;
    if (GameDataCenter.accountModel.token) {
      surl = url + "?token=" + GameDataCenter.accountModel.token;
    }

    var urcl = encodeURI(self._httpUrl + surl);

    Log.logTag(
      LOG_TAG.HTTP,
      `%chttp发送: ${url}-->`,
      "color:#000;background:yellow",
      urcl
    );

    Http.post(
      urcl,
      params,
      async function (eventName: string, xhr: XMLHttpRequest) {
        // console.log("查看请求的内容", eventName, xhr, callback);
        UIHelp.CloseLoding();
        if (eventName == "COMPLETE") {
          if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
            var response = JSON.parse(xhr.responseText);
            let replace = url.replace(/\//g, "_");

            if (cc.sys.isNative) {
              Log.logTag(
                LOG_TAG.HTTP,
                `%chttp接收: ${replace}-->`,
                "color:#000;background:orange",
                JSON.stringify(response)
              );
            } else {
              Log.logTag(
                LOG_TAG.HTTP,
                `%chttp接收: ${replace}-->`,
                "color:#000;background:orange",
                response
              );
            }

            // console.log("获取请求回调1", callback);

            if (response.data.token) {
              GameDataCenter.accountModel.token = response.data.token;
            }

            callback && (await callback(response));
          }
        } else if (eventName == "TIMEOUT") {
          //TODO:添加提示连接网关超时
          this.et.emit("TIMEOUT", {});
          Log.error("添加提示连接网关超时");
        } else if (eventName == "ERROR") {
          //TODO:添加提示连接网关发生错误
          Log.error("添加提示连接网关发生错误");
        }
      },
      this
    );
  }

  public obj_contact(obj) {
    var s = "";
    for (var k in obj) {
      let v = obj[k];
      if (s.length == 0) {
        s += "?" + k + "=" + v;
      } else {
        s += "&" + k + "=" + v;
      }
    }
    return s;
  }
}
