import { GameEvent } from "../../userData/EventConst";
import { Log } from "../../utils/Log";
import EventMng from "../manager/EventMng";

export  class JSBridgeManager  {
    private static _instance:JSBridgeManager;
 
    static getInstance():JSBridgeManager{
        if(JSBridgeManager._instance == null){
            JSBridgeManager._instance = new JSBridgeManager()
        }
        return this._instance
    }

    constructor() {
        //注册可以供flutter调用的方法
        this.registerFunc("callBack", this.callFromFlutter);
    }
 
    /**
     * 注册可以供flutter调用的方法
     * @param method 注册的方法名称
     * @param func 注册的方法(example: function(params, responseCall) params:flutter返回的参数 responseCall:回传数据时调用)
     *  在回调中如果有对creator ui操作要用event事件派发,否则会操作失败
     */
    registerFunc(method: string, func: Function){
        if(window['jsBridge']){
            window['jsBridge'].registerFuncForFlutter(method, func);
        }else{
            document.addEventListener(
                "jsBridgeReady",
                 function() {
                    window['jsWebBridge'].registerFuncForFlutter(method, func);
                 },
                 false);
        }
    }

     /**
     * js调用flutter方法
     * @param method 方法名
     * @param params 参数
     * @param receiveCall 接收flutter返回的数据函数(在回调中如果有对creator ui操作的行为要用event事件派发)
     * 
     * example: JSBridgeManager.getInstance().callFlutterFunc('getCocosParams',{
                    data1:'xxx',
                    data2: 'xxxx'
                },()=>{
                    Log.log("********调用flutter成功********")
                })
     */
    callFlutterFunc(method:string, params?, receiveCall?:Function){
        if (window['jsBridge']){
            window['jsBridge'].callFlutterFunc(method, params, receiveCall)
        }
    }

    /**
     * flutter调用js方法,通过事件派发
     * @param params 
     * @param responseCall 
     */
    callFromFlutter(params, responseCall:Function){
        // EventMng.emit(GameEvent.CALL_FROM_FLUTTER, params, responseCall)
    }
}
