const {ccclass} = cc._decorator;

@ccclass
export default class auto_jiluItem5 extends cc.Component {
	jiluItem5: cc.Node;
	font_1: cc.Node;

	public static URL:string = "db://assets/resources/prefab/jiluItem5.prefab"

    onLoad () {
		this.jiluItem5 = this.node
		this.font_1 = this.jiluItem5.getChildByName("font_1");

    }
}
