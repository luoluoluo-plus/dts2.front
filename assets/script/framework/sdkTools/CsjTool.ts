import { Log } from "../../utils/Log";

export class CsjPlugin {
    private static isAndroid = cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID;
    private static isIOS = cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS;
    //修改极光推送别名，方便后端在后台进行集体推送
    public static setOtherName(uid){
        if (this.isAndroid) {
            jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/AppActivity",
                "registId",
                "(Ljava/lang/String;I)V",
                uid,Date.now());
        } else if (this.isIOS) {
            jsb.reflection.callStaticMethod("AppController", "setJPushAlias:",uid);
        }else{
            Log.error("只有android和IOS有极光")
        }
    }
}
cc["CsjPlugin"] = CsjPlugin;