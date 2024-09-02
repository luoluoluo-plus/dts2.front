const {ccclass} = cc._decorator;

@ccclass
export default class auto_jiluItem4 extends cc.Component {
	jiluItem4: cc.Node;
	bg: cc.Node;
	fengexian1: cc.Node;
	font_1: cc.Node;
	font_2: cc.Node;
	lab_qi: cc.Node;
	lab_touru_name: cc.Node;
	lab_huode_name: cc.Node;
	lab_choose_room: cc.Node;
	lba_kill_room: cc.Node;
	lab_touru_num: cc.Node;
	lab_huode_num: cc.Node;
	lab_win: cc.Node;
	lab_lose: cc.Node;

	public static URL:string = "db://assets/resources/prefab/jiluItem4.prefab"

    onLoad () {
		this.jiluItem4 = this.node
		this.bg = this.jiluItem4.getChildByName("bg");
		this.fengexian1 = this.bg.getChildByName("fengexian1");
		this.font_1 = this.bg.getChildByName("font_1");
		this.font_2 = this.bg.getChildByName("font_2");
		this.lab_qi = this.bg.getChildByName("lab_qi");
		this.lab_touru_name = this.bg.getChildByName("lab_touru_name");
		this.lab_huode_name = this.bg.getChildByName("lab_huode_name");
		this.lab_choose_room = this.bg.getChildByName("lab_choose_room");
		this.lba_kill_room = this.bg.getChildByName("lba_kill_room");
		this.lab_touru_num = this.bg.getChildByName("lab_touru_num");
		this.lab_huode_num = this.bg.getChildByName("lab_huode_num");
		this.lab_win = this.bg.getChildByName("lab_win");
		this.lab_lose = this.bg.getChildByName("lab_lose");

    }
}
