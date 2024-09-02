const {ccclass} = cc._decorator;

@ccclass
export default class auto_jiluItem3 extends cc.Component {
	jiluItem3: cc.Node;
	bg: cc.Node;
	kuiang_1: cc.Node;
	kuiang_2: cc.Node;
	font_1: cc.Node;
	font_2: cc.Node;
	font_3: cc.Node;
	layout_1: cc.Node;
	coin_1_1: cc.Node;
	coin_1_2: cc.Node;
	coin_1_3: cc.Node;
	lab_touru_num: cc.Node;
	layout_2: cc.Node;
	coin_2_1: cc.Node;
	coin_2_2: cc.Node;
	coin_2_3: cc.Node;
	lab_huode_num: cc.Node;

	public static URL:string = "db://assets/resources/prefab/jiluItem3.prefab"

    onLoad () {
		this.jiluItem3 = this.node
		this.bg = this.jiluItem3.getChildByName("bg");
		this.kuiang_1 = this.bg.getChildByName("kuiang_1");
		this.kuiang_2 = this.bg.getChildByName("kuiang_2");
		this.font_1 = this.bg.getChildByName("font_1");
		this.font_2 = this.bg.getChildByName("font_2");
		this.font_3 = this.bg.getChildByName("font_3");
		this.layout_1 = this.bg.getChildByName("layout_1");
		this.coin_1_1 = this.layout_1.getChildByName("coin_1_1");
		this.coin_1_2 = this.layout_1.getChildByName("coin_1_2");
		this.coin_1_3 = this.layout_1.getChildByName("coin_1_3");
		this.lab_touru_num = this.layout_1.getChildByName("lab_touru_num");
		this.layout_2 = this.bg.getChildByName("layout_2");
		this.coin_2_1 = this.layout_2.getChildByName("coin_2_1");
		this.coin_2_2 = this.layout_2.getChildByName("coin_2_2");
		this.coin_2_3 = this.layout_2.getChildByName("coin_2_3");
		this.lab_huode_num = this.layout_2.getChildByName("lab_huode_num");

    }
}
