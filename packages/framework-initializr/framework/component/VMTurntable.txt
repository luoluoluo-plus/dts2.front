import UIBase from "../ui/UIBase";
import { Utils } from "../../utils/Utils";

const { ccclass, property, menu, executeInEditMode, help } = cc._decorator;

/**
 *  [VM-Turntable]
 *  调用VMTurntable.instance.roll();
 *  转盘转动过程中自动生成屏蔽层，结束后删除屏蔽层
 */
@ccclass
// @executeInEditMode
@menu('ModelViewer/VM-Turntable(转盘动画)')
// @help('https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/VMLogin.md')
export default class VMTurntable extends UIBase {
    @property({ type: cc.Node, displayName: "需要转动的node" })
    nodeRoll: cc.Node = null;

    @property({ type: cc.Integer, displayName: "转盘拆分份数" })
    scores: number = 8;

    @property({ type: cc.Integer, displayName: "偏移份数", tooltip: "结果显示顺时针增加相应份数" })
    skew: number = 0;

    @property({ type: cc.Integer, displayName: "转过最少圈数" })
    qMin: number = 4;

    @property({ type: cc.Integer, displayName: "转过最多圈数" })
    qMax: number = 8;

    @property({ type: cc.Integer, displayName: "延迟回掉x秒" })
    delayTiem: number = 0;

    @property({displayName: "所停位置是否有偏移浮动", tooltip: "指针所停位置离奖区是否有偏移浮动" })
    hasOffset: Boolean = false;

    public static instance: VMTurntable;

    onUILoad() {
        VMTurntable.instance = this;
    }

    onShow() {
    }

    onStart() {
    }

    /**
     * 
     * @param type 要停止的份数（1-总份数）
     * @param callback 转盘停止后的回掉
     */
    roll(type: number, callback?: Function) {
        var _modelNode: cc.Node = new cc.Node("xxx");
		_modelNode.anchorX = 0;
		_modelNode.anchorY = 0;
        _modelNode.width = cc.winSize.width;
        _modelNode.height = cc.winSize.height;
        _modelNode.addComponent(cc.BlockInputEvents);
		_modelNode.parent = cc.director.getScene();
		_modelNode.zIndex = 888;

        var totalRotate = this.getRotationLong(type);//获取总长度
        this.nodeRoll.rotation = 0;

        cc.tween(this.nodeRoll)
        .to(4, {angle: -totalRotate}, {easing: 'expoOut'})
        .delay(this.delayTiem)
        .call(function () {
            _modelNode.destroy();
            callback && callback();
        }.bind(this))
        .start();
    }

    /**
     * 总的旋转角度
     * @param awardPosition 奖品所在奖区
     * @return 总的旋转角度
     */
    private getRotationLong(awardPosition: number): number {
        var _q: number = 360 * (Math.floor(Math.random() * (this.qMax - this.qMin)) + this.qMin);//整圈长度
        var _Skew: number = -(360 / this.scores) * this.skew;//第一个奖区起始点与0点位置的偏移比例
        var _location: number = (360 / this.scores) * (this.scores - awardPosition + 1);//目标奖区的起始点
        var _offset = Utils.random(0, 360 / this.scores) / 2 * (Utils.random(0, 2) == 1 ? 1 : -1);

        if(this.hasOffset){
            return _q + _Skew + _location + _offset;
        }else{
            return _q + _Skew + _location;
        }
    }
}
