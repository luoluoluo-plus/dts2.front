const {ccclass} = cc._decorator;

@ccclass
export default class auto_jiluLayer extends cc.Component {
	jiluLayer: cc.Node;
	model: cc.Node;
	scrollView: cc.Node;
	view: cc.Node;
	content: cc.Node;
	header: cc.Node;
	Node_1: cc.Node;
	loading: cc.Node;
	btn_back: cc.Node;
	spr_back: cc.Node;

	public static URL:string = "db://assets/resources/prefab/jiluLayer.prefab"

    onLoad () {
		this.jiluLayer = this.node
		this.model = this.jiluLayer.getChildByName("model");
		this.scrollView = this.jiluLayer.getChildByName("scrollView");
		this.view = this.scrollView.getChildByName("view");
		this.content = this.view.getChildByName("content");
		this.header = this.view.getChildByName("header");
		this.Node_1 = this.header.getChildByName("Node_1");
		this.loading = this.Node_1.getChildByName("loading");
		this.btn_back = this.jiluLayer.getChildByName("btn_back");
		this.spr_back = this.btn_back.getChildByName("spr_back");

    }
}
