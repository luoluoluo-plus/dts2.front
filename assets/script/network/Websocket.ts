import GameDataCenter from "../userData/GameDataCenter";
import { Log } from "../utils/Log";

export interface OPTS {
  url: string; //websocket服务端接口地址
  pingTimeout?: number; //每隔15秒发送一次心跳，如果收到任何后端消息定时器将会重置
  pongTimeout?: number; //ping消息发送之后，10秒内没收到后端消息便会认为连接断开
  reconnectTimeout?: number; //尝试重连的间隔时间
  pingMsg?: string; //ping消息值
  repeatLimit?: number | null; //重连尝试次数。默认不限制
}
export class Websocket {
  public opts: OPTS;
  public ws = null; //websocket实例
  public repeat = 0;
  public forbidReconnect: boolean = false;
  public forgroundCount: any = -1;
  public isWx: boolean = cc.sys.platform == cc.sys.WECHAT_GAME;

  private pemUrl;
  private hasAddEvent: boolean = false;
  private isHide: boolean = false;

  constructor({
    url,
    pingTimeout = 150000,
    pongTimeout = 150000,
    reconnectTimeout = 2000,
    pingMsg = "heartbeat",
    repeatLimit = null,
  }) {
    this.opts = {
      url: url,
      pingTimeout: pingTimeout,
      pongTimeout: pongTimeout,
      reconnectTimeout: reconnectTimeout,
      pingMsg: pingMsg,
      repeatLimit: repeatLimit,
    };
    // this.pemUrl = cc.url.raw("resources/cacert1.cer")
    this.createWebSocket();

    cc.game.off(cc.game.EVENT_SHOW);
    cc.game.off(cc.game.EVENT_HIDE);
  }

  onclose = () => {};
  onerror = () => {};
  onopen = () => {};
  onmessage = () => {};
  onreconnect = () => {};

  applocationShow() {
    Log.log("game show");

    if (!this.isHide) {
      return;
    }

    this.isHide = false;

    this.forbidReconnect = false;

    if (this.forgroundCount != -1) {
      clearTimeout(this.forgroundCount);
    }
    this.forgroundCount = setTimeout(() => {
      this.createWebSocket();
    }, 500);
  }

  applocationHide() {
    Log.log("game hide");

    this.isHide = true;

    this.close();
  }

  createWebSocket = function () {
    if (this.ws && this.ws.readyState == this.ws.OPEN) {
      return;
    }
    try {
      if (this.isWx) {
        this.ws = wx.connectSocket({
          url: this.opts.url,
          success: function () {
            Log.log("wx connect socket success");
          },
          fail: function () {
            Log.log("wx connect socket fail");
          },
        });
      } else {
        // this.ws = new WebSocket(this.opts.url, [], this.pemUrl);
        this.ws = new WebSocket(this.opts.url, []);
      }
      this.initEventHandle();
    } catch (e) {
      Log.log("createWebSocket error", e);
      this.reconnect();
      throw e;
    }
  };

  initEventHandle = function () {
    if (this.isWx) {
      this.ws.onClose(
        function () {
          Log.log("wx --> onClose...");
          this.onclose();
          this.reconnect();
        }.bind(this)
      );

      this.ws.onError(
        function (err) {
          Log.log("wx --> onError...", err);
          this.onerror();
          this.reconnect();
        }.bind(this)
      );

      this.ws.onOpen(
        function () {
          Log.log("wx --> onOpen...");
          if (!this.hasAddEvent) {
            this.hasAddEvent = true;
            cc.game.on(cc.game.EVENT_SHOW, this.applocationShow, this);
            cc.game.on(cc.game.EVENT_HIDE, this.applocationHide, this);
          }
          this.repeat = 0;
          this.onopen();
          //心跳检测重置
          this.heartCheck();
        }.bind(this)
      );

      this.ws.onMessage(
        function (event) {
          this.onmessage(event);
          //如果获取到消息，心跳检测重置
          //拿到任何消息都说明当前连接是正常的
          this.heartCheck();
        }.bind(this)
      );
    } else {
      this.ws.onclose = () => {
        Log.log("ws --> onclose...");
        this.onclose();
        this.reconnect();
      };
      this.ws.onerror = (err) => {
        Log.log("ws --> onerror...", err);
        this.onerror();
        this.reconnect();
      };
      this.ws.onopen = () => {
        Log.log("ws --> onopen...");
        if (!this.hasAddEvent) {
          this.hasAddEvent = true;
          cc.game.on(cc.game.EVENT_SHOW, this.applocationShow, this);
          cc.game.on(cc.game.EVENT_HIDE, this.applocationHide, this);
        }
        this.repeat = 0;
        this.onopen();
        //心跳检测重置
        this.heartCheck();
      };
      this.ws.onmessage = (event) => {
        this.onmessage(event);
        //如果获取到消息，心跳检测重置
        //拿到任何消息都说明当前连接是正常的
        // this.heartCheck();
      };
    }
  };

  reconnect = function () {
    if (this.ws && this.ws.readyState == this.ws.OPEN) {
      Log.log("reconnect--------重复连接");
      return;
    }

    if (this.opts.repeatLimit > 0 && this.opts.repeatLimit <= this.repeat)
      return; //limit repeat the number
    if (this.lockReconnect || this.forbidReconnect) return;
    this.lockReconnect = true;
    this.repeat++; //必须在lockReconnect之后，避免进行无效计数
    this.onreconnect();
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(() => {
      this.createWebSocket();
      this.lockReconnect = false;
    }, this.opts.reconnectTimeout);
  };

  send = function (msg) {
    if (this.ws && this.ws.readyState == this.ws.OPEN) {
      if (this.isWx) {
        this.ws.send({
          data: msg,
          success: function () {},
        });
      } else {
        this.ws.send(msg);
      }
    } else {
      Log.log("发送失败:", JSON.stringify(msg));
    }
  };

  //心跳检测
  heartCheck = function () {
    this.heartReset();
    this.heartStart();
  };

  heartStart = function () {
    if (this.forbidReconnect) return; //不再重连就不再执行心跳
    this.pingTimeoutId = setTimeout(() => {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      this.ws.send(this.opts.pingMsg);
      //如果超过一定时间还没重置，说明后端主动断开了
      this.pongTimeoutId = setTimeout(() => {
        //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        this.ws.close();

        this.onreconnect();
      }, this.opts.pongTimeout);
    }, this.opts.pingTimeout);
  };

  heartReset = function () {
    // clearTimeout(this.pingTimeoutId);
    clearTimeout(this.pongTimeoutId);
  };

  close = function () {
    //如果手动关闭连接，不再重连
    Log.log("主动断开 ws");
    this.forbidReconnect = true;
    this.heartReset();
    this.ws.close();
  };
}
