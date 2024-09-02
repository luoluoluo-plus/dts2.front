import GameDataCenter from "../userData/GameDataCenter";
import EventMng from "../framework/manager/EventMng";
import UIHelp from "../framework/ui/UIHelp";
// import { Websocket } from "./Websocket";
import { ConfigModule } from "../userData/ConfigModule";
import GameController from "../GameController";
import { Log, LOG_TAG } from "../utils/Log";

export class SocketDelegate {
  private url: string;
  private websocket: WebSocket;

  constructor() {}

  public connect() {
    if (ConfigModule.IS_TEST) {
      this.url = ConfigModule.WS_URL_TEST; //正式服
    } else {
      this.url = ConfigModule.WS_URL_DEV; //测试服
    }
    if (CC_DEBUG) {
      this.url = ConfigModule.WS_URL_LOCAL;
    }

    console.log("打印websocket链接地址", this.url);
    this.websocket = new WebSocket(this.url);

    this.websocket.binaryType = "arraybuffer";

    // new Websocket({
    //   url: this.url,
    //   pingTimeout: 3000,
    //   pongTimeout: 5000,
    //   pingMsg: "ping",
    // });

    // this.websocket.binaryType = "arraybuffer";
    this.websocket.onopen = this.onopen.bind(this);
    this.websocket.onmessage = this.onmessage.bind(this);
    // this.websocket.onreconnect = this.onreconnect.bind(this);
    this.websocket.onclose = this.onclose.bind(this);
    this.websocket.onerror = this.onerror.bind(this);
  }

  public send(c: string, data: any) {
    var obj: Object = {
      event: c,
      data: data,
    };

    this.websocket.send(JSON.stringify(obj));

    if (cc.sys.isNative) {
      Log.logTag(
        LOG_TAG.SOCKET,
        "%cSOCKET发送-->",
        "color:#fff;background:red",
        JSON.stringify(obj)
      );
    } else {
      Log.logTag(
        LOG_TAG.SOCKET,
        "%cSOCKET发送-->",
        "color:#fff;background:red",
        obj
      );
    }
  }

  public close() {
    this.websocket.close();
  }

  //需要自己补充逻辑
  public toLoginScene() {
    GameController.socket.close();
    // if (cc.director.getScene().name == "hallScene") {
    //     cc.director.loadScene("loginScene");
    // }
  }

  private onopen() {
    Log.warn("connect success");
    // cc.director.resume();
    // 关闭加载中
    UIHelp.CloseLoding();
    // 接口流程排查：3、链接websocket,websocket发送登录
    GameDataCenter.socketModel.login();
  }

  // 获取二进制包
  public handleArrayBuffer(arrayBuffer) {
    // 用 `DataView` 或 `TypedArray` 方法来处理 ArrayBuffer
    const view = new DataView(arrayBuffer);
    // 示例：读取第一个字节
    const firstByte = view.getUint8(0);
    // console.log("First byte:", firstByte);

    // 进一步处理数据...
    // 例如：转化为字符串（假设数据是文本）
    const textDecoder = new TextDecoder();
    const decodedString = textDecoder.decode(arrayBuffer);
    // console.log("Decoded string:", decodedString);
    return decodedString;
  }

  public handleBlob(blob) {
    // 可以使用 FileReader 来读取 Blob 数据
    const reader = new FileReader();

    reader.onload = function (event) {
      const arrayBuffer = event.target.result;
      this.handleArrayBuffer(arrayBuffer);
    }.bind(this);

    reader.onerror = function (error) {
      console.error("Blob reading error:", error);
    }.bind(this);

    // 读取 Blob 数据为 ArrayBuffer
    return reader.readAsArrayBuffer(blob);
  }

  private onmessage(e) {
    const data = e.data;

    let result = null;
    // 处理传入的二进制数据（ArrayBuffer 或 Blob）
    if (data instanceof ArrayBuffer) {
      result = this.handleArrayBuffer(data);
    } else if (data instanceof Blob) {
      result = this.handleBlob(data);
    }

    result = JSON.parse(result);
    console.log("WebSocket收到信息", result);
    console.log("message信息值", result.event);
    EventMng.emit(`${result.event}`, result.data);
  }

  private onreconnect() {
    Log.error("reconnecting...");
    // cc.director.pause();
    UIHelp.ShowLoding();
  }

  private onclose() {}

  private onerror() {}

  private base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  }

  private Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
      c = array[i++];
      switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
        case 12:
        case 13:
          // 110x xxxx   10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode(
            ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
          );
          break;
      }
    }

    return out;
  }

  private arrayBufferToString(arr) {
    if (typeof arr === "string") {
      return arr;
    }
    var dataview = new DataView(arr.data);
    var ints = new Uint8Array(arr.data.byteLength);
    for (var i = 0; i < ints.length; i++) {
      ints[i] = dataview.getUint8(i);
    }
    arr = ints;
    var str = "",
      _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
      var one = _arr[i].toString(2),
        v = one.match(/^1+?(?=0)/);
      if (v && one.length == 8) {
        var bytesLength = v[0].length;
        var store = _arr[i].toString(2).slice(7 - bytesLength);
        for (var st = 1; st < bytesLength; st++) {
          store += _arr[st + i].toString(2).slice(2);
        }
        str += String.fromCharCode(parseInt(store, 2));
        i += bytesLength - 1;
      } else {
        str += String.fromCharCode(_arr[i]);
      }
    }
    return str;
  }
}
