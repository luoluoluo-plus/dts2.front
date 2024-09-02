import { GameEvent } from '../../../userData/EventConst';
import GameDataCenter from '../../../userData/GameDataCenter';
import EventMng from '../../manager/EventMng';
import { ScrollAdapter } from '../abstract/ScrollAdapter';
import { IndicatorMode } from '../define/enum';
import { PageViewManager } from '../manager/PageViewManager';
const { ccclass, property } = cc._decorator;
/**
 * 简单Indicator示例
 * 如果你想要更多效果，请自行编写或扩展 Indicator
 */
@ccclass
export class Indicator extends cc.Component {
    @property(cc.Node) adapterNode: cc.Node = null
    @property(cc.Node) tabNode: cc.Node = null
    @property({
        type: [cc.Node],
    }) spriteNode: cc.Node[] = []
    @property({ type: IndicatorMode }) indicatorMode: IndicatorMode = IndicatorMode.Normal
    @property cellSize: cc.Size = new cc.Size(10, 10)
    @property spacing: number = 10
    private _indicators: cc.Node[] = []
    private _layout: cc.Layout = null
    private _color: cc.Color = new cc.Color()
    private adapter: ScrollAdapter = null;

    get layout() {
        if (this._layout == null) {
            this._layout = this.getComponent(cc.Layout) || this.addComponent(cc.Layout)
            if (this.adapter.isHorizontal) {
                this._layout.type = cc.Layout.Type.HORIZONTAL
                this._layout.spacingX = this.spacing
            } else {
                this._layout.type = cc.Layout.Type.VERTICAL
                this._layout.spacingY = this.spacing
            }
            this._layout.resizeMode = cc.Layout.ResizeMode.CONTAINER
        }
        return this._layout
    }
    protected __preload() {
        this.adapter = this.adapterNode.getComponent(ScrollAdapter);
        if (this.adapter) {
            this.adapter.pageViewManager.on(PageViewManager.Event.ON_PAGE_LENGTH_CHANGED, this._onPageLengthChanged, this)
            this.adapter.pageViewManager.on(PageViewManager.Event.ON_SCROLL_PAGE_END, this._onScrollPageEnd, this)
        }
    }

    private _onScrollPageEnd() {
        this.changedState()
    }
    private _onPageLengthChanged() {
        if (!this.adapter) return
        const indicators = this._indicators
        const length = this.adapter.viewManager.groupLength
        if (length === indicators.length) {
            return
        }
        let i = 0
        if (length > indicators.length) {
            for (i = 0; i < length; ++i) {
                if (!indicators[i]) {
                    indicators[i] = this._createIndicator(i)
                }
            }
        } else {
            const count = indicators.length - length
            for (i = count; i > 0; --i) {
                const transform = indicators[i - 1]
                this.node.removeChild(transform)
                indicators.splice(i - 1, 1)
            }
        }
        if (this.layout && this.layout.enabledInHierarchy) {
            this.layout.updateLayout()
        }
        this.changedState()
    }

    private _createIndicator(index: any) {
        const node = this.spriteNode[index];
        // node.layer = this.node.layer
        node.parent = this.node

        if (this.indicatorMode == IndicatorMode.Button) {
            var button = node.getComponent(cc.Button) || node.addComponent(cc.Button)
            var event = new cc.Component.EventHandler()
            event.component = "Indicator"
            event.handler = "_click"
            event.target = this.node
            event.customEventData = index
            button.clickEvents.push(event)
        }
        return node
    }
    private _click(event: any, data: any) {
        this.adapter.pageViewManager.scrollToPage(this.adapter.pageViewManager.pageTurningSpeed, data)
    }
    public changedState() {
        const indicators = this._indicators
        if (indicators.length === 0 || !this.adapter) return
        const idx = this.adapter.pageViewManager.currentIndex

        EventMng.emit(GameEvent.RANK_TAB_CHANGE, idx);
        if (idx >= indicators.length) return
        this.tabNode.stopAllActions();
        this.tabNode.runAction(cc.moveTo(0.1, cc.v2(indicators[idx].position.x, indicators[idx].position.y)));

        var account = GameDataCenter.accountModel;
        account.myRankNum = idx == 0 ? account.thisRankNum : account.lastRankNum;
        account.myRankNo = idx == 0 ? account.thisRankNo : account.lastRankNo;

        for (let i = 0; i < indicators.length; ++i) {
            const transform = indicators[i]
            if (transform.getChildByName("font")) {
                transform.getChildByName("font").color = cc.color(157, 136, 108);
                transform.getChildByName("font").getComponent(cc.LabelOutline).enabled = false;
            } else {
                transform.getChildByName("layout").getChildByName("font").color = cc.color(157, 136, 108);
                transform.getChildByName("layout").getChildByName("font").getComponent(cc.LabelOutline).enabled = false;
            }

            //// const comp = transform.getComponent(cc.Sprite)
            //// this._color.set(comp.color)
            //// this._color.a = 255 / 2
            //// comp.color = this._color
            // transform.opacity = 255 / 2
        }
        if (indicators[idx]) {
            const transform = indicators[idx]
            if (transform.getChildByName("font")) {
                transform.getChildByName("font").color = cc.color(255, 255, 255);
                transform.getChildByName("font").getComponent(cc.LabelOutline).enabled = true;
            } else {
                transform.getChildByName("layout").getChildByName("font").color = cc.color(255, 255, 255);
                transform.getChildByName("layout").getChildByName("font").getComponent(cc.LabelOutline).enabled = true;
            }
           
            // // const comp = indicators[idx].getComponent(Sprite)
            // // this._color.set(comp.color)
            // // this._color.a = 255
            // // comp.color = this._color
            // indicators[idx].opacity = 255
        }
    }
}

