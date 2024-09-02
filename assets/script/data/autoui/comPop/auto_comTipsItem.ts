const {ccclass} = cc._decorator;

@ccclass
export default class auto_comTipsItem extends cc.Component {
	comTipsItem: cc.Node;
	TipsBg: cc.Node;
	lab_des: cc.Node;

	public static URL:string = "db://assets/resources/prefab/comPop/comTipsItem.prefab"

    onLoad () {
		this.comTipsItem = this.node
		this.TipsBg = this.comTipsItem.getChildByName("TipsBg");
		this.lab_des = this.TipsBg.getChildByName("lab_des");

    }
}
