const {ccclass} = cc._decorator;

@ccclass
export default class auto_jiluItem2 extends cc.Component {
	jiluItem2: cc.Node;
	bg: cc.Node;
	room_name_1: cc.Node;
	room_name_2: cc.Node;
	room_name_3: cc.Node;
	room_name_4: cc.Node;
	room_name_5: cc.Node;
	room_name_6: cc.Node;
	room_name_7: cc.Node;
	room_name_8: cc.Node;
	room_name_9: cc.Node;
	room_name_10: cc.Node;
	room_name_Lab1: cc.Node;
	room_name_Lab2: cc.Node;
	room_name_Lab3: cc.Node;
	room_name_Lab4: cc.Node;
	room_name_Lab5: cc.Node;
	room_name_Lab6: cc.Node;
	room_name_Lab7: cc.Node;
	room_name_Lab8: cc.Node;
	room_name_Lab9: cc.Node;
	room_name_Lab10: cc.Node;
	node_labs: cc.Node;
	lab_qi_1: cc.Node;
	lab_qi_2: cc.Node;
	lab_qi_3: cc.Node;
	lab_qi_4: cc.Node;
	lab_qi_5: cc.Node;
	lab_qi_6: cc.Node;
	lab_qi_7: cc.Node;
	lab_qi_8: cc.Node;
	lab_qi_9: cc.Node;
	lab_qi_10: cc.Node;
	biaoti1: cc.Node;

	public static URL:string = "db://assets/resources/prefab/jiluItem2.prefab"

    onLoad () {
		this.jiluItem2 = this.node
		this.bg = this.jiluItem2.getChildByName("bg");
		this.room_name_1 = this.bg.getChildByName("room_name_1");
		this.room_name_2 = this.bg.getChildByName("room_name_2");
		this.room_name_3 = this.bg.getChildByName("room_name_3");
		this.room_name_4 = this.bg.getChildByName("room_name_4");
		this.room_name_5 = this.bg.getChildByName("room_name_5");
		this.room_name_6 = this.bg.getChildByName("room_name_6");
		this.room_name_7 = this.bg.getChildByName("room_name_7");
		this.room_name_8 = this.bg.getChildByName("room_name_8");
		this.room_name_9 = this.bg.getChildByName("room_name_9");
		this.room_name_10 = this.bg.getChildByName("room_name_10");
		this.room_name_Lab1 = this.bg.getChildByName("room_name_Lab1");
		this.room_name_Lab2 = this.bg.getChildByName("room_name_Lab2");
		this.room_name_Lab3 = this.bg.getChildByName("room_name_Lab3");
		this.room_name_Lab4 = this.bg.getChildByName("room_name_Lab4");
		this.room_name_Lab5 = this.bg.getChildByName("room_name_Lab5");
		this.room_name_Lab6 = this.bg.getChildByName("room_name_Lab6");
		this.room_name_Lab7 = this.bg.getChildByName("room_name_Lab7");
		this.room_name_Lab8 = this.bg.getChildByName("room_name_Lab8");
		this.room_name_Lab9 = this.bg.getChildByName("room_name_Lab9");
		this.room_name_Lab10 = this.bg.getChildByName("room_name_Lab10");
		this.node_labs = this.jiluItem2.getChildByName("node_labs");
		this.lab_qi_1 = this.node_labs.getChildByName("lab_qi_1");
		this.lab_qi_2 = this.node_labs.getChildByName("lab_qi_2");
		this.lab_qi_3 = this.node_labs.getChildByName("lab_qi_3");
		this.lab_qi_4 = this.node_labs.getChildByName("lab_qi_4");
		this.lab_qi_5 = this.node_labs.getChildByName("lab_qi_5");
		this.lab_qi_6 = this.node_labs.getChildByName("lab_qi_6");
		this.lab_qi_7 = this.node_labs.getChildByName("lab_qi_7");
		this.lab_qi_8 = this.node_labs.getChildByName("lab_qi_8");
		this.lab_qi_9 = this.node_labs.getChildByName("lab_qi_9");
		this.lab_qi_10 = this.node_labs.getChildByName("lab_qi_10");
		this.biaoti1 = this.jiluItem2.getChildByName("biaoti1");

    }
}
