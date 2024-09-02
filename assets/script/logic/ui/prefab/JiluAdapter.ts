import { Holder } from "../../../framework/adapter/abstract/Holder";
import { ScrollAdapter } from "../../../framework/adapter/abstract/ScrollAdapter";
import { View } from "../../../framework/adapter/abstract/View";
import { ReleaseState } from "../../../framework/adapter/define/enum";
import { IElement } from "../../../framework/adapter/define/interface";
import {
  ReleaseEvent,
  ReleaseManager,
} from "../../../framework/adapter/manager/ReleaseManager";
import GameDataCenter from "../../../userData/GameDataCenter";
import UIJiluItem1 from "./UIJiluItem1";
import UIJiluItem2 from "./UIJiluItem2";
import UIJiluItem3 from "./UIJiluItem3";
import UIJiluItem4 from "./UIJiluItem4";
import UIJiluItem5 from "./UIJiluItem5";

const { ccclass, menu, property } = cc._decorator;
export interface IChatModel {
  type: number;
  name: string;
  message: string;
}
@ccclass
@menu("UI/prefab/JiluAdapter")
export class JiluAdapter extends ScrollAdapter<IChatModel> {
  @property(cc.Prefab) prefab1: cc.Prefab = null;
  @property(cc.Prefab) prefab2: cc.Prefab = null;
  @property(cc.Prefab) prefab3: cc.Prefab = null;
  @property(cc.Prefab) prefab4: cc.Prefab = null;
  @property(cc.Prefab) prefab5: cc.Prefab = null;
  @property(cc.Node) header: cc.Node = null;
  @property(cc.Node) loading: cc.Node = null;
  private _headerTween: cc.Tween<any>;
  private _loadTween: cc.Tween<any>;
  private _isHeaderPlay = false;
  private page: number = 1;
  public getPrefab(data: IChatModel): cc.Prefab {
    if (data.type == 1) {
      return this.prefab1;
    } else if (data.type == 2) {
      return this.prefab2;
    } else if (data.type == 3) {
      return this.prefab3;
    } else if (data.type == 4) {
      return this.prefab4;
    } else {
      return this.prefab5;
    }
  }
  public getHolder(node: cc.Node, code: string): Holder<IChatModel> {
    return new myHolder(node, code, this);
  }
  public getView(): View<IChatModel> {
    return new myView(this);
  }
  public initElement(element: IElement, data: any): void {}

  async start() {
    this.releaseManager.on(
      ReleaseManager.Event.ON_PULL_UP,
      this.onPullDown,
      this
    );

    this._headerTween = new cc.Tween(this.header).to(
      0.518,
      {
        height: this.releaseManager.bottom * this.mainAxisSize,
      },
      { easing: "elasticOut" }
    );

    this._loadTween = new cc.Tween(this.loading)
      .by(1, {
        angle: -360,
      })
      .union()
      .repeatForever();

    GameDataCenter.accountModel.noMoreJilu = false;
    // 游戏记录
    var list1 = await GameDataCenter.accountModel.getBettingLog(1);
    // 100期
    var list2 = await GameDataCenter.accountModel.kill_room_statistics();
    // 10期
    var list4 = await GameDataCenter.accountModel.records();
    // 投入获得分析
    var list3 = await GameDataCenter.accountModel.game_record_statistic();
    // 10期
    console.log("records-", list1);
    console.log("kill_room_statistics-", list2);
    console.log("game_record_statistic-", list3);

    let arr = [list3, list2,list4, ...list1];
    this.modelManager.insert(arr);
    // var list2 = await GameDataCenter.accountModel.getBettingLog(1);
    // this.modelManager.insert(list2);

    // var list1 = await GameDataCenter.accountModel.getGameLog();
    // this.modelManager.insert(list1);
    // var list2 = await GameDataCenter.accountModel.getBettingLog(1);
    // this.modelManager.insert(list2);
  }

  async onPullDown(event: ReleaseEvent) {
    if (event.state == ReleaseState.RELEASE) {
      if (this._isHeaderPlay) {
        this._loadTween.start();
        // 等待并锁定头部
        event.wait();
        // 加载历史记录
        this.page += 1;
        var list = await GameDataCenter.accountModel.getBettingLog(this.page);
        // 插入数据
        this.modelManager.insert(list);
        // 释放解锁头部
        this.scheduleOnce(() => {
          event.release();
        });
        this._loadTween.stop();
      }
    }
    var progress = event.progress;
    if (event.state == ReleaseState.WAIT) {
      progress = 0.1;
    }
    if (progress >= 0.1) {
      if (!this._isHeaderPlay) {
        // this._headerTween = new cc.Tween(this.header).to(0.518, {
        //     height: this.releaseManager.bottom * this.mainAxisSize
        // }, { easing: "elasticOut" })
        this._headerTween.start();
        this._isHeaderPlay = true;
      }
    } else {
      this._headerTween.stop();
      this._isHeaderPlay = false;
      // this.header.height = event.offset
      // var opacity = 255 * Math.min(progress, 1)
      // this.loading.opacity = opacity;
      this.loading.opacity = 0;
    }
    this.loading.angle = -360 * event.progress;
  }

  scrollToHeader() {
    this.scrollManager.scrollToHeader(1);
  }
}

class myView extends View<IChatModel, JiluAdapter> {
  protected onVisible(): void {}
  protected onDisable(): void {}
}
class myHolder extends Holder<IChatModel, JiluAdapter> {
  private _chatItem:
    | UIJiluItem5
    | UIJiluItem4
    | UIJiluItem3
    | UIJiluItem2
    | UIJiluItem1 = null;
  protected onCreated(): void {
    this._chatItem =
      this.node.getComponent(UIJiluItem5) ||
      this.node.getComponent(UIJiluItem4) ||
      this.node.getComponent(UIJiluItem3) ||
      this.node.getComponent(UIJiluItem2) ||
      this.node.getComponent(UIJiluItem1);
  }
  protected onVisible(): void {
    this._chatItem.show(this);
  }
  protected onDisable(): void {
    this._chatItem.hide();
  }
}
