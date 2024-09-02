const {ccclass} = cc._decorator;

@ccclass
export default class auto_choseRoomLayer extends cc.Component {
	choseRoomLayer: cc.Node;
	btn_close: cc.Node;
	layout: cc.Node;
	btn_1: cc.Node;
	node_room1_type1: cc.Node;
	houzi1: cc.Node;
	lab_min1: cc.Node;
	lab_max1: cc.Node;
	node_room1_type2: cc.Node;
	font_1: cc.Node;
	btn_2: cc.Node;
	node_room2_type1: cc.Node;
	houzi2: cc.Node;
	lab_min2: cc.Node;
	lab_max2: cc.Node;
	node_room2_type2: cc.Node;
	font_2: cc.Node;
	btn_3: cc.Node;
	node_room3_type1: cc.Node;
	houzi3: cc.Node;
	lab_min3: cc.Node;
	lab_max3: cc.Node;
	node_room3_type2: cc.Node;
	font_3: cc.Node;
	VM: cc.Node;
	font_title: cc.Node;

	public static URL:string = "db://assets/resources/prefab/choseRoomLayer.prefab"

    onLoad () {
		this.choseRoomLayer = this.node
		this.btn_close = this.choseRoomLayer.getChildByName("btn_close");
		this.layout = this.choseRoomLayer.getChildByName("layout");
		this.btn_1 = this.layout.getChildByName("btn_1");
		this.node_room1_type1 = this.btn_1.getChildByName("node_room1_type1");
		this.houzi1 = this.node_room1_type1.getChildByName("houzi1");
		this.lab_min1 = this.node_room1_type1.getChildByName("lab_min1");
		this.lab_max1 = this.node_room1_type1.getChildByName("lab_max1");
		this.node_room1_type2 = this.btn_1.getChildByName("node_room1_type2");
		this.font_1 = this.node_room1_type2.getChildByName("font_1");
		this.btn_2 = this.layout.getChildByName("btn_2");
		this.node_room2_type1 = this.btn_2.getChildByName("node_room2_type1");
		this.houzi2 = this.node_room2_type1.getChildByName("houzi2");
		this.lab_min2 = this.node_room2_type1.getChildByName("lab_min2");
		this.lab_max2 = this.node_room2_type1.getChildByName("lab_max2");
		this.node_room2_type2 = this.btn_2.getChildByName("node_room2_type2");
		this.font_2 = this.node_room2_type2.getChildByName("font_2");
		this.btn_3 = this.layout.getChildByName("btn_3");
		this.node_room3_type1 = this.btn_3.getChildByName("node_room3_type1");
		this.houzi3 = this.node_room3_type1.getChildByName("houzi3");
		this.lab_min3 = this.node_room3_type1.getChildByName("lab_min3");
		this.lab_max3 = this.node_room3_type1.getChildByName("lab_max3");
		this.node_room3_type2 = this.btn_3.getChildByName("node_room3_type2");
		this.font_3 = this.node_room3_type2.getChildByName("font_3");
		this.VM = this.choseRoomLayer.getChildByName("VM");
		this.font_title = this.choseRoomLayer.getChildByName("font_title");

    }
}
