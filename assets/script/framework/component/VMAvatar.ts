import VMBase from './VMBase';
import UIHelp from '../ui/UIHelp';
import { Log } from '../../utils/Log';

const { ccclass, property, menu, executeInEditMode,help } = cc._decorator;

enum AVATAR_TYPE {
    URL,
    LOCAL
}

/**
 *  [VM-Avatar]
 *  加载头像,网络or本地
 */
@ccclass
@executeInEditMode
@menu('ModelViewer/VM-Avatar(网络or本地头像)')
export default class VMAvatar extends VMBase {
    @property()
    watchPath: string = "";

    @property({
        type:cc.Enum(AVATAR_TYPE),
        tooltip: "网络or本地"
    })
    avatarTpye:AVATAR_TYPE = AVATAR_TYPE.URL;

    @property({
        type: cc.SpriteAtlas,
        tooltip: '本地图片图集',
        visible:function(){return this.avatarTpye == AVATAR_TYPE.LOCAL}
    })
    dAtlas:cc.SpriteAtlas = null;

    onLoad() {
        super.onLoad();
    }

    start(){
        if (CC_EDITOR) return;
        this.onValueInit();
    }

    /**初始化获取数据 */
    onValueInit() {
        Log.log("avatar onValueInit");
        this.setSpriteImage(this.VM.getValue(this.watchPath));
    }

    /**监听数据发生了变动的情况 */
    onValueChanged(n, o, pathArr: string[]) {
        this.setSpriteImage(n);
    }

    setSpriteImage(value) {
        if(this.avatarTpye == AVATAR_TYPE.LOCAL){
            if(this.dAtlas){
                UIHelp.SetSpriteFrame(this.node, this.dAtlas, value);
            }else{
                Log.error("没有绑定头像图集");
            }
        }else{
            UIHelp.SetSpriteFrame(this.node, value);
        }
    }
}
