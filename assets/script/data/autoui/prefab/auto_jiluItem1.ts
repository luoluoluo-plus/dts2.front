const {ccclass} = cc._decorator;

@ccclass
export default class auto_jiluItem1 extends cc.Component {
	jiluItem1: cc.Node;
	bg: cc.Node;
	room_name_1: cc.Node;
	room_name_2: cc.Node;
	room_name_3: cc.Node;
	room_name_4: cc.Node;
	room_name_5: cc.Node;
	room_name_6: cc.Node;
	room_name_7: cc.Node;
	room_name_8: cc.Node;
	gui_1: cc.Node;
	gui_2: cc.Node;
	gui_3: cc.Node;
	gui_4: cc.Node;
	gui_5: cc.Node;
	gui_6: cc.Node;
	gui_7: cc.Node;
	gui_8: cc.Node;
	node_labs: cc.Node;
	lab_name_num_1: cc.Node;
	lab_name_num_2: cc.Node;
	lab_name_num_3: cc.Node;
	lab_name_num_4: cc.Node;
	lab_name_num_5: cc.Node;
	lab_name_num_6: cc.Node;
	lab_name_num_7: cc.Node;
	lab_name_num_8: cc.Node;
	biaoti1: cc.Node;

	public static URL:string = "db://assets/resources/prefab/jiluItem1.prefab"

    onLoad () {
		this.jiluItem1 = this.node
		this.bg = this.jiluItem1.getChildByName("bg");
		this.room_name_1 = this.bg.getChildByName("room_name_1");
		this.room_name_2 = this.bg.getChildByName("room_name_2");
		this.room_name_3 = this.bg.getChildByName("room_name_3");
		this.room_name_4 = this.bg.getChildByName("room_name_4");
		this.room_name_5 = this.bg.getChildByName("room_name_5");
		this.room_name_6 = this.bg.getChildByName("room_name_6");
		this.room_name_7 = this.bg.getChildByName("room_name_7");
		this.room_name_8 = this.bg.getChildByName("room_name_8");
		this.gui_1 = this.bg.getChildByName("gui_1");
		this.gui_2 = this.bg.getChildByName("gui_2");
		this.gui_3 = this.bg.getChildByName("gui_3");
		this.gui_4 = this.bg.getChildByName("gui_4");
		this.gui_5 = this.bg.getChildByName("gui_5");
		this.gui_6 = this.bg.getChildByName("gui_6");
		this.gui_7 = this.bg.getChildByName("gui_7");
		this.gui_8 = this.bg.getChildByName("gui_8");
		this.node_labs = this.jiluItem1.getChildByName("node_labs");
		this.lab_name_num_1 = this.node_labs.getChildByName("lab_name_num_1");
		this.lab_name_num_2 = this.node_labs.getChildByName("lab_name_num_2");
		this.lab_name_num_3 = this.node_labs.getChildByName("lab_name_num_3");
		this.lab_name_num_4 = this.node_labs.getChildByName("lab_name_num_4");
		this.lab_name_num_5 = this.node_labs.getChildByName("lab_name_num_5");
		this.lab_name_num_6 = this.node_labs.getChildByName("lab_name_num_6");
		this.lab_name_num_7 = this.node_labs.getChildByName("lab_name_num_7");
		this.lab_name_num_8 = this.node_labs.getChildByName("lab_name_num_8");
		this.biaoti1 = this.jiluItem1.getChildByName("biaoti1");

    }
}
