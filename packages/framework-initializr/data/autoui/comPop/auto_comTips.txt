const {ccclass} = cc._decorator;

@ccclass
export default class auto_comTips extends cc.Component {
	comTips: cc.Node;

	public static URL:string = "db://assets/resources/prefab/comPop/comTips.prefab"

    onLoad () {
		this.comTips = this.node

    }
}
