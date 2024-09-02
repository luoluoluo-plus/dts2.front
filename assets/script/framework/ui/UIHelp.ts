import {UIMng} from "../manager/UIMng";
import UIBase, { UIClass } from "./UIBase";
import { ViewZorder } from "../const/ViewZorder";
import UIComDialog from "../../logic/ui/comPop/UIComDialog";
import UIComTips from "../../logic/ui/comPop/UIComTips";
import { i18nMgr } from "../i18n/i18nMgr";
import { Log } from "../../utils/Log";
import { Utils } from "../../utils/Utils";

/**确定框界面参数 */
export interface DialogParams {
    title: string,
    content: string,
    certainCb?: Function,
    cancelCb?: Function
}

export default class UIHelp {
    public static SetLabel(node: cc.Node, ...params: any[]) {
        var value = params[0];

        if (typeof value === 'number') {
            value = value.toString();
        } else if (value == undefined) {
            value = "";
        }

        // 文本和富文本只能二选一
        if (node.getComponent(cc.RichText)) {
            let defaultColor = node.color.toHEX('#rrggbb');
            node.getComponent(cc.RichText).string = `<color=${defaultColor}>${value}</c>`;
        } else {
            if (node.getComponent("i18nLabel")) {
                node.getComponent("i18nLabel").init(...params);
            } else {
                var strList = value.split("|")
                if (i18nMgr.getlanguage() == "zh") {
                    node.getComponent(cc.Label).string = strList[0];
                } else {
                    node.getComponent(cc.Label).string = strList[2] || strList[0];
                }
            }
        }
    }

    public static numToStr(num: number) {
        //空：无单位;     K：1千；        M：100万；    B：10亿； T：1兆；        AA：1千兆；      AB：1京；
        var digits = 0;
        var si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "k" },
            { value: 1E6, symbol: "m" },
            { value: 1E9, symbol: "b" },
            { value: 1E12, symbol: "t" },
            { value: 1E15, symbol: "aa" },
            { value: 1E18, symbol: "ab" }
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value * 100) {
                break;
            }
        }

        var _num = (num / si[i].value);

        if (_num > 10000) {
            digits = 0;
        } else if (_num > 1000) {
            digits = 1;
        } else if (_num > 100) {
            digits = 2;
        }

        return _num.toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }

    public static numToStr2(num: number) {
        //空：无单位;     K：1千；        M：100万；    B：10亿； T：1兆；        AA：1千兆；      AB：1京；
        var digits = 0;
        var si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "K" },
            { value: 1E6, symbol: "M" },
            { value: 1E9, symbol: "B" },
            { value: 1E12, symbol: "T" },
            { value: 1E15, symbol: "AA" },
            { value: 1E18, symbol: "AB" }
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value * 0.1) {
                break;
            }
        }

        var _num = (num / si[i].value);

        // if(_num > 10000){
        //     digits = 0;
        // }else if(_num > 1000){
        digits = 1;
        // }else if(_num > 100){
        //     digits = 2;
        // }

        return _num.toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }

    //数字转2位小数
    public static fixedTo2(a: number): string {
        var b = String(a);
        var bNew;
        var re = /([0-9]+.[0-9]{2})[0-9]*/;
        bNew = b.replace(re, "$1");

        return bNew
    }

    public static SetLabelColor(node: cc.Node, color: cc.Color) {
        node.getComponent(cc.Label).node.color = color;
    }

    public static GetEditBoxStr(node: cc.Node) {
        return node.getComponent(cc.EditBox).string;
    }

    public static SetProgressBar(node: cc.Node, progress: number) {
        if (typeof progress != 'number') {
            return Log.log("参数错误");
        }

        node.getComponent(cc.ProgressBar).progress = progress;
    }
    //进度条根据图片填充
    public static SetSpriteRange(node: cc.Node, progress: number) {
        if (typeof progress != 'number') {
            return Log.log("参数错误");
        }

        node.getComponent(cc.Sprite).fillRange = progress;
    }

    public static CreateSprite(spriteFrame) {
        //创建一个新的节点，因为cc.Sprite是组件不能直接挂载到节点上，只能添加到为节点的一个组件
        var node = new cc.Node('myNode')
        //调用新建的node的addComponent函数，会返回一个sprite的对象
        const sprite = node.addComponent(cc.Sprite)
        //给sprite的spriteFrame属性 赋值
        sprite.spriteFrame = spriteFrame

        return node;
    }

    public static SetSpriteFrame(node: cc.Node, dAtlas: cc.SpriteAtlas | string, imgPath: string = "") {
        if (!dAtlas) {
            return
        }

        if (typeof dAtlas === 'string') {
            if(dAtlas.indexOf("http") >= 0){
                if (dAtlas.slice(dAtlas.length - 4) == ".png") {
                    cc.loader.load(dAtlas, function (err, texture) {
                        if (!err) {
                            var frame = new cc.SpriteFrame(texture);
                            if (node.isValid) {
                                node.getComponent(cc.Sprite).spriteFrame = frame;
                            }
                        } else {
                            Log.log("加载头像失败");
                        }
                    });
                } else {
                    cc.loader.load({ url: dAtlas, type: 'png' }, function (err, texture) {
                        if (!err) {
                            var frame = new cc.SpriteFrame(texture);
                            if(node.isValid){
                                node.getComponent(cc.Sprite).spriteFrame = frame;
                            }
                        } else {
                            Log.log("加载头像失败");
                        }
                    });
                }
            }else{
                cc.resources.load(dAtlas, cc.Texture2D, (err, texture: any) => {
                    var frame = new cc.SpriteFrame(texture);
                    if(node.isValid){
                        node.getComponent(cc.Sprite).spriteFrame = frame;
                    }
                });
            }
        } else {
            let framec = dAtlas.getSpriteFrame(imgPath);
            if(node.isValid){
                node.getComponent(cc.Sprite).spriteFrame = framec;
            }
        }
    }

    /**按钮灰化，只有注册click事件，才会真正被禁用 */
    public static SetBtnGrayState(node: cc.Node, isGray) {
        let button = node.getComponent(cc.Button);
        if (!button) {
            return;
        }
        button.interactable = !isGray;
        // button.enableAutoGrayEffect = isGray;
    }

    public static IsBtnGray(node: cc.Node) {
        let button = node.getComponent(cc.Button);
        if (!button) {
            return false;
        }
        return !button.interactable;
    }

    public static ShowUI<T extends UIBase>(uiClass: UIClass<T>, callback?: Function, ...args: any[]) {
        UIMng.getInstance().openUI(uiClass, ViewZorder.UI, callback, null, ...args);
    }

    public static ShowScene<T extends UIBase>(uiClass: UIClass<T>, callback?: Function, ...args: any[]) {
        UIMng.getInstance().openUI(uiClass, ViewZorder.Scene, callback, null, ...args);
    }

    public static ShowMenu<T extends UIBase>(uiClass: UIClass<T>, callback?: Function, ...args: any[]) {
        UIMng.getInstance().openUI(uiClass, ViewZorder.MenuPanel, callback, null, ...args);
    }

    public static ShowLoding() {
        // cc.find("loding").getComponent("UILoading").showLoding();
    }

    public static CloseLoding() {
        // cc.find("loding").getComponent("UILoading").hideLoding();
    }

    public static CloseUI<T extends UIBase>(uiClass: UIClass<T>) {
        UIMng.getInstance().closeUI(uiClass);
    }

    public static IsShowingUI<T extends UIBase>(uiClass: UIClass<T>) {
        return UIMng.getInstance().isShowing(uiClass);
    }

    public static ShowTips(message: string, ...param: any[]) {
        let tipUI = UIMng.getInstance().getUI(UIComTips) as UIComTips;
        if (!tipUI) {
            UIMng.getInstance().openUI(UIComTips, ViewZorder.Tips, (ui) => {
                UIHelp.ShowTips(message);
            });
        } else {
            tipUI.showTip(message);
        }
    }

    public static ShowDialog(data: DialogParams) {
        UIMng.getInstance().openUI(UIComDialog, ViewZorder.Dialog, null, null, data);
    }

    /**
     * 得到一个节点的世界坐标
     * node的原点在中心
     * @param {*} node 
     */
    public static localConvertWorldPointAR(node: cc.Node) {
        if (node) {
            return node.convertToWorldSpaceAR(cc.v2(0, 0));
        }
        return null;
    }

    /**
     * 把一个世界坐标的点，转换到某个节点下的坐标
     * 原点在node中心
     * @param {*} node 
     * @param {*} worldPoint 
     */
    public static worldConvertLocalPointAR(node: cc.Node, worldPoint) {
        if (node) {
            return node.convertToNodeSpaceAR(worldPoint);
        }
        return null;
    }

    /**
     *  * 把一个节点的本地坐标转到另一个节点的本地坐标下
     * @param {*} node 
     * @param {*} targetNode 
     */
    public static convetOtherNodeSpaceAR(node: cc.Node, targetNode: cc.Node) {
        if (!node || !targetNode) {
            return null;
        }
        //先转成世界坐标
        let worldPoint = this.localConvertWorldPointAR(node);
        return this.worldConvertLocalPointAR(targetNode, worldPoint);
    }

    /**
     * 计算两点之间的距离
     * @param p1 坐标1
     * @param p2 坐标2
     */
    public static getTwoPointDistance(p1: cc.Vec2, p2: cc.Vec2) {
        var distance = p1.sub(p2).mag()

        return distance
    }

    /**
     * 
     * @param node 需要添加动画的节点
     * @param aniName 动画文件名字
     * @param animation 播放某个动画的名字,默认是animation，可传可不传
     * @param type 1:sp, 2:龙骨
     */
    public static addAni(node: cc.Node, aniName: string, animation: string = "animation", type: number = 1) {
        if (type == 1) {
            //skeleton
            cc.loader.loadRes("spine/" + aniName, sp.SkeletonData, function (err, res) {
                if (err) {
                    Log.error('资源加载失败')
                    return;
                }

                if (node.getComponent(sp.Skeleton)) {
                    var skeleton = node.getComponent(sp.Skeleton);
                } else {
                    var skeleton = node.addComponent(sp.Skeleton);
                }

                skeleton.skeletonData = res;
                skeleton.animation = animation;
                skeleton.enableBatch = true;
            })
        } else {
            //dragonBones
            cc.loader.loadRes("spine/" + aniName, dragonBones.DragonBonesAsset, function (err, res) {
                if (err) {
                    Log.error('资源加载失败')
                    return;
                }

                if (node.getComponent(dragonBones.ArmatureDisplay)) {
                    var _dragonBones = node.getComponent(dragonBones.ArmatureDisplay)
                } else {
                    var _dragonBones = node.addComponent(dragonBones.ArmatureDisplay);
                }

                _dragonBones.dragonAsset = res;

                cc.loader.loadRes("spine/" + aniName.replace("_ske", "_tex"), dragonBones.DragonBonesAtlasAsset, function (err, dragonAtlasAsset) {
                    if (err) {
                        Log.error('资源加载_tex失败')
                        return;
                    }

                    _dragonBones.dragonAtlasAsset = dragonAtlasAsset;
                    _dragonBones.armatureName = "Armature";
                    _dragonBones.playAnimation(animation, 0)
                })
            })
        }
    }
    
    /**参数说明：
     * 根据长度截取先使用字符串，超长部分追加…
     * str 对象字符串
     * len 目标字节长度
     * 返回值： 处理结果字符串
     */
    public static cutString(str, len, jiadian = true) {
        //length属性读出来的汉字长度为1
        if (str.length * 2 <= len) {
            return str;
        }
        var strlen = 0;
        var s = "";
        for (var i = 0; i < str.length; i++) {
            s = s + str.charAt(i);
            if (str.charCodeAt(i) > 128) {
                strlen = strlen + 2;
                if (strlen >= len) {
                    if(jiadian){
                        return s.substring(0, s.length - 1) + "...";
                    }else{
                        return s.substring(0, s.length - 1) + "";
                    }
                }
            } else {
                strlen = strlen + 1;
                if (strlen >= len) {
                    if(jiadian){
                        return s.substring(0, s.length - 2) + "...";
                    }else{
                        return s.substring(0, s.length - 2) + "";
                    }
                }
            }
        }
        return s;
    }

    public static getRadomPos(node: cc.Node): cc.Vec2{
        var w = node.width;
        var h = node.height;
        var x = node.x;
        var y = node.y;
        var maxX = node.x + w/2;
        var minX = node.x - w/2;
        var maxY = node.y + h/2;
        var minY = node.y - h/2;
        return cc.v2(Utils.random(minX, maxX), Utils.random(minY, maxY));
    }
}