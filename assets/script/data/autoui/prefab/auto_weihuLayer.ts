const {ccclass} = cc._decorator;

@ccclass
export default class auto_weihuLayer extends cc.Component {
	weihuLayer: cc.Node;
	model: cc.Node;
	font_title: cc.Node;

	public static URL:string = "db://assets/resources/prefab/weihuLayer.prefab"

    onLoad () {
		this.weihuLayer = this.node
		this.model = this.weihuLayer.getChildByName("model");
		this.font_title = this.weihuLayer.getChildByName("font_title");

    }
}
