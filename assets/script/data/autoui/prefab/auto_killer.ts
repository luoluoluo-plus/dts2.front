const {ccclass} = cc._decorator;

@ccclass
export default class auto_killer extends cc.Component {
	killer: cc.Node;
	sp_killer: cc.Node;

	public static URL:string = "db://assets/resources/prefab/killer.prefab"

    onLoad () {
		this.killer = this.node
		this.sp_killer = this.killer.getChildByName("sp_killer");

    }
}
