import { Log } from "../../utils/Log";
import EventMng from "../manager/EventMng";


const { ccclass, menu, property } = cc._decorator;
/**
 *  [VM-ListViewCtrl]
 * 将该组件绑定到scrollView上
 * 竖屏滑块，content不需要添加layout，可显示无限条数据
 * 获取到数据后调用initialize渲染
 * 小预置体需要有initUI方法，供该组件调用刷新数据
 */
@ccclass
@menu("ModelViewer/VM-ListViewCtrl(竖滑块)")
export default class VMListViewCtrl extends cc.Component {
	@property(cc.Prefab)
	itemTemplate: cc.Prefab = null;
	@property(cc.ScrollView)
	scrollView: cc.ScrollView = null;
	@property(cc.Integer)
	spawnCount: number = 20; // how many items we actually spawn
	@property(cc.Integer)
	spacing: number = 10;    // space between each item
	@property(cc.Integer)
	bufferZone: number = 1600; // when item is away from bufferZone, we relocate it

	private content: cc.Node;
	private items: Array<any> = [];	// array to store spawned items
	private updateTimer: number = 0;
	private updateInterval: number = 0.2;
	private lastContentPosY: number = 0;	// use this variable to detect if we are scrolling up or down
	private dataList: Array<any> = [];	//后台返回数据
	private totalCount: number;
	private itemTemplateName: string;	//item预制件脚本名字
    private _spawnCount: number;

	onEnable(){
        this._spawnCount = this.spawnCount;
	}

	onDestroy(){
	}

	onLoad() {
    	this.content = this.scrollView.content;
		this.itemTemplateName  = this.itemTemplate.name.replace(this.itemTemplate.name[0], `UI${this.itemTemplate.name[0].toUpperCase()}`)
	}

    //初始话滑块
	initialize(dataList: Array<any>){
		this.dataList = dataList;
		this.totalCount = dataList.length;

		this._spawnCount = Math.min(this.totalCount, this._spawnCount);
        this.content.removeAllChildren();
        this.items = [];

        this.content.height = this.totalCount * (this.itemTemplate.data.height + this.spacing) + this.spacing; // get total content height
		for (let i = 0; i < this._spawnCount; ++i) { // spawn items, we only need to do this once
    		let item = cc.instantiate(this.itemTemplate);
    		this.content.addChild(item);
			item["itemID"] = i;
			item.x = 0;
    		item.y = -item.height * (0.5 + i) - this.spacing * (i + 1);

    		item.getComponent(this.itemTemplateName).initUI(dataList[i]);
            this.items.push(item);
    	}
    }

	getPositionInView(item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    }

	update(dt: number) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        let items = this.items;
        let buffer = this.bufferZone;
        let isDown = this.scrollView.content.y < this.lastContentPosY; // scrolling direction
        let offset = (this.itemTemplate.data.height + this.spacing) * items.length;
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                // if away from buffer zone and not reaching top of content
                if (viewPos.y < -buffer && items[i].y + offset < 0) {
                    items[i].y = items[i].y + offset;
                    let item = items[i].getComponent(this.itemTemplateName);
                    let itemId = items[i].itemID - items.length;
                    items[i].itemID = itemId
                    item.initUI(this.dataList[itemId]);
                }
            } else {
                // if away from buffer zone and not reaching bottom of content
                if (viewPos.y > buffer && items[i].y - offset > -this.content.height) {
                    items[i].y = items[i].y - offset;
                    let item = items[i].getComponent(this.itemTemplateName);
                    let itemId = items[i].itemID + items.length;
                    items[i].itemID = itemId
                    item.initUI(this.dataList[itemId]);
                }
            }
        }
        // update lastContentPosY
        this.lastContentPosY = this.scrollView.content.y;
    }

	scrollEvent(sender, event) {
        switch(event) {
            case 0: 
                Log.log("Scroll to Top"); 
                break;
            case 1: 
                Log.log("Scroll to Bottom"); 
                break;
            case 2: 
                Log.log("Scroll to Left"); 
                break;
            case 3: 
                Log.log("Scroll to Right"); 
                break;
            case 4: 
                Log.log("Scrolling"); 
                break;
            case 5: 
                Log.log("Bounce Top"); 
                break;
            case 6: 
                Log.log("Bounce bottom"); 
                break;
            case 7: 
                Log.log("Bounce left"); 
                break;
            case 8: 
                Log.log("Bounce right"); 
                break;
            case 9: 
                Log.log("Auto scroll ended"); 
                break;
        }
    }

	addItem() {
        this.content.height = (this.totalCount + 1) * (this.itemTemplate.data.height + this.spacing) + this.spacing; // get total content height
        this.totalCount = this.totalCount + 1;
    }

    removeItem() {
        if (this.totalCount - 1 < 30) {
            cc.error("can't remove item less than 30!");
            return;
        }

        this.content.height = (this.totalCount - 1) * (this.itemTemplate.data.height + this.spacing) + this.spacing; // get total content height
        this.totalCount = this.totalCount - 1;

        this.moveBottomItemToTop();
    }

	moveBottomItemToTop () {
        let offset = (this.itemTemplate.data.height + this.spacing) * this.items.length;
        let length = this.items.length;
        let item = this.getItemAtBottom();

        // whether need to move to top
        if (item.y + offset < 0) {
            item.y = item.y + offset;
            let itemComp = item.getComponent('Item');
            let itemId = itemComp.itemID - length;
            itemComp.updateItem(itemId);
        }
    }

    getItemAtBottom () {
        let item = this.items[0];
        for (let i = 1; i < this.items.length; ++i) {
            if (item.y > this.items[i].y) {
                item = this.items[i];
            }
        }
        return item;
    }

    scrollToFixedPosition() {
        this.scrollView.scrollToOffset(cc.v2(0, 500), 2);
    }
}