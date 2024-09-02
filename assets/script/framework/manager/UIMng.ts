import UIBase, { UIClass } from "../ui/UIBase";
import { ViewZorder } from "../const/ViewZorder";
import { Log } from "../../utils/Log";
import UIComTips from "../../logic/ui/comPop/UIComTips";

export class UIMng {
    private static instance: UIMng;

    private uiList: UIBase[] = [];
    private comTips: UIBase = null;

    public static getInstance(): UIMng {
        if (this.instance == null) {
            this.instance = new UIMng();
        }
        return this.instance;
    }

    private constructor() {

    }

    /**
     * 打开UI
     * @param uiClass 
     * @param zOrder 
     * @param callback 打开完毕回调函数
     * @param onProgress 打开过程进度函数
     * @param args 传入到UI的参数
     */
    public openUI<T extends UIBase>(uiClass: UIClass<T>, zOrder: number = ViewZorder.UI, callback?: Function, onProgress?: Function, ...args: any[]) {
        if (this.getUI(uiClass)) {
            Log.error(`UIMng OpenUI 1: ui ${uiClass.getName()} is already exist, please check`);
            return;
        }
        cc.loader.loadRes(uiClass.getUrl(), (completedCount: number, totalCount: number, item: any) => {
            onProgress && onProgress(completedCount, totalCount, item);
        }, (error, prefab) => {
            if (error) {
                Log.error(`UIMng OpenUI: load ui error: ${error}`);
                return;
            }
            if (this.getUI(uiClass)) {
                Log.error(`UIMng OpenUI 2: ui ${uiClass.getName()} is already exist, please check`);
                return;
            }

            let uiNode: cc.Node = cc.instantiate(prefab);
            let ui = uiNode.getComponent(uiClass) as UIBase;
            if (!ui) {
                Log.error(`${uiClass.getUrl()}没有绑定UI脚本!!!`);
                return;
            }
            ui.init(args);
            // let uiRoot = cc.director.getScene().getChildByName('UIRoot');
            let uiRoot = cc.director.getScene();
            if (!uiRoot) {
                Log.error(`当前场景${cc.director.getScene().name}Canvas!!!`);
                return;
            }
            uiNode.parent = uiRoot;
            uiNode.zIndex = zOrder;

            if(zOrder == ViewZorder.UI){
                this.hideAllUI();
            }
            if(uiNode.getComponent(UIComTips)){
                this.comTips = ui;
            }else{
                this.uiList.push(ui);
            }
            // this.uiList.push(ui);
            ui.tags = uiClass;

            callback && callback(ui);
        });
    }


    /**
     * 清除依赖资源
     * @param prefabUrl 
     */
    private clearDependsRes(prefabUrl) {
        let deps = cc.loader.getDependsRecursively(prefabUrl);
        // Log.log(`UIMng clearDependsRes: release ${prefabUrl} depends resources `, deps);
        deps.forEach((item) => {
            // todo：排除公共资源，然后清理
            // if (item.indexOf('common') === -1) {
            //     cc.loader.release(item);
            // }
        });
    }

    public closeUI<T extends UIBase>(uiClass: UIClass<T>) {
        for (let i = 0; i < this.uiList.length; ++i) {
            if (this.uiList[i].tags === uiClass) {
                var isUI = this.uiList[i].node.zIndex == ViewZorder.UI
                if (cc.isValid(this.uiList[i].node)) {
                    this.uiList[i].node.destroy();
                    this.clearDependsRes(uiClass.getUrl());
                }
                this.uiList.splice(i, 1);
                if(isUI && this.uiList.length && this.uiList[this.uiList.length-1].node.zIndex == ViewZorder.UI){
                    this.uiList[this.uiList.length-1].node.active = true;
                }
                
                return;
            }
        }
    }

    public closeAllUI() {
        if (this.uiList.length == 0) {
            return;
        }
        this.closeUI(this.uiList[0].tags);
        while (this.uiList.length > 0) {
            this.closeUI(this.uiList[0].tags);
        }
    }

    public hideAllUI() {
        if (this.uiList.length == 0) {
            return;
        }

        for (let i = 0; i < this.uiList.length; ++i) {
            if (cc.isValid(this.uiList[i].node) && this.uiList[i].node.zIndex == ViewZorder.UI) {
                this.uiList[i].node.active = false;
            }
        }
    }

    public showUI<T extends UIBase>(uiClass: UIClass<T>, callback?: Function) {
        let ui = this.getUI(uiClass);
        if (!ui) {
            Log.error(`UIMng showUI: ui ${uiClass.getName()} not exist`);
            return;
        }
        ui.node.active = true;
    }

    public hideUI<T extends UIBase>(uiClass: UIClass<T>) {
        let ui = this.getUI(uiClass);
        if (ui) {
            ui.node.active = false;
        }
    }

    public getUI<T extends UIBase>(uiClass: UIClass<T>): UIBase {
        if(uiClass.getName() == "UIComTips" && this.comTips?.node?.parent){
            return this.comTips;
        }else{
            for (let i = 0; i < this.uiList.length; ++i) {
                if (this.uiList[i].tags === uiClass) {
                    return this.uiList[i];
                }
            }
        }
        
        return null;
    }

    public isShowing<T extends UIBase>(uiClass: UIClass<T>) {
        let ui = this.getUI(uiClass);
        if (!ui) {
            return false;
        }
        return ui.node.active;
    }
}